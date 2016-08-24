var Gpio = require('pigpio').Gpio,
  motor = new Gpio(23, {mode: Gpio.OUTPUT}),
  pulseWidth = 500,
  increment = 100;

setInterval(function () {
  motor.servoWrite(pulseWidth);
  if (pulseWidth == 500) {
	pulseWidth = 2500;
  } else {
	pulseWidth = 500;
  }
}, 1000);