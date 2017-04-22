var mqtt = require('mqtt')
var tessel = require('tessel');
var config = require('./config.json')
var client  = mqtt.connect(config.serverAddress)
// Turn one of the LEDs on to start.
tessel.led[2].on();

var pin = tessel.port.A.pin[2];
var pin2 = tessel.port.A.pin[3];

var blinkTimes = 0;
var slow=false;
var slowCounter = 0;

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
  slow=false;
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
  if(slow){
    slowCounter--;
    if(slowCounter>0){
      return
    }
    slowCounter=6;
  }

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
}, 100);

client.on('connect', function () {
  client.subscribe('doorBell')
  client.subscribe('saunaAlert')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
  console.log(topic)
  if(topic=="saunaAlert")
    slow=true;
  runOn();
  blinkTimes = blinkTimes+Number(message);

})
