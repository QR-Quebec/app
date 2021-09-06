//Libs
import * as localForage from 'localforage';

//Data
import { getPassports } from 'lib/data';

export async function calcUsedPassports(): Promise<number> {
    let passports = await getPassports();
    return passports.length;
}

export async function calcMaxPassports(): Promise<number> {
    let maxPassports = process.env.REACT_APP_MAX_PASSPORTS_FREE;

    let licences = await localForage.getItem<Array<string>>('licences');

    if (licences) {
        let licenceProducts: Array<String> = licences.map((licenceItem: any) => { return licenceItem.product });

        if (licenceProducts.includes('QRQC-PASSPORT-CROWD')) {
            maxPassports = process.env.REACT_APP_MAX_PASSPORTS_CROWD;
        } else if (licenceProducts.includes('QRQC-PASSPORT-GROUP')) {
            maxPassports = process.env.REACT_APP_MAX_PASSPORTS_GROUP;
        } else if (licenceProducts.includes('QRQC-PASSPORT-FAMILY')) {
            maxPassports = process.env.REACT_APP_MAX_PASSPORTS_FAMILY;
        }
    }

    return Number.parseInt(maxPassports || '0');
}

export async function canAddPassport(): Promise<boolean> {
    let usedPassports = await calcUsedPassports();
    let maxPassports = await calcMaxPassports();

    return (usedPassports < maxPassports);
}
