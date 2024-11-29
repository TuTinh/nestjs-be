const bcrypt = require('bcrypt');

const saltOrRounds = 10;

export const hashPassword = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltOrRounds);
    } catch (error) {
        console.log(error);
    }
}
