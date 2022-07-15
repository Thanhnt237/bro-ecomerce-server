const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');

const Mutation = {
    addNewProduct: async (parent, args)=>{
        let data = JSON.parse(JSON.stringify(args.products))

        data = data.map(c => {
            return {
                ID: common.genID("P",45),
                ...c,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.PRODUCT, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    updateProduct: async (parent, args, ctx, info) => {
        let data = JSON.parse(JSON.stringify(args.product))
        let condition = {
            ID: data.ID
        }
        data.UPDATE_AT = (new Date()).getTime()
        let sql = common.genUpdateQuery(TABLE_NAME.PRODUCT, data, condition)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Mutation;
