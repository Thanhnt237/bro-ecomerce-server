const axios = require("axios").default;
const common = require("../../common/commonFunction");
const constants = require("../../common/constants.js");
const { TABLE_NAME } = require("../../config/tablename");
const logger = require("../../utils/logger");

module.exports = {
    saveFCMToken: async (input) => {
        let {ID, FCM_TOKEN} = input
        let sql = `
        update ${TABLE_NAME.NGUOI_DUNG} set FCM_TOKEN = '${FCM_TOKEN}' where ID = '${ID}';
    `
        try {
            await common.query(sql)
        }catch(err){
            throw err
        }
    },

    pushNotify: async (fcm_token, title, content, data) => {
        let config = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": constants.FIREBASE_AUTHOR_KEY
            }
        }

        // console.log(config)

        let body = {
            "to": fcm_token,
            "notification": {
                "title": title,
                "body": content,
                "mutable_content": true,
                "sound": "default",
                "android_channel_id": "500"
            },
            "message": data
        }
        // console.log(data)
        // console.log(body)

        let url = 'https://fcm.googleapis.com/fcm/send'

        try{
            await axios.post(url, body, config)
        }catch(error){
            throw error
        }
    },

    luuThongBao: async (listNguoiDungID, title, content) => {
        let arrProps = ["ID", "NGUOI_DUNG_ID", "NGAY_THONG_BAO", "GIO_THONG_BAO", "TIEU_DE", "NOI_DUNG"]
        let dataNoti = listNguoiDungID.map(l => {
            return{
                ID: common.genID("NF",20),
                NGUOI_DUNG_ID: l,
                NGAY_THONG_BAO: (new Date()).getTime(),
                GIO_THONG_BAO: (new Date()).getTime(),
                TIEU_DE: title,
                NOI_DUNG: content
            }
        })
        let sql = common.genInsertQuery(TABLE_NAME.NOTIFICATION, arrProps, dataNoti);

        try {
            await common.query(sql)
            return {status: "OK", message: "OK"}
        }catch (error) {
            logger.error(`${arguments.callee.name} error : ${error.message}`)
            throw error
        }
    }
}