const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");

const Mutation = {
    addNewVouchers: async (parent, args, ctx, info)=>{
        let data = JSON.parse(JSON.stringify(args.vouchers))

        data = data.map(c => {
            return {
                ID: common.genID("V",45),
                ...c,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.VOUCHER, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    updateVoucher: async (parent, args, ctx, info) => {
        let data = JSON.parse(JSON.stringify(args.voucher))
        let condition = {
            ID: data.ID
        }
        data.UPDATE_AT = (new Date()).getTime()
        let sql = common.genUpdateQuery(TABLE_NAME.VOUCHER, data, condition)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    addVoucherRef: async (parent, args, ctx, info) => {
        let {vouchers, products} = args

        let data = []
        for (let voucher in vouchers){
            for (let product in products){
                data.push({
                    ID: voucher + product,
                    VOUCHER_ID: voucher,
                    PRODUCT_ID: product,
                    CREATE_AT: (new Date()).getTime()
                })
            }
        }

        let sql = common.genInsertQuery(TABLE_NAME.REF_VOUCHER_PRODUCT, Object.keys(data[0]), data)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        }catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }

    }


};

module.exports = Mutation;
