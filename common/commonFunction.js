(function () {
	const _ = require("lodash");
	const mysql = require('mysql2');
	const db_connection = require("../config/database_connection")
	const constants = require("./constants");
	const { TABLE_NAME } = require('../config/tablename');

	const common = {



		/**
		 * TODO: generate string id
		 * @param {*} prefix : tiền tố .
		 */
		genID: function (prefix,  maxSize = 45) {
			if (prefix) {
				maxSize = maxSize - prefix.length - 1;
			}
			let current_time = new Date().getTime();
			let rand = Math.floor(Math.random() * (Math.floor(Math.random() * 1000) - Math.floor(Math.random() * 100) + 600) + Math.floor(Math.random() * 100));
			let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + (current_time * rand);
			let result;

			let str = Array(maxSize).join().split(',').map(function () { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
			if (!!prefix) {

				result = `${prefix.toLocaleUpperCase()}-${str}`;
			} else {
				result = `${str}`;
			}

			return result;


		},
		/**
		 * TODO: common function: execute any with string query
		 * @param {*} str_sql
		 */
		query: async function (str_sql) {
			console.log(str_sql)
			try {
				const [rows, fields] = await db_connection.query(str_sql);
				return [rows, fields];
			} catch (error) {
				throw {  message : `${error.message}. ${error.sqlMessage}` }
			}
		},

		return_connection: async function (){
			return db_connection.getConnection();
		},
		/**
		 * TODO: chuyển các dữ liệu null của mảng thành string
		 */
			convert_null: async function (arr){
				arr.forEach((item) => {
					Object.keys(item).forEach(function(key) {
						if(item[key] === null) {
							item[key] = '';
						}
					})
				});
			},

		/**
		 *
		 * @param {*} tableName
		 * @param {*} arrProps : //các cột
		 * @param {Array<Object>} data phải là mảng
		 * @param is_IGNORE
		 */
		genInsertQuery: function (tableName, arrProps, data, is_IGNORE=false) {
			let data_insert = [];
			let sql = "";

			for (let item of data) {
				let str_val_item = "(";
				for (let key in item) {
					if (item.hasOwnProperty(key)) {
						let data_type = typeof item[key];
						switch (data_type) {
							case "string":
								str_val_item += "'" + item[key] + "',";
								break;
							case "number": case "boolean":
								str_val_item += item[key] + ",";
								break;
							default:
								str_val_item += "null,";
								break;
						}

					}
				};
				str_val_item = str_val_item.substring(0, str_val_item.length - 1);
				str_val_item += ")";
				data_insert.push(str_val_item)
			}

			if (data_insert.length > 0) {
				sql = `INSERT ${is_IGNORE ? 'IGNORE':''} INTO ${tableName} (${arrProps.join()}) VALUES ${data_insert.join()};`;
				// console.log(sql)
			}
			return sql;
		},

		/** gen sql insert, nếu tồn tại thì update
		 *
		 * @param {*} tableName
		 * @param {*} arrProps : //các cột
		 * @param {*} data : Obj
		 */
		 genInsertQueryUpdate: function (tableName, arrProps, data, columnReplace) {

			let sql = "";
			let replacement = "";
			let values = []

			let str_val_item = "(";
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					let data_type = typeof data[key];
					switch (data_type) {
						case "string":
							str_val_item += "'" + data[key] + "',";
							break;
						case "number": case "boolean":
							str_val_item += data[key] + ",";
							break;
						default:
							str_val_item += "null,";
							break;
					}
				}
			};

			str_val_item = str_val_item.substring(0, str_val_item.length - 1);
			str_val_item += ")";

			replacement += this.genInsertQueryUpdateHelper(data, replacement, columnReplace)
			sql = `INSERT INTO ${tableName} (${arrProps.join()}) VALUES ${str_val_item} ${replacement};`;
			return sql;
	},
	genInsertQueryUpdateHelper: function(data, replacement, columnReplace){
		columnReplace.map((item, index) => {
			if(index === 0){
				replacement += "ON DUPLICATE KEY UPDATE "
			}
			let replaceStr = ""
			let data_type = typeof data[`${item}`];
			switch (data_type) {
				case "string":
					replaceStr = "'" + data[`${item}`] + "',";
					break;
				case "number": case "boolean":
					replaceStr = data[`${item}`] + ",";
					break;
				default:
					replaceStr = "null,";
					break;
		}
			replacement += `${item} = ${replaceStr}`
		})
		replacement = replacement.substring(0, replacement.length - 1);
		return replacement;
	},
		/**
		 * TODO: generate string id
		 * @param {*} prefix : tiền tố . String!
		 * @param {*} tableName : bảng điều kiện. String!
		 * @param {*} maxsize : Kích cỡ lớn nhất. Number!
		 * @param {*} condition : giá trị điều kiện. Array {BENH_VIEN_ID: 'H-0329378946'}
		 */
		genSequenceID: async function (prefix, tableName, check_field, maxSize = 10, condition) {
		let expendCondition = ""

		if(condition){
			for (const [key, value] of Object.entries(condition)) {
				expendCondition += `and ${key} = '${value}'`;
			}
		}

		let sql = `
				select cast(SUBSTR(${check_field},${prefix.length+1}) as DECIMAL) as number_convert
				from (select ${check_field}
					from ${tableName}
					where ${check_field} rlike '^${prefix}[0-9]'
					      and LENGTH(${check_field}) = ${maxSize+prefix.length}
						  ${expendCondition}
					order by ${check_field} DESC) as temp_table
				order by number_convert DESC limit 1;
			`
		console.log(sql);
		try {
			let [result,] = await this.query(sql)
			console.log(result);
			if(!result.length){
				let gen0 = Math.pow(10,maxSize-1).toString().slice(1)
				return `${prefix}${gen0}1`
			}
			let index = result[0][Object.keys(result[0])[0]]
			index = Number(index)+1
			if(index.toString().length < maxSize){
				maxSize = maxSize - index.toString().length;
				let gen0 = Math.pow(10,maxSize).toString().slice(1)
				return `${prefix}${gen0}${index}`
			}else{
				return `${prefix}${index}`
			}

		} catch (error) {
			throw error
		}

		// console.log(index.toString().length);

	},

		/**
		 *
		 * @param {*} tableName Ten banr
		 * @param {*} data {column:"Value"}
		 * @param {*} condition {column:"value"}
		 * @returns
		 */
		genUpdateQuery: function(tableName,data,condition){
			let sql = `update ${tableName} set `
			for (var key in data){
				let column,value
				column = key
				value = data[key]
				if (typeof value == "boolean") {
					sql +=`${key} = ${value},`
				}else if (typeof value != "undefined" && value != null) {
					sql +=`${key} = '${value}',`
				}
			}
			let conditionArr = []
			for (var con in condition){
				let column,value
				column = con
				value = condition[con]
				conditionArr.push(` ${column} = '${value}' `)
			}
			sql = sql.slice(0, sql.length -1)
			sql += ` where ${conditionArr.join("AND")};`
			if (data == {}) return ""
			return sql
		},

	formatErrors: function (e, models) {
		if (e instanceof models.sequelize.ValidationError) {
			//  _.pick({a: 1, b: 2}, 'a') => {a: 1}
			return e.errors.map(x => _.pick(x, ['path', 'message']));
		}
		return [{ path: 'name', message: 'something went wrong' }];
	},

		/** gen sql insert, nếu tồn tại thì update
		 *
		 * @param {*} tableName
		 * @param {*} arrProps : //các cột
		 * @param {*} data : Arr
		 * @param {*} columnReplace : cot thay the
		 */
		genInsertOnDuplicateQueryV2: function (tableName, arrProps, dataArr, columnReplace,replacement) {
			let sql = "";
			let insertString = this.genInsertQuery(tableName,arrProps,dataArr)
			if (!replacement){
				let replace = []
				for (var column of columnReplace){
					replace.push(`${column} = VALUES(${column})`)
				}
				replacement = replace.join()
			}
			// replacement += this.genInsertOnDuplicateQueryHelper(data, replacement, columnReplace)
			sql = `${insertString.slice(0,insertString.length - 1)} ON DUPLICATE KEY UPDATE ${replacement};`;
			return sql;
		},
};


	module.exports = common;
})();
