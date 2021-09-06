//Libs
import * as localForage from 'localforage';
import * as aesjs from 'aes-js';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from 'react-movable';

//Types
import { PassportList, PassportListItem } from 'types/PassportList';

export const getUserUuid = async (): Promise<string> => {
    let userUuid = await localForage.getItem<string>('userUuid');

    if (userUuid === null) {
      let newUserUuid = uuidv4();
      await localForage.setItem('userUuid', newUserUuid);

      return newUserUuid;
    }

    return userUuid;
}

function qrDataKey() {
  let strKey = process.env.REACT_APP_QR_DATA_AES_KEY;

  let key = strKey?.split('').map(s => s.charCodeAt(0));

  return key;
}

function encryptQrData(qrData) {
  var textBytes = aesjs.utils.utf8.toBytes(qrData);
  var aesCtr = new aesjs.ModeOfOperation.ctr(qrDataKey());
  var encryptedBytes = aesCtr.encrypt(textBytes);
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

  return encryptedHex;
}

function decryptQrData(encryptedQrData) {
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedQrData);
  var aesCtr = new aesjs.ModeOfOperation.ctr(qrDataKey());
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedText;
}

export const getPassports = async (): Promise<PassportList> => {
  let passports = await localForage.getItem<PassportList>('passports');

  if (!passports) {
    return [];
  }

  return passports.map((passport: PassportListItem) => {
    passport.qrData = decryptQrData(passport.encryptedQrData);

    return passport;
  });
}

export const setPassports = async (passports: PassportList): Promise<void> => {
  let cleanPassports = passports.map((passport: PassportListItem) => {
    passport.encryptedQrData = encryptQrData(passport.qrData);
    passport.qrData = '';

    return passport;
  });

  await localForage.setItem('passports', cleanPassports);
  await localForage.setItem('passportCount', cleanPassports.length);
}

export const addPassport = async (name: string, qrData: string): Promise<void> => {
  let passports = await getPassports();

  let newPassport = {} as PassportListItem;
  newPassport.name = name;
  newPassport.qrData = qrData;
  newPassport.uid = Date.now().toString();

  passports.push(newPassport);

  await setPassports(passports);
}

export const deletePassport = async (uid: string): Promise<void> => {
  let passports = await getPassports();

  passports = passports.filter((passport) => {
    return passport.uid !== uid;
  });

  await setPassports(passports);
}

export const swapPassport = async (oldIndex: number, newIndex: number): Promise<PassportList> => {
  let passports = await getPassports();

  let sortedPassports = arrayMove(passports, oldIndex, newIndex);

  await setPassports(sortedPassports);

  return sortedPassports;
}

export const getPassportCount = async (): Promise<number> => {
  let passportCount = await localForage.getItem<number>('passportCount');

  return passportCount || 0;
}

export const initData = () => {
  const asyncInitData = async() => {
    getUserUuid();

    let passportVersion: number|null = await localForage.getItem<number>('passportVersion');

    //Data migrations
    if (!passportVersion || passportVersion < 2) {
      await setPassports([]);
      await localForage.setItem('passportVersion', 2);
    }
  }

  asyncInitData();
};