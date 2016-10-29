const aws = require('aws-sdk');
var vision = require('./labelDetection.js');
var food = require('checkfeeding.js');

const s3 = new aws.S3();

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
            // checkfeeding calls vision and if file exists makes a dst_key file in s3
            food.checkFeeding(data.Body, callback);
        }
    });
}
