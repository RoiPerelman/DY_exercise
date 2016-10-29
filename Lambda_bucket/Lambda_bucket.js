const aws = require('aws-sdk');
var vision = require('./labelDetection');
var config = require('./config.json');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

var dst_params = {
    Bucket: config.bucket,
    Key: config.dst_key
};

exports.handler = function (event, context, callback) {

    // get the bucket name
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey =
        decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    var src_params = {
        Bucket: srcBucket,
        Key: srcKey
    };

    // double check that we got an image
    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }
    var imageType = typeMatch[1];
    if (imageType != "jpg" && imageType != "png") {
        callback('Unsupported image type: ${imageType}');
        return;
    }

    // get the image from s3 bucket
    s3.getObject(src_params, function (err, data) {
        if (err) {
            callback("error with getting the picture " + err);
            return;
        }
        else {
            // check the image in google vision engine
            vision.detectLabels(data.Body, function(err, answer) {
                if (err) {
                    callback(err);
                }
                else {
                    if (answer=='true') {
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
                    else {
                        callback(null, "cat was given wrong food - not fed");
                    }
                }
            });
        }
    });
}
