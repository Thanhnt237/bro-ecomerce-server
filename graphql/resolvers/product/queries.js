const common = require("../../../common/commonFunction");
const constants = require("../../../common/constants")
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require("lodash")
const {locatedError} = require("graphql");

const Query = {
    getProducts: async (parent, args, ctx, info)=>{
        let {ID, search_string, categoriesID, product_lock, orderBy} = args
        let expandCondition = ""
        let orderByCondition = "ID asc"

        if(ID){
            expandCondition += ` and ID = '${ID}' `
        }

        if(search_string){
            expandCondition += ` and lower(PRODUCT_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        if(categoriesID){
            expandCondition += ` and CATEGORIES_ID = '${categoriesID}' `
        }

        if(product_lock){
            expandCondition += ` and PRODUCT_LOCK = ${product_lock} `
        }

        let orderByLimitation = ["ID", "PRODUCT_NAME", "SELLER_ID", "CATEGORY_ID", "DETAILS",
                                "DESCRIPTION", "PRICE", "PRODUCT_DESCRIPTION", "GALLERY",
                                "CREATE_AT", "UPDATE_AT", "PRODUCT_LOCK"]

        if(orderByLimitation.includes(orderBy.field) && constants.sortLimitation.includes(orderBy.type)){
            orderByCondition = `${orderBy.field} ${orderBy.type}`
        }

        let sql = `
            select *
            from ${TABLE_NAME.PRODUCT}
            where STATE ${expandCondition}
            order by ${orderByCondition};
        `

        try {
            let [result] = await common.query(sql)
            if(result && result.length){
                let sql2 = `
                    select *
                    from ${TABLE_NAME.SELLER}
                    where ID in ('${result.map(c => c.SELLER_ID).join("','")}');

                    select *
                    from ${TABLE_NAME.CATEGORIES}
                    where ID in ('${result.map(c => c.CATEGORY_ID).join("','")}');

                    select vc.*, ref.PRODUCT_ID
                    from ${TABLE_NAME.VOUCHER} as vc
                    left join ${TABLE_NAME.REF_VOUCHER_PRODUCT} as ref on vc.ID = ref.VOUCHER_ID
                    where (!vc.APPLY_ALL and ref.PRODUCT_ID in ('${result.map(c => c.ID).join("','")}'))
                    OR vc.APPLY_ALL;
                `

                let [result2,] = await common.query(sql2)
                let [sellers, categories, vouchers] = result2;

                let sellersPrefix = _.groupBy(sellers, "ID")
                let categoriesPrefix = _.groupBy(categories, "ID")
                let vouchersPrefix = _.groupBy(vouchers, "PRODUCT_ID")

                for(let item of result){
                    if(sellersPrefix[`${item.SELLER_ID}`]){
                        item.SELLER = sellersPrefix[`${item.SELLER_ID}`][0]
                    }

                    if(categoriesPrefix[`${item.CATEGORY_ID}`]){
                        item.CATEGORY = categoriesPrefix[`${item.CATEGORY_ID}`][0]
                    }

                    if(vouchersPrefix[`${item.ID}`]){
                        item.VOUCHER = vouchersPrefix[`${item.ID}`]
                    }
                }

            }

            return result
        }catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Query;
