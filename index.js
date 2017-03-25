var mqtt = require('mqtt')
var tessel = require('tessel');
var config = require('./config.json')
var client  = mqtt.connect(config.serverAddress)
// Turn one of the LEDs on to start.
tessel.led[2].on();

var pin = tessel.port.A.pin[2];
var pin2 = tessel.port.A.pin[3];

var blinkTimes = 20;

function standBy(){
  pin.write(0, (error, buffer) => {
    if (error) {
      throw error;
    }
  });
  pin2.write(0, (error, buffer) => {
    if (error) {
      throw error;
    }
  });
}

function runOn(){
  pin.write(0, (error, buffer) => {
    if (error) {
      throw error;
    }
  });
  pin2.write(1, (error, buffer) => {
    if (error) {
      throw error;
    }
  });
}
standBy();


// Blink!
setInterval(function () {
  if(blinkTimes>0){
    tessel.led[2].toggle();
    tessel.led[3].toggle();
    pin.toggle();
    pin2.toggle();
  }else return
  blinkTimes--;
  if(blinkTimes==0)
    standBy();
  console.log(blinkTimes)
}, 200);

client.on('connect', function () {
  client.subscribe('doorBell')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
  runOn();
  blinkTimes = blinkTimes+Number(message);

})
