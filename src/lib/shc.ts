/*
Adapted from https://github.com/chriscokid/shc-qr-code-decoder - Original copyright (c) 2021 Pierre-Olivier NAHOUM - MIT License
*/

import * as jose from 'node-jose';
import * as zlib from 'zlib';

//Types
import { PassportData } from 'types/PassportData';

function calcDaysAgo(date: any) {
    return Math.ceil((new Date().getTime() - new Date(date).getTime()) / (1000 * 24 * 60 * 60));
}

function qrDataToJWS(qrData: string): string {
    let result = "";
    for (let i = 0; i < qrData.length - 1; i = i + 2) {
        let pairs = qrData[i] + qrData[i + 1];
        let parsedInt = parseInt(pairs, 10) + 45;
        result += String.fromCharCode(parsedInt);
    }

    return result;
}

function decodeHeader(jws: string): string {
    const headerStr = jws.split('.')[0];

    if (!headerStr) {
        throw new Error('JWS did not contain a header part.');
    }

    const decodedHeader = atob(headerStr);

    return JSON.parse(decodedHeader);
}

async function decodePayload(jws: string): Promise<string> {
    const payloadStr = jws.split('.')[1];

    if (!payloadStr) {
        throw new Error('JWS did not contain a payload part.');
    }

    const decodedPayload = Buffer.from(payloadStr, 'base64');

    return new Promise((resolve, reject) => {
        zlib.inflateRaw(decodedPayload, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(res.toString('utf8')));
            }
        });
    });
}

async function verifyJWS(jws) {
    const publicKey = {
        alg: "ES256",
        kty: "EC",
        crv: "P-256",
        use: "sig",
        kid: "fFyWQ6CvV9Me_FkwWAL_DwxI_VQROw8tyzSp5_zI8_4",
        x: "XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do",
        y: "88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0",
    };

    try {
        const key = await jose.JWK.asKey(publicKey);
        const { verify } = jose.JWS.createVerify(key);

        await verify(jws);

        return true;
    }
    catch (err: any) {
        if (err && err.message) {
            throw new Error(err.message);
        }

        throw new Error(err);
    }
}

