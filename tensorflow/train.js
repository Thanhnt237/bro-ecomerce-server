const data = require('./data')
const model = require('./model')
const constants = require('../common/constants')
const {predict} = require("./index");
const tf = require('@tensorflow/tfjs-node')
//train model
module.exports = {
    train: train
}

let options = {
    epochs: constants.trainCount,
    validationSplit: 0.1,
    shuffle: true
}

async function train(productDataStorage){
    let IDsCategories = productDataStorage.map(c => c.ID)
    let dimensionLength = IDsCategories.length

    let normalizeData = await model.normalizeLocationData({
        dimensionLength: dimensionLength,
        productDataStorage: productDataStorage,
        IDsCategories: IDsCategories
    })

    let geoModel = await model.createModel(dimensionLength)
    await geoModel.fit(normalizeData.inputData,normalizeData.outputData, options);
    return geoModel
}