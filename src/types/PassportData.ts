export type PassportData = {
    loaded: boolean,
    signature: PassportDataSignature,
    patient: PassportDataPaatient,
    doses: PassportDataDoses,
    testResults: PassportDataTestResults,
    qrData: string | Array<string>,
};

export type PassportDataSignature = {
    issuer: string,
    issuedAt: Date | null,
};

export type PassportDataPaatient = {
    names: Array<string>,
    birthDate: Date,
    gender: string,
};

export type PassportDataDoses = Array<PassportDataDose>;

export type PassportDataDose = {
    doseNumber: number,
    date: Date,
    daysAgo: number,
    location: string,
    vaccineCode: string,
    vaccineLot: string,
    notes: Array<string>,
};

export type PassportDataTestResults = Array<PassportDataTestResult>;

export type PassportDataTestResult = {
    diagnosticCode: string,
    testDate: Date | null,
    testDaysAgo: number | null,
    result: string,
    resultDate: Date | null,
    resultDaysAgo: number | null,
}