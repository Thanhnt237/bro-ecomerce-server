const _ = require("lodash");
const vn_zone = 'Asia/Ho_Chi_Minh';
// const vn_zone = 'America/Los_Angeles'
const moment = require("moment-timezone");

function ConvertTime() {
    this.getCurrentDate = getCurrentDate;
    this.hienThiNgayGio - hienThiNgayGio;
    this.convertMiliToStringTime = convertMiliToStringTime;
    this.getCurrentHour = getCurrentHour;
    this.fileRenamer = fileRenamer;
}

module.exports = new ConvertTime;

function getCurrentDate(mili){
    if(mili){
        return moment.tz(new Date(mili),vn_zone).format("YYYYMMDD")
    } else {
        return moment.tz(vn_zone).format('YYYYMMDD');
    }

}

function hienThiNgayGio(mili) {
    if (mili) {
        return moment.tz(new Date(mili), vn_zone).format("DD/MM/YYYY HH:mm")
    } else {
        return moment.tz(vn_zone).format("DD/MM/YYYY HH:mm");
    }
}

function hienThiNgayGio2(mili) {
    if (mili) {
        return moment.tz(new Date(mili), vn_zone).format("YYYY-MM-DD HH:mm:ss")
    } else {
        return moment.tz(vn_zone).format("YYYY-MM-DD HH:mm:ss");
    }
}
function getCurrentHour(){
    return moment.tz(vn_zone).format('HH:mm');
}

/**
 * TODO: đổi mili sang thời gian
 * @param {*} milli : 360000
 */
function convertMiliToStringTime(milli){
    var milliseconds = milli % 1000;
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);
    var hours = Math.floor((milli / (3600 * 1000)) % 3600)
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return hours + ":" +minutes + ":" + seconds;
}

function fileRenamer(input){

}
