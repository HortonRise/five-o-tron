var Gpio = require('pigpio').Gpio,
  motor = new Gpio(23, {mode: Gpio.OUTPUT}),
  pulseWidth = 850,
  increment = 100;

setInterval(function () {
  motor.servoWrite(pulseWidth);

}, 1000);