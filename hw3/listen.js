const amqp = require("amqplib/callback_api");

exports.rabbit = (req, res) => {
  amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
      if (err) throw err;

      channel.assertExchange("hw3", "direct", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        (err, q) => {
          if (err) throw err;

          for (key of req.body.keys) {
            channel.bindQueue(q.queue, "hw3", key);
          }

          channel.consume(q.queue, (msg) => {
            console.log("received a message");
            res.send({ msg: msg.content.toString() });
            connection.close();
          });
        }
      );
    });
  });
};
