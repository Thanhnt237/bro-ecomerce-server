const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');

const Query = {
    getSeller: async (parent, args, ctx, info)=>{
        console.log(args)
        let {ID, search_string} = args
        let expandCondition = ""

        if(ID){
            expandCondition += ` and ID = '${ID}' `
        }

        if(search_string){
            // expandCondition += ` and lower(SELLER_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        let sql = `
            select *
            from ${TABLE_NAME.SELLER}
            where STATE ${expandCondition};
        `
        try {
            let [result] = await common.query(sql)
            return result
        }catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Query;
