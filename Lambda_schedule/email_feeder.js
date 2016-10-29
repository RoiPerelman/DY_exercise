'use strict';

var config = require("./config.json");
console.log('starting function');

//exports.handler = function(event, context, callback) {
function sendemail(input, callback){
    var api_key = config.api_key;
    var domain = config.domain;
    var mailgun = require('mailgun-js')({apiKey : api_key, domain : domain});

    var data = {
        from : config.from_mail,
        to : config.to_mail,
        subject : config["subject_" + input],
        text : config["body_" + input]
    }

    mailgun.messages().send(data, function(err, body) {
        if (err)
            callback("mailgun messege arror " + err);
        else
            callback("mailgun messege " + input + " sent");
    })
};

exports.sendemail = sendemail;