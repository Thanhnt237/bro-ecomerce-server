const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');

const Query = {
    getOrders: async (parent, args, ctx, info)=>{
        let {ID, userID, search_string} = args
        let expandCondition = ""

        if(ID){
            expandCondition += ` and ID = '${ID}' `
        }

        if(userID){
            expandCondition += ` and d.USER_ID = '${userID}' `
        }

        if(search_string){
            expandCondition += ` and lower(CATEGORIES_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        let sql = `
            select d.*
            from ${TABLE_NAME.DELIVERY_INFORMATION} as d
            where d.STATE ${expandCondition}
            order by d.UPDATE_AT desc;
        `
        try {
            let [result] = await common.query(sql)
            if(result.length){
                let arrOrderID = result.map(c => c.ID)
                let sql2 = `
                    select o.ID, o.DELIVERY_INFORMATION_ID, o.QUANTITY, p.*
                    from ${TABLE_NAME.ORDER_DETAILS} as o
                    left join ${TABLE_NAME.PRODUCT} as p on o.PRODUCT_ID = p.ID
                    where DELIVERY_INFORMATION_ID in ('${arrOrderID.join("','")}');
                `
                let [result2,] = await common.query(sql2)
                let orderPrefix = _.groupBy(result2, "DELIVERY_INFORMATION_ID")
                result.forEach(item => {
                    if(orderPrefix[`${item.ID}`]){
                        item.PRODUCTS = orderPrefix[`${item.ID}`]
                    }
                })
            }
            return result
        }catch (error) {
            console.log(error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Query;
