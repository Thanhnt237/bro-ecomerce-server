const tf = require('@tensorflow/tfjs-node')
let { calculateLocation } = require('../utils/util')

module.exports = {
    normalizeLocationData: normalizeLocationData,
    createModel: createModel
}

async function normalizeLocationData(input){
    let {
        dimensionLength,
        productDataStorage,
        IDsCategories
    } = input;
    // console.log(productDataStorage)

    let locations = []
    let IDs = []

    productDataStorage.map(item => {
        if(item.LOCATION){
            let geoData = JSON.parse(item.LOCATION)
            let geoNormalize = calculateLocation(geoData)
            locations.push(geoNormalize)
            IDs.push(IDsCategories.indexOf(item.ID))
        }
    })

    // console.log(locations)
    // console.log(IDs)

    let inputData = tf.tensor1d(locations)
    let IDsTensor = tf.tensor1d(IDs, "int32")
    let outputData = tf.oneHot(IDsTensor, dimensionLength)

    // inputData.print()
    // outputData.print()

    return {
        inputData: inputData,
        outputData: outputData
    }
}

async function createModel(dimensionLength){
    let model = tf.sequential();

    let hiddenLayer = tf.layers.dense({
        units: 32,
        activation: "sigmoid",
        inputDim: 1
    });

    let outputLayer = tf.layers.dense({
        units: dimensionLength,
        activation: "softmax"
    });

    model.add(hiddenLayer);
    model.add(outputLayer);

    model.compile({
        optimizer: tf.train.sgd(0.2),
        loss: "categoricalCrossentropy"
    });

    return model
}
