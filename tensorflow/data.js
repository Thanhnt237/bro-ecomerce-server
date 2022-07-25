const common = require("../common/commonFunction");
const { TABLE_NAME } = require("../config/tablename");
const _ = require('lodash');

module.exports = {
    productData: productData,
    categoriesData: categoriesData,
    sellerData: sellerData
}

async function productData(){
    let sql = `
        select p.*, 
               s.SELLER_NAME, s.PHONE_NUMBER, s.MAIN_CATEGORIES, s.LOCATION, s.RATING, s.FOLLOWER,
               c.CATEGORIES_NAME, c.SLUG, c.DESCRIPTION
        from ${TABLE_NAME.PRODUCT} as p
        left join ${TABLE_NAME.SELLER} as s on p.SELLER_ID = s.ID
        left join ${TABLE_NAME.CATEGORIES} as c on c.ID = p.CATEGORY_ID
        where p.STATE and s.STATE and c.STATE
    `

    try {
        let [result,] = await common.query(sql)
        console.log(result)
        return result
    }catch(error){
        console.log(error)
        throw error
    }
}

async function categoriesData(){
    let sql = `
        select *
        from ${TABLE_NAME.CATEGORIES}
        where STATE
    `

    try {
        let [result,] = await common.query(sql)
        return result
    }catch(error){
        console.log(error)
        throw error
    }
}

async function sellerData(){
    let sql = `
        select * 
        from ${TABLE_NAME.SELLER}
        where STATE
    `

    try {
        let [result,] = await common.query(sql)
        return result
    }catch(error){
        console.log(error)
        throw error
    }
}


