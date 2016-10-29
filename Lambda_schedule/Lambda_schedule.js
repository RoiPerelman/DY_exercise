var config = require("./config.json");
const aws = require('aws-sdk');
var email_feeder = require('./email_feeder.js');

const s3 = new aws.S3();

const params = {
    Bucket: config.bucket,
    Key: config.src_key
};

const mode = {
    EMAIL : 0,
    EMAIL_SENT : 1,
    NORMAL : 2
};

var loop_status = mode.EMAIL;

exports.handler = function(event, context, callback) {

    s3.getObject(params, function(err, data) {
        if (err) {
            callback(null, "No food in yet, make sure src_key exists");
        }
        else {
            //get the time difference
            var cur_time_min = Math.floor(Date.now() / 60000);
            var file_time_min = Math.floor(Date.parse(data.LastModified) / 60000);
            var time_difference = cur_time_min - file_time_min;

            // for debug
            console.log("cur_time_min " + cur_time_min);
            console.log("file_time_min " + file_time_min);
            console.log("difference " + time_difference);
            
            if((time_difference > 15) && (loop_status == mode.EMAIL)){
                loop_status = mode.EMAIL_SENT;
                email_feeder.sendemail("warning", console.log);
                callback(null, "email sent, loop_status change to EMAIL.SENT");
            }
            else if((time_difference < 15 ) && (loop_status == mode.EMAIL_SENT)){
                loop_status = mode.NORMAL;
                email_feeder.sendemail("normal", console.log);
                callback(null, "cat was fed after email was sent, back to normal");
            }
            // extra - will put the loop status and time difference into a file every min if dst_key configured in config.json
            if(config.dst_key){
                var dst_params2 = {
                    Bucket: config.bucket,
                    Key: config.dst_key,
                    Body: "loop status: " + loop_status + ", time difference: " + time_difference
                };

                s3.putObject(dst_params2, function (err, data) {
                    if (err) {
                        console.log("error with putting file");
                    }
                    else {
                        callback(null, "passed key " + data.Key + " the body " + dst_params2.Body);
                    }
                });
            }
        }
    });
}