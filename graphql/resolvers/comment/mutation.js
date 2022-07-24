const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');

const Mutation = {
    addNewComment: async (parent, args, ctx, info)=>{
        console.log(args)
        let data = JSON.parse(JSON.stringify(args.comment))

        data = data.map(c => {
            return {
                ID: common.genID("CMT",45),
                ...c,
                CREATE_AT: (new Date()).getTime(),
                UPDATE_AT: (new Date()).getTime()
            }
        })

        let sql = common.genInsertQuery(TABLE_NAME.COMMENT, Object.keys(data[0]), data)
        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log(error);
            return {status: "KO", ...error}
        }
    },
    removeComment: async (parent, args, ctx, info) => {
        console.log(args)
        let data = JSON.parse(JSON.stringify(args.comment))
        let condition = {
            ID: data.ID
        }
        data.UPDATE_AT = (new Date()).getTime()
        let sql = common.genUpdateQuery(TABLE_NAME.COMMENT, data, condition)
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
