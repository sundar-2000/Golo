
function sendSMS(number, msg) {

    const accountSid = '****************************';
    const authToken = '*****************************';
    const client = require('twilio')(accountSid, authToken);
    console.log('sending message..', msg, number)
    client.messages
        .create({
            body: msg.toString(),
            from: '+19788785118',
            to: '+91' + number.toString()
        })
        .then(message => console.log(message.sid)).done();

}

module.exports = {
    sendSMS
}
