var amqp = require('amqplib/callback_api');

function sendNotification(mobile, msg) {

  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'orders';
      var key = '12';

      channel.assertExchange(exchange, 'direct', {
        durable: false
      });
      var data = {
        'mobile': mobile,
        'msg': msg
      }
      channel.publish(exchange, key, Buffer.from(JSON.stringify(data)));
      console.log(" [x] Sent %s: '%s'", key, msg);
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

module.exports = {
  sendNotification
}

