import bcrypt from 'bcryptjs';

export async function hashPass(password) {
    return bcrypt.hash(password, 12).then((hash) => {
        return hash;
    });
}

export async function verifyPass(plainText, hash) {
    let isValid = false;

    try {
        await bcrypt.compare(plainText, hash).then((result) => {
            isValid = result;
        });
    } catch (err) {
        console.error(err);
    }

    return isValid;
}
