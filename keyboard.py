import RPi.GPIO as GPIO
import time
import uinput

up = False
down = False
next= 24
redeem = 25

GPIO.setmode(GPIO.BCM)
GPIO.setup(next, GPIO.IN,  pull_up_down=GPIO.PUD_UP)
GPIO.setup(redeem, GPIO.IN,  pull_up_down=GPIO.PUD_UP)

events = (uinput.KEY_UP, uinput.KEY_DOWN)
device = uinput.Device(events)

print("Listening for input...")

try:
    while True:
        if (not up) and (not GPIO.input(next)):  # Up button pressed
            up = True
            device.emit(uinput.KEY_UP, 1) # Press Up key
            print("Up key pressed!")
        if up and (GPIO.input(next)):  # Up button released
            up = False
            device.emit(uinput.KEY_UP, 0) # Release Up key
	if (not down) and (not GPIO.input(redeem)):
            down = True
            device.emit(uinput.KEY_DOWN, 1)
            print("Down key pressed!")
        if down and (GPIO.input(redeem)):
            down = False
            device.emit(uinput.KEY_DOWN, 0)
        time.sleep(.04)
except KeyboardInterrupt: # If CTRL+C is pressed, exit cleanly:
    GPIO.cleanup() # cleanup all GPIO
