const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');
const script_db = require("../../../config/script_db");
const connection = require("../../../config/database_connection");

const Mutation = {
    addNewSeller: async (parent, args, ctx, info)=>{
        let data = JSON.parse(JSON.stringify(args.sellers))

        data = data.map(c => {
            return {
                ID: common.genID("S",45),
                SELLER_NAME: c.SELLER_NAME,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.SELLER, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    updateSeller: async (parent, args, ctx, info) => {
        let standardData = {
            SELLER_NAME: "",
            RATING: "",
            FOLLOWER: "",
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
    }
};

module.exports = Mutation;
