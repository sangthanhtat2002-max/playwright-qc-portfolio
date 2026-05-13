import dotenv from 'dotenv';
dotenv.config();

export const testData = {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
    users: {
        standard: {
            username: process.env.STANDARD_USER || 'standard_user',
            password: process.env.PASSWORD || 'secret_sauce',
        },
        locked: {
            username: process.env.LOCKED_USER || 'locked_out_user',
            password: process.env.PASSWORD || 'secret_sauce',
        },
    },
};