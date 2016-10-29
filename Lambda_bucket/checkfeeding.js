var vision = require('./labelDetection.js');
var dataBase = require('./dataBase');

// check the image in google vision engine
function checkFeeding(inputFile, callback) {
    vision.detectLabels(inputFile, function(err, answer) {
        if (err) {
            callback(err);
        }
        else {
            if (answer=='true') {
                // our current data base is s3 file
                // but it is easier to change to other means like redis with dataBase.js
                dataBase.Put(null, callback);
            }
            else {
                callback(null, "cat was given wrong food - not fed");
            }
        }
    });
}

exports.checkFeeding = checkFeeding;