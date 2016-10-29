'use strict';

var config = require('./config.json');
var gcloud = require('google-cloud');
// Instantiate a vision client with authentication
var vision = gcloud.vision({
    projectId: config.projectId,
    keyFilename: config.keyFile
});

const catFoods = config.catFoods;

function detectLabels(inputFile, callback) {
    var answer = 'false';
    // Make a call to the Vision API to detect the labels
    vision.detectLabels(inputFile, function (err, labels) {
        if (err) {
            return callback("error detecting labels from google vision engine" + err, null);
        }
        for (var i = 0; i < labels.length; i++) {
            catFoods.forEach (function(catFood) {
                if (labels[i] == catFood) {
                    console.log(labels[i], 'true');
                    answer = 'true';
                    callback(null, answer);
                    return;
                }
                else {
                    console.log(labels[i], 'false');
                }
            }); 
        }
        callback(null, answer);
    });
}

exports.detectLabels = detectLabels;
