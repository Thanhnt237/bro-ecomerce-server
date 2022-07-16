const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const logger = require("../../../utils/logger")
const {createTokens} = require("../../middleware/auth");

const Mutation = {
    addNewUser: async (parent, args)=>{
        let data = JSON.parse(JSON.stringify(args.users))

        data = data.map(c => {
            return {
                ID: common.genID("U",45),
                ...c,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.USER, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            let [token, refreshToken] = await createTokens(data[0])
            return {status: "OK", message: "OK", token: token, refreshToken: refreshToken}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    updateUser: async (parent, args, ctx, info) => {
        let data = JSON.parse(JSON.stringify(args.user))
        let condition = {
            ID: data.ID
        }
        let sql = common.genUpdateQuery(TABLE_NAME.SELLER, data, condition)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    userLogin: async (parent, args) => {
        console.log(args)
        let sql = `
          select * 
          from ${TABLE_NAME.USER}
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
                user: result[0]
            }
        }catch (error) {
            logger.error(`${arguments.callee.name} error : ${error.message}`)
            return {status: "KO", ...error}
        }
    }
};

module.exports = Mutation;
