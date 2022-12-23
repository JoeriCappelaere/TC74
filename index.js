const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const i2c = require('i2c-bus');
const TC74_ADDR = 0x48;
const TEMP_REG = 0x00;
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:9001');



app.get('/browserMqtt.js',(req,res) => {
    console.log("browserMqtt.js requested");
    return res.sendFile(__dirname + '/node_modules/mqtt/dist/mqtt.js');
});
app.use(express.static('public'));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
  client.subscribe('set_output4', function (err) {
    if (!err) {
      console.log('subscribed to set_output4')
    }
  })
        client.publish("mqtt/demo", "Temperatuur:")
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  if(topic=='set_output4')
  {
      console.log('set_output4 topic received')
      if(message=='0')
        LED.writeSync(0)
       else
        LED.writeSync(1)
  }
  //client.end()
})


i2c.openPromisified(1).
then(i2c1 => i2c1.readByte(TC74_ADDR, TEMP_REG).
then(rawData => console.log(rawData)).
then(_ => i2c1.close())
).catch(console.log);









