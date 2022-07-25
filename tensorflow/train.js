const data = require('./data')
const model = require('./model')
const constants = require('../common/constants')

//train model
module.exports = {
    train: train
}

let options = {
    epochs: constants.trainCount,
    validationSplit: 0.1,
    shuffle: true
}

async function train(){
    let productDataStorage = []
    try {
        productDataStorage = await data.productData()
    }catch(error){
        console.log(error)
    }

    let IDsCategories = productDataStorage.map(c => c.ID)
    let dimensionLength = IDsCategories.length

    let normalizeData = await model.normalizeLocationData({
        dimensionLength: dimensionLength,
        productDataStorage: productDataStorage,
        IDsCategories: IDsCategories
    })

    let geoModel = await model.createModel(dimensionLength)

    return await geoModel.fit(normalizeData.inputData,normalizeData.outputData, options);
}