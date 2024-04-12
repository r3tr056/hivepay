import CryptoJS from 'crypto-js';
import md5 from 'md5';

const keySize = 256;
const iterations = 100;

export const encryptJSON = (json) => {
    json.hash = md5(json.list);
    var msg = encrypt(JSON.stringify(json), pwd);
    return msg;
}

export const decryptToJSON = (msg, pwd) => {
    try {
        let decryptedString = decrypt(msg, pwd).toString(CryptoJS.enc.Utf8);
        let decrypted = JSON.parse(decryptedString);
        if (decrypted.hash && decrypted.hash === md5(decrypted.list)) {
            return decrypted;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        throw new Error('Unable to decrypt');
    }
}

// NOTE : AES encryption with master password
export const encrypt = (msg, pwd) => {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    var key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations,
    });
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    var encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });
    var transmitMessage = salt.toString() + iv.toString() + encrypted.toString();
    return transmitMessage;
}

// NOTE : AES decryption with master password
export const decrypt = (transmitMessage, pwd) => {
    var salt = CryptoJS.enc.Hex.parse(transmitMessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
    var encrypted = transitmessage.substring(64);
    var key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations,
    });
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });
    return decrypted;
}