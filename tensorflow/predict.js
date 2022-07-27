const train = require('./train')
const tf = require('@tensorflow/tfjs-node')
let { calculateLocation } = require('../utils/util')
const data = require("./data");

module.exports = {
    predictByGeolocation: predictByGeolocation
}

let trainedModel = null

async function trainModel(productDataStorage){
    console.log("Train start");
    trainedModel = await train.train(productDataStorage)
    console.log("Train finished");
}

async function predictByGeolocation(geoLocation){
    let productDataStorage = []

    try {
        productDataStorage = await data.productData()
    }catch(error){
        console.log(error)
    }

    if(!trainedModel){
        await trainModel(productDataStorage)
    }

    // console.log(trainedModel)
    let geoData = calculateLocation(JSON.parse(geoLocation))

    let predictResult = await trainedModel.predict(tf.tensor1d([geoData]))
    let max = predictResult.argMax(1).dataSync();
    let IDsCategories = productDataStorage.map(c => c.ID)

    let recommendation = productDataStorage.find(c => c.ID === IDsCategories[max])
    console.log(recommendation)
    return recommendation
}