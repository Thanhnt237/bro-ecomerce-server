const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');

const Mutation = {
    addToCart: async (parent, args, ctx, info)=>{
        console.log(args)
        let data = JSON.parse(JSON.stringify(args.productID))

        data = data.map(c => {
            return {
                ID: common.genID("C",45),
                ...c,
                USER_ID: args.userID,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = ""

        for(let item of data){
            sql += common.genInsertQuery(TABLE_NAME.CART, Object.keys(data[0]), [item])
            sql = sql.split(";")[0]
            sql += `on duplicate key update COUNT_PRODUCT = COUNT_PRODUCT + ${item.COUNT_PRODUCT} `
        }

        // let sql = common.genInsertQuery(TABLE_NAME.CART, Object.keys(data[0]), data)
        console.log(sql)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log(error);
            return {status: "KO", ...error}
        }
    },
    removeItemFromCart: async (parent, args, ctx, info) => {
        console.log(args)
        let sql = ` update ${TABLE_NAME.CART} set STATE = false where ID in ('${args.ID.join("','")}')`

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log(error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Mutation;
