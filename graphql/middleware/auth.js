const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const constants = require('../../common/constants')
const {AuthenticationError} = require("apollo-server-express");
const { TABLE_NAME } = require("../../config/tablename");
const common = require("../../common/commonFunction");
const logger = require("../../utils/logger");

module.exports = {
    createTokens: async (user) => {
        const createToken = jwt.sign(
            {
                user: _.pick(user, ['ID']),
            },
            process.env.SECRET_TOKEN,
            {
                expiresIn: constants.TOKEN_EXPIRES_TIME,
            },
        );

        const createRefreshToken = jwt.sign(
            {
                user: _.pick(user, 'ID'),
            },
            process.env.SECRET_TOKEN,
            {
                expiresIn: constants.REFRESH_TOKEN_EXPIRES_TIME,
            },
        );

        return [createToken, createRefreshToken];
    },

    refreshTokens : async (refreshToken, secret, secretAccessToken) => {
        let userId = '';

        try {
            let payload = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);

            if(!payload){
                throw new AuthenticationError('Invalid token');
            }

            if (!payload.user) {
                throw new AuthenticationError('Invalid token');
            }

            userId = payload.user.ID

            let sql = `
                select count(*) as total
                from ${TABLE_NAME.NGUOI_DUNG}
                where ID = '${userId}'
            `


            let [result,] = await common.query(sql)

            if(!result[0].total){
                throw new AuthenticationError('No user found!');
            }

            const createToken = jwt.sign(
                {
                    user: {ID: userId},
                },
                secretAccessToken,
                {
                    expiresIn: constants.TOKEN_EXPIRES_TIME,
                },
            );

            return createToken

        } catch (err) {
            throw err
        }
    },

    verifyToken: async (token) => {
        token = token.split(' ')[1];
        try {
            let payload = jwt.verify(token, constants.SECRET_TOKEN);
            // console.log(payload)
            if(!payload){
                throw new AuthenticationError('Invalid token');
            }

            if (!payload.user) {
                throw new AuthenticationError('Invalid token');
            }

            return payload.user
        } catch (err) {
            throw err
        }
    },

    checkValidityDevice: async (role, valueUniqueDeviceID, userUniqueDeviceID) => {
        if(role === constants.GIANG_VIEN) return true;

        if(!userUniqueDeviceID){
            return true;
        }

        if(valueUniqueDeviceID != userUniqueDeviceID){
            return false;
        }
    },

    tryLogin: async (email, password, models, SECRET, SECRET2) => {
        const user = await models.User.findOne({ where: { email }, raw: true });
        if (!user) {
            // user with provided email not found
            return {
                ok: false,
                errors: [{ path: 'email', message: 'Wrong email' }],
            };
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            // bad password
            return {
                ok: false,
                errors: [{ path: 'password', message: 'Wrong password' }],
            };
        }

        const refreshTokenSecret = user.password + SECRET2;

        const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

        return {
            ok: true,
            token,
            refreshToken,
        };
    }
}