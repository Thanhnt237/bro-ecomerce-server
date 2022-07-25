const train = require('./train')
const tf = require('@tensorflow/tfjs-node')
let { calculateLocation } = require('../utils/util')

module.exports = {
    predictByGeolocation: predictByGeolocation
}

let trainedModel = null

async function predictByGeolocation(geoLocation){
    if(!trainedModel){
        console.log("Train start");
        trainedModel = await train.train()
        await trainedModel.save('./generation')
        console.log("Train finished");
    }

    console.log(trainedModel)

    let geoData = calculateLocation(JSON.parse(geoLocation))
    let geoTensor = tf.tensor1d([geoData])

    let predictResult = await trainedModel.predict(geoTensor)
    let max = predictResult.argMax(1).dataSync()
    console.log(predictResult)
    console.log(max)

// train().then((result)=>{
//
//     console.log(result);
//
//     let heightTextBox = document.getElementById("height");
//     let getResultBtn = document.getElementById("getResult");
//     let resultText = document.getElementById("resultText");
//
//     getResultBtn.addEventListener("click", ()=>{
//         let test = heightTextBox.value;
//         let heightInput = (test - 1200)/900;
//         let heightInputTensor = tf.tensor1d([heightInput]);
//
//         console.log(test + "+" + heightInput);
//
//         //Predict
//         let predictResult = model.predict(heightInputTensor);
//         let max = predictResult.argMax(1).dataSync();
//
//         console.log(predictResult);
//         console.log(max);
//         resultText.innerHTML = "size ao phu hop cua ban la: " + sizeCategories[max];
//     })
//
// });
}