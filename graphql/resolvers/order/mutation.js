const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');

const Mutation = {
    addNewOrder: async (parent, args, ctx, info)=>{
        let data = JSON.parse(JSON.stringify(args.order))

        let deliveryData = [{
            ID: data.ORDER_ID,
            USER_ID: data.USER_ID,
            NAME: data.NAME,
            PHONE_NUMBER: data.PHONE_NUMBER,
            ADDRESS: data.ADDRESS,
            DELIVERY_METHOD: data.DELIVERY_METHOD,
            DELIVERY_STATE: "SUCCESS",
            TOTAL_PRICE: data.TOTAL_PRICE,
            CREATE_AT: (new Date()).getTime(),
            UPDATE_AT: (new Date()).getTime()
        }]

        let sql = common.genInsertQuery(TABLE_NAME.DELIVERY_INFORMATION, Object.keys(deliveryData[0]), deliveryData)

        let orderData = data.PRODUCTS.map(c => {
            return {
                ID: common.genID("O", 50),
                DELIVERY_INFORMATION_ID: data.ORDER_ID,
                PRODUCT_ID: c.PRODUCT_ID,
                PRODUCT_OPTIONS: c.PRODUCT_OPTIONS,
                QUANTITY: c.QUANTITY,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        sql += common.genInsertQuery(TABLE_NAME.ORDER_DETAILS, Object.keys(orderData[0]), orderData)
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
