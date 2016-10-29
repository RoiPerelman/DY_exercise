const aws = require('aws-sdk');
var config = require('./config.json');

const s3 = new aws.S3();

const dst_params = {
    Bucket: config.bucket,
    Key: config.dst_key
};

function Put(params, callback) {
    // modify file to update the feeding time
    s3.putObject(dst_params, function (err, data) {
        if (err) {
            callback ("error with file feeding time update " + err);
        }
        else {
            callback(null, "cat was fed " + Math.floor(Date.now() / 60000));
        }
    });
}

// can implement dataBaseGet too if necessery

exports.Put = Put;