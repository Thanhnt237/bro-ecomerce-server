const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const constants = require("../../../common/constants.js");
const logger = require("../../../utils/logger")
const _ = require('lodash');
const {UserInputError} = require('apollo-server');
const script_db = require("../../../config/script_db");
const connection = require("../../../config/database_connection");

const Mutation = {
    initDatabases: async (parent, args, ctx, info)=>{
        let string_script = script_db; //.replace(/\n/g, ' ');
        string_script = string_script.replace(/\t/g, " ");
        console.log(string_script);
        // console.log(connection);
        try {
            await connection.query(string_script);
            return {status: "OK", message: "OK"}
        } catch (error) {
            console.log("error" + error);
            return {status: "KO", ...error}
        }
    }
};

module.exports = Mutation;
