export type PassportListItem = {
    uid: string,
    name: string,
    qrData: string | Array<string>,
    qrHash: string,
    encryptedQrData: string | Array<string>,
};

export type PassportList = Array<PassportListItem>;