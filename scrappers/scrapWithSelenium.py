#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jun 25 00:59:15 2023

@author: kala
"""

from selenium import webdriver
import time
base_url = "https://www.pna.sn/"
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless') 
chrome_options.add_argument('--no-sandbox')                                    
driver = webdriver.Chrome(options=chrome_options)
chrome_options.add_argument('--disable-dev-shm-usage')
driver.get(base_url)
time.sleep(3)
print(driver.find_element_by_id('content').text)
driver.close()