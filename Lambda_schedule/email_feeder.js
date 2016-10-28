'use strict';

console.log('starting function');

//exports.handler = function(event, context, callback) {
function sendemail(input, callback){
    var api_key = 'key-25031afbf60e307f938d00ad2afaecdf';
    var domain = 'sandbox815e1b27eafb41a690e87997877abdea.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey : api_key, domain : domain});

    if (input == "warning"){
        var data = {
            from : "perelmanroi@gmail.com",
            to : "roiperelman@gmail.com",
            subject : "Cat food Warning",
            text : "Warning - The Cat is HUNGRY! give the cat food!!!"
        }
    }
    else if( input == "normal"){
        var data = {
            from : "perelmanroi@gmail.com",
            to : "roiperelman@gmail.com",
            subject : "cat food is Back-To-Normal",
            text : "You have used your 1 and only warning, cat is back to normal! feed every 15 min!"
        }
    }

    mailgun.messages().send(data, function(err, body) {
        if (err)
            callback(err);
        else
            callback("success");
    })
};

exports.sendemail = sendemail;