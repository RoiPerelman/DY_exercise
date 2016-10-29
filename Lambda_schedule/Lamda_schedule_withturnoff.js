const aws = require('aws-sdk');
var email_feeder = require('./email_feeder.js');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

var bucket = "catfoodbucket";
var src_key = "TimeSchedule.txt";
var sleep_key = "StartFeeding.txt";

const params = {
    Bucket: bucket,
    Key: src_key
};

const sleep_params = {
    Bucket: bucket,
    Key: sleep_key
};

const mode = {
    SLEEP : 0,
    EMAIL : 1,
    EMAIL_SENT : 2,
    NORMAL_FUNCTION : 3
};

var loop_status = mode.SLEEP;

exports.handler = function(event, context, callback) {

    console.log("at start our loop status is " + loop_status);

    s3.getObject(sleep_params, function(err, data) {
        if (err) {
            loop_status = mode.SLEEP;
            callback(null, "make StartFeeding.txt in bucket to Start Feeding");
        }
        else {
            s3.getObject(params, function(err, data) {
                if (err) {
                    loop_status = mode.SLEEP;
                    callback(null, "No food in yet");
                }
                else {
                    // change status to email in case of no feeding
                    if(loop_status == mode.SLEEP) {
                        loop_status = mode.EMAIL;
                        console.log("status change from SLEEP to EMAIL");
                    }
                        
                    var end = Math.floor(Date.now() / 60000);
                    var start = Math.floor(Date.parse(data.LastModified) / 60000);
                    var time_difference = end - start

                    // for debug
                    console.log(time_difference);
                    
                    if((time_difference > 15) && (loop_status == mode.EMAIL)){
                        email_feeder.sendemail("warning", console.log);
                        loop_status = mode.EMAIL_SENT;
                        console.log("email sent and status change to EMAIL.SENT");
                        callback(null, "email sent");
                    }
                    else if((time_difference > 30) && (loop_status == mode.EMAIL_SENT)){
                        loop_status = mode.SLEEP;
                        s3.deleteObject(sleep_params, function(err, data) {
                        if (err) 
                            console.log(err);
                        else     
                            console.log("deleted StartFeeding.txt");
                        });
                        callback(null, "The cat has died!");
                    }
                    else if(((time_difference) < 15) && (loop_status == mode.EMAIL)){
                        email_feeder.sendemail("normal", console.log);
                        loop_status = mode.EMAIL_SENT;
                        callback(null, "cat was fed in time")
                    }
                    else{
                        console.log("cat was fed");
                        callback(null, "cat was fed");
                    }
                }
            });
        }
    });
}