function parseSHC(header: any, payload: any, qrData: string) {
    try {
        if (payload.iss !== 'https://covid19.quebec.ca/PreuveVaccinaleApi/issuer') {
            throw new Error('wrong_issuer:' + payload.iss);
        }

        if (header.alg !== 'ES256') {
            throw new Error('wrong_alg:' + header.alg);
        }

        try {
            let entries = payload.vc.credentialSubject.fhirBundle.entry;

            const result = {} as PassportData;

            //Signature
            result.signature = {
                issuer: payload.iss,
                issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
            };

            //Trouver le patient
            let patients = entries.filter(
                (entry: any) =>
                    entry
                    && entry.resource
                    && entry.resource.resourceType
                    && entry.resource.resourceType === 'Patient'
            );

            if (patients.length === 0) {
                throw new Error('SHC does not contain any patient.');
            }

            if (patients.length > 1) {
                throw new Error('SHC contains more than one patient.');
            }

            let patient = patients[0];

            //Patient
            result.patient = {
                names: patient.resource.name.map(
                    (name: any) => {
                        let family = '';
                        if (name.family instanceof Array) {
                            family = name.family.join(' ');
                        } else {
                            family = name.family;
                        }

                        let given = '';
                        if (name.given instanceof Array) {
                            given = name.given.join(' ');
                        } else {
                            given = name.given;
                        }

                        return family + ', ' + given;
                    }
                ),
                birthDate: patient.resource.birthDate,
                gender: patient.resource.gender,
            };

            //Doses
            let doses = entries.filter(
                (entry: any) =>
                    entry
                    && entry.resource
                    && entry.resource.resourceType
                    && entry.resource.resourceType === 'Immunization'
                    && entry.resource.patient
                    && entry.resource.patient.reference
                    && entry.resource.patient.reference === 'resource:0'
                    && entry.resource.status
                    && entry.resource.status.toLowerCase() === 'completed'
            );

            result.doses = doses.map((dose: any, doseIndex: number) => {
                return {
                    doseNumber: dose.resource.protocolApplied?.doseNumber || doseIndex + 1,
                    date: new Date(dose.resource.occurrenceDateTime),
                    daysAgo: calcDaysAgo(dose.resource.occurrenceDateTime),
                    location: dose.resource.location?.display,
                    vaccineCode: dose.resource.vaccineCode.coding[0].code,
                    vaccineLot: dose.resource.lotNumber,
                    notes: dose.resource.note?.map((note: any) => note.text),
                }
            });

            //Résultats de tests
            let testResults = entries.filter(
                (entry: any) =>
                    entry
                    && entry.resource
                    && entry.resource.resourceType
                    && entry.resource.resourceType === 'DiagnosticReport'
            );

            result.testResults = testResults.map((testResult: any) => {
                return {
                    diagnosticCode: testResult.resource.code.coding[0].code,
                    testDate: testResult.resource.effectiveDateTime ? new Date(testResult.resource.effectiveDateTime) : null,
                    testDaysAgo: testResult.resource.effectiveDateTime ? calcDaysAgo(testResult.resource.effectiveDateTime) : null,
                    result: testResult.resource.conclusion ? testResult.resource.conclusion.toLowerCase() : null,
                    resultDate: testResult.resource.issued ? new Date(testResult.resource.issued) : null,
                    resultDaysAgo: testResult.resource.issued ? calcDaysAgo(testResult.resource.issued) : null,
                };
            });

            result.qrData = qrData;
            result.loaded = true;

            return result;
        }
        catch (err: any) {
            if (err && err.message) {
                throw new Error(err.message);
            }

            throw new Error(err);
        }
    } catch (err: any) {
        if (err && err.message) {
            throw new Error(err.message);
        }

        throw new Error(err);
    }
}

export async function decodeSHC(qrData: string | Array<string>) {
    //Si c'est une array, on réassemble
    if (qrData && Array.isArray(qrData)) {
        let newQrData = '';

        qrData.forEach((chunk, index) => {
            const shcData = chunk.substr(5);
            const shcParts = shcData.split('/');

            //Codes QR pas vraiment chunké ?
            if (shcParts.length !== 3) {
                throw new Error('Chunked SHC was not really chunked.');
            }

            let shcPartNum: number = Number.parseInt(shcParts[0]);
            let shcPartCount: number = Number.parseInt(shcParts[1]);

            //Sanity checks
            if (shcPartCount !== qrData.length) {
                throw new Error('Chunked SHC part count mismatch.');
            }

            if (shcPartNum !== index + 1) {
                throw new Error('Chunked SHC part order mismatch.');
            }

            //Assembler
            newQrData += shcParts[2];
        });

        //String finale
        qrData = 'shc:/' + newQrData;
    }

    if (qrData && qrData.startsWith('shc:/')) {
        const shcData = qrData.substr(5);
        const shcParts = shcData.split('/');

        //Codes QR chunké pas supportés pour le moment
        if (shcParts.length !== 1) {
            throw new Error('Chunked SHC should have been assembled first.');
        }

        const jws: string = qrDataToJWS(shcParts[0]);

        try {
            let header = decodeHeader(jws);
            let payload = await decodePayload(jws);

            try {
                await verifyJWS(jws);
            }
            catch (err: any) {
                if (err && err.message) {
                    throw new Error('invalid_signature:' + err.message);
                }

                throw new Error('invalid_signature:' + err);
            }

            let shc = parseSHC(header, payload, qrData);

            return JSON.stringify(shc);
        } catch (err: any) {
            if (err && err.message) {
                throw new Error(err.message);
            }

            throw new Error(err);
        }
    } else {
        throw new Error('not_shc:' + qrData.substring(0, 200));
    }
}
