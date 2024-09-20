import crypto from 'crypto';

const encryptAES = (plaintext: string, keyString: string = process.env.NEXT_PUBLIC_KEYSTRING || "null", mode: 'ECB' | 'CBC' = "ECB"): string => {

    const key = crypto.createHash('sha256').update(keyString).digest().slice(0, 16); // AES-128 key must be 16 bytes
    const keyBuffer = Buffer.from(key);

    let cipher: crypto.Cipher;
    let encrypted: Buffer;

    if (mode === 'ECB') {
        cipher = crypto.createCipheriv('aes-128-ecb', keyBuffer, Buffer.alloc(0));
        cipher.setAutoPadding(true);
        const plaintextBuffer = Buffer.from(plaintext, 'utf8');
        encrypted = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
    } else {
        throw new Error("Only ECB mode is supported in this example.");
    }

    return encrypted.toString('hex');
};


const decryptAES = (ciphertext: string, keyString: string = process.env.NEXT_PUBLIC_KEYSTRING || "null", mode: 'ECB' | 'CBC' = "ECB"): string => {

    const key = crypto.createHash('sha256').update(keyString).digest().slice(0, 16); // AES-128 key must be 16 bytes
    const keyBuffer = Buffer.from(key);

    let decipher: crypto.Decipher;
    let decrypted: Buffer;

    if (mode === 'ECB') {
        decipher = crypto.createDecipheriv('aes-128-ecb', keyBuffer, Buffer.alloc(0));
        decipher.setAutoPadding(true);
        const ciphertextBuffer = Buffer.from(ciphertext, 'hex');
        decrypted = Buffer.concat([decipher.update(ciphertextBuffer), decipher.final()]);
    } else {
        throw new Error("Only ECB mode is supported in this example.");
    }

    return decrypted.toString('utf8');
};

export { encryptAES, decryptAES };