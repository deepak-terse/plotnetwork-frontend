import { GoogleSpreadsheet } from "google-spreadsheet";

// Config variables
// const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
// const SHEET_ID = process.env.REACT_APP_SHEET_ID;
// const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
// const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const SPREADSHEET_ID = "1pSF274WbAM5LoIr6cbWq2W3mrC65leKBOTCgNwMx7jc";
const SHEET_ID = "1227033294";
const CLIENT_EMAIL = "plot-network-gsheet@plot-network.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCZuchIKdyvOutN\nsUu/eybp8JYOB+Xe7FaxCg5bs1zAnBkbt+mnrEmUXjER6yu/lMy34tkl3yz2StX/\nA/hZLzAIQq0dFdrNXtAL116NOwZBLts/MGToiXvg/gSag/46f34QByQxKzIBMlUE\nd7AAI7dbZixiV0xf6ZZ2kmhPtwD2m5KzoqDR/pszP2zmERQTn9nwfjrZL5/G1VOk\nm6FgRWxyVYWGquRCVARe8fcNQMlcBWIKm8+Q4pZOnPd5fPwgymL/RBey1Fj8APR3\n1pTRSarRbVTYndKy56ey81eLigXBn05yvcjq5uAYnSwMjaBG/uh02sdm8UIIR68X\naMOLmEEBAgMBAAECggEAANRFNcpwA8v0D/e4WmCOLa3cCVhWj5TDxPGycSEvC2Ts\nJ7+etYZS4Ud+yUN0+XQShJ1nIXKqOeveaqE5WjXMcwb1CxaelwP/aEjxnB5o4rof\neaBHsw9myShlmvXCTct5QRngwpkijGoalksU+nM23nnXHHKvGUdXxez1PhTVHv9m\nrzoSQguWQeLjDBL/UeVqNwpF7KvDSiCy9dbtkyxTZQCuZ0AoigwueQWviERkuG7U\nKnELuzMzmtxitnQldlh3rIs7QG32QsDv0b4c3SzQ4g1smZjSy37+0wrTaQ3JIpNp\n1Xk1HLWE+/6MGeZWEe82pY5zYbcZKvHr6Ix1NI5UfwKBgQDPvVZ2dIeQeSJYobGM\n9JtyV/hDRNRQSuLuRHLxn1Z+wwczAwEWk//4TUC04vsGOxL+7+g47X8pJLQx9y5Q\nTPXmoh9D3QEiLEnC9P273BxVB/rscTHaLe4z1ZxOw3lQO32qhikeqjSDeeZV8AOc\n8eunrr8R7M2M5hfL95sowz41qwKBgQC9cCNCinoU4pBF5uu8EF0Je+0wd/pMTfgg\nMBTVVozAjCDEQs3NiCYL6+uEGauE+XFpEGjfPbBU27Q29erLVd9VnJQjYROHZu10\nXlMoaOqq+WIA1Hei1YLQ5TJ/Re6JFjWe789DHdcnvo42d3hK1LBXwJs15mt8nZij\natp0wLjgAwKBgQCobxq4ppj4Ac9gT5HW+MlEt6DaYedHRsCicatEz21hEB45NRlf\nxhYHrBNn1pWzopgvTjNaXO36XQEhdgn+H7hNDGwPKRTvMTuJL/y+oaPzKapApTLH\ndPAq5Op8Ti+BZwroBSk37MbxRxgD27wCN4Bbj+rpzLeIo1LuFM+gCFXbSwKBgQCg\nU8njxSMxjdag8qFMl2TGZBYIUWKLNensBAV90TRqua35rLhVXQcmS9MWCEu7zQmI\n7BR169XS2+cYJOVEljbgVBakIsLOc/Q/6pzitHj3nvysyyU9sQp4FaK5SMxrRVq4\nWynFGfpAbuwZeN9cJcnhWueBpLQP0amflQ2yhnFxVQKBgBuL65bAEP0aeIuSJ34m\nSwUdzxQnu5DiJ/z0hIV/I64CpmE6BAVp6wtL/vXoulwsDuJ5fDPbKC/R189zYIm1\nSCUQAsDQ7BV9Gb2+14i0hRHi7bVYD/bc8rdYSV8Pv9DrFlOu2ozD4lZ1ZTSLE5Ma\n17fHysZjOOq/+a0aZtcvyvuH\n-----END PRIVATE KEY-----\n";

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
let sheet;

export const gSheetInit = async () => {
    try {
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });
        // loads document properties and worksheets
        await doc.loadInfo();
    
        sheet = doc.sheetsById[SHEET_ID];
    } catch (e) {
      console.error('Error: ', e);
    }
};

export const getAllLeads = async () => {
    if(!sheet) {
        await gSheetInit();
    }
    return await sheet.getRows();
}

