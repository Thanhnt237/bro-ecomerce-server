const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');
const script_db = require("../../../config/script_db");
const connection = require("../../../config/database_connection");

const Mutation = {
    addNewCategories: async (parent, args, ctx, info)=>{
        let data = JSON.parse(JSON.stringify(args.categories))

        data = data.map(c => {
            return {
                ID: common.genID("C",45),
                CATEGORIES_NAME: c.CATEGORIES_NAME,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.CATEGORIES, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    updateCategories: async (parent, args, ctx, info) => {
        let standardData = {
            CATEGORIES_NAME: "",
            STATE: ""
        }
        let data = _.pick(args.category, Object.keys(standardData))
        data.UPDATE_AT = (new Date()).getTime();
        let condition = _.pick(args.category, ["ID"])
        let sql = common.genUpdateQuery(TABLE_NAME.CATEGORIES, data, condition)
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
