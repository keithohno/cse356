const amqp = require("amqplib/callback_api");

exports.rabbit = (req, res) => {
  amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
      if (err) throw err;

      channel.assertExchange("hw3", "direct", {
        durable: false,
      });
      channel.publish("hw3", req.body.key, Buffer.from(req.body.msg));
      res.send({});
      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
};
