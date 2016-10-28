'use strict';

//var AWS = require('aws-sdk');
var Vision = require('@google-cloud/vision');
// Instantiate a vision client with authentication
var vision = Vision({
  projectId: 'inbound-analogy-147604',
  keyFilename: './071fc324d0288fb3194315d0289e51017eb34142.json'
});

// get reference to S3 client 
//var s3 = new AWS.S3();

/**
 * Uses the Vision API to detect labels in the given file.
 */
function detectLabels (inputFile, callback) {
  // Make a call to the Vision API to detect the labels
  vision.detectLabels(inputFile, function (err, labels) {
    if (err) {
      return callback("ERROR" + err);
    }
    for(var i=0; i<labels.length; i++){
      if (labels[i] == 'cat'){
        console.log(labels[i], 'true');
      }
      else{
        console.log(labels[i], 'false');
      }
    }
    callback("done");
  });
}

detectLabels('cat.jpg', console.log);

exports.detectLabels = detectLabels;
