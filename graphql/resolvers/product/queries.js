const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");

const Query = {
    getProducts: async (parent, args, ctx, info)=>{
        let {ID, search_string} = args
        let expandCondition = ""

        if(ID){
            expandCondition += ` and ID = '${ID}' `
        }

        if(search_string){
            expandCondition += ` and lower(PRODUCT_NAME) like '%${search_string.trim().toLowerCase()}%'`
        }

        let sql = `
            select *
            from ${TABLE_NAME.PRODUCT}
            where STATE;
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
