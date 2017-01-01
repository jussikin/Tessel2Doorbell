var mqtt = require('mqtt')
var tessel = require('tessel');
var config = require('./config.json')
var client  = mqtt.connect(config.serverAddress)
// Turn one of the LEDs on to start.
tessel.led[2].on();

var blinkTimes = 20;

// Blink!
setInterval(function () {
  if(blinkTimes>0){
    tessel.led[2].toggle();
    tessel.led[3].toggle();
    blinkTimes--;
  }
}, 100);

client.on('connect', function () {
  client.subscribe('doorBell')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
  blinkTimes = blinkTimes+Number(message);
})
