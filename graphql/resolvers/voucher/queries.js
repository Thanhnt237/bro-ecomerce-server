const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');

const Query = {
    getVouchers: async (parent, args, ctx, info)=>{
        let {ID, search_string, apply_all, sellerID} = args
        let expandCondition = ""

        if(ID){
            expandCondition += ` and ID = '${ID}' `
        }

        if(search_string){
            expandCondition += ` and lower(VOUCHER_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        if(apply_all){
            expandCondition += ` and APPLY_ALL = ${apply_all} `
        }

        if(sellerID){
            expandCondition += ` and SELLER_ID = '${sellerID}' `
        }

        let sql = `
            select *
            from ${TABLE_NAME.VOUCHER}
            where STATE ${expandCondition}
            order by UPDATE_AT desc;
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
