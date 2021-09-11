export type PassportListItem = {
    uid: string,
    name: string,
    qrData: string,
    qrHash: string,
    encryptedQrData: string,
};

export type PassportList = Array<PassportListItem>;