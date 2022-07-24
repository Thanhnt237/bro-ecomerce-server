const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');
const {createTokens, refreshTokens, checkValidityDevice} = require('../../middleware/auth')
const bcrypt = require("bcrypt");
const constants = require("../../../common/constants");
const logger = require("../../../utils/logger");

const Mutation = {
    addNewSeller: async (parent, args, ctx, info)=>{
        console.log(args)
        let data = JSON.parse(JSON.stringify(args.sellers))

        data = data.map(c => {
            return {
                ID: common.genID("S",45),
                ...c,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.SELLER, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            let [token, refreshToken] = await createTokens(data[0])
            return {status: "OK", message: "OK", token: token, refreshToken: refreshToken}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    updateSeller: async (parent, args, ctx, info) => {
        console.log(args)
        let standardData = {
            SELLER_NAME: "",
            RATING: "",
            FOLLOWER: "",
            LOCATION: "",
            STATE: ""
        }
        let data = _.pick(args.seller, Object.keys(standardData))
        data.UPDATE_AT = (new Date()).getTime();
        let condition = _.pick(args.seller, ["ID"])
        let sql = common.genUpdateQuery(TABLE_NAME.SELLER, data, condition)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    sellerLogin: async (parent, args) => {
        let sql = `
          select * 
          from ${TABLE_NAME.SELLER}
          where PHONE_NUMBER = '${args.username}' OR EMAIL = '${args.username}'
        `

        try {
            let [result] = await common.query(sql)

            if(!result.length) throw {status: "KO", message: "Invalid email or phone number"}

            if (args.password !== result[0].PASSWORD) {
                throw {status: "KO", message: "Invalid password"}
            }

            let [token, refreshToken] = await createTokens(result[0])

            return {status: "OK",
                token: token,
                refreshToken: refreshToken,
                seller: result[0]
            }
        }catch (error) {
            logger.error(`${arguments.callee.name} error : ${error.message}`)
            return {status: "KO", ...error}
        }
    },
};

module.exports = Mutation;
