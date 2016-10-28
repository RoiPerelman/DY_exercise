var email_feeder = require('./email_feeder.js');

email_feeder.sendemail("warning", console.log);
email_feeder.sendemail("normal", console.log);