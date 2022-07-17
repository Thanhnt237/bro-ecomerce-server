const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');

const Mutation = {
    addToCart: async (parent, args, ctx, info)=>{
        let data = JSON.parse(JSON.stringify(args.categories))

        data = data.map(c => {
            return {
                ID: common.genID("C",45),
                ...c,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.CART, Object.keys(data[0]), data)

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    },
    removeFromCart: async (parent, args, ctx, info) => {
        console.log(args)
        let data = JSON.parse(JSON.stringify(args.category))
        let condition = {
            ID: data.ID
        }
        data.UPDATE_AT = (new Date()).getTime()
        if(data.STATE === false){
            data.SLUG = (new Date()).getTime() + '-' + common.genID(null, 20)
        }
        let sql = common.genUpdateQuery(TABLE_NAME.CATEGORIES, data, condition)
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
