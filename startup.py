import selenium
import uinput
import time

device = uinput.Device([uinput.KEY_F11, uinput.KEY_ENTER])

print("Starting in 1 second")

time.sleep(1)
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()
driver.get("http://localhost:3000/")
time.sleep(3)
driver.switch_to_window(driver.window_handles[-1])
device.emit_click(uinput.KEY_ENTER)
time.sleep(1)
device.emit_click(uinput.KEY_F11)
#driver.close()
