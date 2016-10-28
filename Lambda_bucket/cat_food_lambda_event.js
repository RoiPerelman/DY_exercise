const aws = require('aws-sdk');
//var vision = require('./labelDetection');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

var bucket = "catfoodbucket";
var dst_key = "TimeSchedule.txt";

var dst_params = {
  Bucket: bucket,
  Key: dst_key
};

exports.handler = function(event, context, callback) {

    // get the bucket name
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));  

    // Infer the image type.
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

    var src_params = {
        Bucket: srcBucket,
        Key: srcKey
    };
    
    s3.getObject(src_params, function(err, data) {
        if (err) {
            console.log("error with getting the picture " + err);
            callback("ERROR");
        }
        else {
            //vision.detectLabels(data, console.log);
            s3.putObject(dst_params, function(err, data) {
                if (err) {
                    console.log("error with putting Object");
                }
                else {
                    callback(null, data);
                }
            })
        }
    });
}