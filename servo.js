var Gpio = require('pigpio').Gpio,
  motor = new Gpio(23, {mode: Gpio.OUTPUT}),
  pulseWidth = 750,
  increment = 100;

setInterval(function () {
  motor.servoWrite(pulseWidth);
  if (pulseWidth == 750) {
	pulseWidth = 1000;
  } else {
	pulseWidth = 750;
  }
}, 1000);