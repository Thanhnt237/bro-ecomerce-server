const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');

const Query = {
    getCart: async (parent, args, ctx, info)=>{
        let {ID, search_string, userID} = args
        let expandCondition = ""

        if(userID){
            expandCondition += ` and USER_ID = '${userID}' `
        }

        if(search_string){
            expandCondition += ` and lower(CATEGORIES_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        let sql = `
            select c.*, p.PRODUCT_NAME, p.PRICE, p.DELIVERY_PRICE, p.GALLERY
            from ${TABLE_NAME.CART} as c
            left join ${TABLE_NAME.PRODUCT} as p on p.ID = c.PRODUCT_ID
            where c.STATE ${expandCondition}
            order by UPDATE_AT desc;
        `
        try {
            let [result] = await common.query(sql)
            console.log(result)
            return result
        }catch (error) {
            console.log(error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Query;
