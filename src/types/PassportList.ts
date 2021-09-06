export type PassportListItem = {
    uid: string,
    name: string,
    qrData: string,
    encryptedQrData: string,
};

export type PassportList = Array<PassportListItem>;