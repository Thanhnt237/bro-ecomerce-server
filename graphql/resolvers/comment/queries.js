const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');

const Query = {
    getCommentOfProduct: async (parent, args, ctx, info)=>{
        let {productID, search_string} = args
        let expandCondition = ""

        if(search_string){
            expandCondition += ` and lower(CATEGORIES_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        let sql = `
            select cmt.*, u.FIRST_NAME, u.LAST_NAME, u.ID as USER_ID
            from ${TABLE_NAME.COMMENT} as cmt
            left join ${TABLE_NAME.USER} as u on cmt.USER_ID = u.ID
            where cmt.STATE and cmt.PRODUCT_ID = '${productID}'
            ${expandCondition}
            order by cmt.UPDATE_AT desc;
        `
        try {
            let [result] = await common.query(sql)
            return result
        }catch (error) {
            console.log(error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Query;
