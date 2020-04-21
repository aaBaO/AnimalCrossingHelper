#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import urllib.request
import re
import json
import time
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from pypinyin import slug, Style

NorthernHemisiphere = "北半球"
SouthernHemisiphere = "南半球"

def GrabFishData():
    # https://animalcrossing.fandom.com/zh/wiki/Category:魚類(集合啦！動物森友會)?variant=zh-hans
    fishURL = 'https://animalcrossing.fandom.com/zh/wiki/Category:%E9%AD%9A%E9%A1%9E(%E9%9B%86%E5%90%88%E5%95%A6%EF%BC%81%E5%8B%95%E7%89%A9%E6%A3%AE%E5%8F%8B%E6%9C%83)?variant=zh-hans'
    fishAssetsPath = './assets/fish'
    print(urllib.request.unquote(fishURL))
    browser.get(fishURL)
    time.sleep(5)

    for hemisiphere in (NorthernHemisiphere, SouthernHemisiphere):
        results = []
        tag = browser.find_element(By.CSS_SELECTOR,'div > ul.tabbernav > li > a[title=%s]' % hemisiphere)
        browser.execute_script('window.scrollTo(0,%s-100)' % tag.location['y'])
        tag.click()
        selector = 'div.tabbertab[title=%s] > table.roundy > tbody > tr > td > table > tbody > tr' % hemisiphere 
        data = browser.find_elements(By.CSS_SELECTOR, selector)
        for item in data:
            browser.execute_script('window.scrollTo(0,%s)' % item.location['y'])
            information = { }
            a = item.find_element(By.CSS_SELECTOR, "a.image.image-thumbnail")
            itemName = a.get_attribute('title')
            information['name'] = itemName
            img = a.find_element(By.CSS_SELECTOR, 'img')
            information['imgSource'] = img.get_attribute('src')
            information['price'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
            information['location'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(3)').text
            information['shadowSize'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(4)').text
            information['time'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(5)').text
            information['Jan'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(6)').text
            information['Feb'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(7)').text
            information['Mar'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(8)').text
            information['Apr'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(9)').text
            information['May'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(10)').text
            information['Jun'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(11)').text
            information['Jul'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(12)').text
            information['Aug'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(13)').text
            information['Sep'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(14)').text
            information['Oct'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(15)').text
            information['Nov'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(16)').text
            information['Dec'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(17)').text
            information['pinyin'] = (
                slug(itemName, style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
                slug(itemName, style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
            )

            for k in information:
                if k == 'pinyin':
                    continue
                information[k] = information[k].replace(' ','').replace('\n','').replace('\r','')
            # 原始图片尺寸
            information['imgSource'] = re.sub(r'scale-to-width-down/\d.*?\?', 'scale-to-width-down/128?', information['imgSource'])
            imgURL= information['imgSource']
            mimgfile = re.search(r'[^/\\\\]+(png)', imgURL)
            
            imgFile = '%s/%s' %(fishAssetsPath, mimgfile[0])
            information['imgFile'] = '../../assets/fish/%s' % mimgfile[0]
            if not os.path.exists(imgFile):
                imgResponse = requests.get(imgURL, stream=True)
                if imgResponse.status_code == 200:
                    # 将内容写入图片
                    open(imgFile, 'wb').write(imgResponse.content) 
                    print("%s..图片下载完成" %(imgFile))
                del imgResponse
            results.append(information)

        if hemisiphere == NorthernHemisiphere:
            fishJsonFile = './database/fish_nh.js'
        elif hemisiphere == SouthernHemisiphere:
            fishJsonFile = './database/fish_sh.js'

        with open(fishJsonFile, "w", encoding='utf-8') as f:
            f.seek(0)
            f.write('var json=')
            json.dump(results, f, ensure_ascii=False, indent=2)
            f.write('\n')
            f.write('module.exports={data:json}')
            print("写入文件完成...")
    browser.close()

def GrabBugData():
    # https://animalcrossing.fandom.com/zh/wiki/Category:昆蟲(集合啦！動物森友會)?variant=zh-hans
    bugURL = 'https://animalcrossing.fandom.com/zh/wiki/Category:%E6%98%86%E8%9F%B2(%E9%9B%86%E5%90%88%E5%95%A6%EF%BC%81%E5%8B%95%E7%89%A9%E6%A3%AE%E5%8F%8B%E6%9C%83)?variant=zh-hans'
    print(urllib.request.unquote(bugURL))
    browser.get(bugURL)
    time.sleep(5)

    for hemisiphere in (NorthernHemisiphere, SouthernHemisiphere):
        results = []
        tag = browser.find_element(By.CSS_SELECTOR,'div > ul.tabbernav > li > a[title=%s]' % hemisiphere)
        browser.execute_script('window.scrollTo(0,%s-100)' % tag.location['y'])
        tag.click()
        selector = 'div.tabbertab[title=%s] > table.roundy > tbody > tr > td > table > tbody > tr' % hemisiphere 
        data = browser.find_elements(By.CSS_SELECTOR, selector)
        for item in data:
            browser.execute_script('window.scrollTo(0,%s)' % item.location['y'])
            information = { }
            a = item.find_element(By.CSS_SELECTOR, "a.image.image-thumbnail")
            itemName = a.get_attribute('title')
            information['name'] = itemName
            img = a.find_element(By.CSS_SELECTOR, 'img')
            information['imgSource'] = img.get_attribute('src')
            information['price'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
            information['location'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(3)').text
            information['time'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(4)').text
            information['Jan'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(5)').text
            information['Feb'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(6)').text
            information['Mar'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(7)').text
            information['Apr'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(8)').text
            information['May'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(9)').text
            information['Jun'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(10)').text
            information['Jul'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(11)').text
            information['Aug'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(12)').text
            information['Sep'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(13)').text
            information['Oct'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(14)').text
            information['Nov'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(15)').text
            information['Dec'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(16)').text
            information['pinyin'] = (
                slug(itemName, style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
                slug(itemName, style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
            )

            for k in information:
                if k == 'pinyin':
                    continue
                information[k] = information[k].replace(' ','').replace('\n','').replace('\r','')
                if information[k] == 'Allday' or information[k] == 'AllDay':
                    information[k] = '全天'
            # 原始图片尺寸
            information['imgSource'] = re.sub(r'scale-to-width-down/\d.*?\?', 'scale-to-width-down/128?', information['imgSource'])
            imgURL= information['imgSource']
            mimgfile = urllib.request.unquote(img.get_attribute('data-image-key'))
            
            bugAssetsPath = './assets/bug'
            imgFile = '%s/%s' %(bugAssetsPath, mimgfile)
            information['imgFile'] = '../../assets/bug/%s' % mimgfile
            if not os.path.exists(imgFile):
                imgResponse = requests.get(imgURL, stream=True)
                if imgResponse.status_code == 200:
                    # 将内容写入图片
                    open(imgFile, 'wb').write(imgResponse.content) 
                    print("%s..图片下载完成" %(imgFile))
                del imgResponse
            results.append(information)

        if hemisiphere == NorthernHemisiphere:
            bugJsonFile = './database/bug_nh.js'
        elif hemisiphere == SouthernHemisiphere:
            bugJsonFile = './database/bug_sh.js'

        with open(bugJsonFile, "w", encoding='utf-8') as f:
            f.seek(0)
            f.write('var json=')
            json.dump(results, f, ensure_ascii=False, indent=2)
            f.write('\n')
            f.write('module.exports={data:json}')
            print("写入文件完成...")
    browser.close()

def GrabDIYRecipes():
    # 'https://wiki.biligame.com/dongsen/DIY配方'
    browser.get('https://wiki.biligame.com/dongsen/DIY%E9%85%8D%E6%96%B9')

    recipesMap = []
    # materialsMap = []
    # recipe={
    #     category,
    #     name,
    #     size,
    #     thumbnail,
    #     access,
    #     materials:[{material, count}, {material, count}]
    # }
    # material={
    #     name,
    #     thumbnail,
    # }
    originalWindowHandle = browser.current_window_handle
    datas = browser.find_elements(By.CSS_SELECTOR, '#CardSelectTr > tbody > tr')
    for item in datas:
        browser.execute_script('window.scrollTo(0,%s-100)' % item.location['y'])
        time.sleep(0.5)
        a = item.find_element(By.CSS_SELECTOR, 'td > div > div.floatnone > a')
        detailURL = a.get_attribute('href')
        # 打开详情
        browser.execute_script('window.open("%s")' % detailURL)
        browser.switch_to_window(browser.window_handles[1])
        browser.find_element

        recipe = {}

        table = browser.find_element(By.CSS_SELECTOR, '#mw-content-text > div > table > tbody')
        # 名称
        title = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(1) > th')
        recipe['name'] = title.text

        # 图片
        img = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(2) > td > div > div.floatnone > a > img')
        imgURL = img.get_attribute('src')
        # 下载图片
        assetPath = '/assets/DIYRecipes'
        imgFile = '%s/%s.png' %(assetPath, recipe['name'])
        recipe['imgRef'] = imgFile
        pyImgFile = '.%s' % imgFile
        if not os.path.exists(pyImgFile):
            imgResponse = requests.get(imgURL, stream=True)
            if imgResponse.status_code == 200:
                # 将内容写入图片
                open(pyImgFile, 'wb').write(imgResponse.content) 
                print("%s..图片下载完成" %(pyImgFile))
            del imgResponse

        # 类别
        category = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(3) > td')
        recipe['category'] = category.text

        # 获取途径
        access = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(4) > td')
        recipe['access'] = access.text

        # 尺寸
        size = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(5) > td')
        recipe['size'] = size.text

        # 材料
        trs = table.find_elements(By.CSS_SELECTOR, 'tr')
        materials = []
        for tr in trs[6:]:
            trStyle = tr.get_attribute('style')
            if not trStyle:
                material = {}
                material['name'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(1)').text
                material['count'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
                materials.append(material)
        recipe['materials'] = materials

        recipesMap.append(recipe)
        browser.close()
        browser.switch_to_window(originalWindowHandle)

    # 写入js文件
    with open('./database/DIYRecipes.js', "w", encoding='utf-8') as f:
        f.seek(0)
        f.write('var json=')
        json.dump(recipesMap, f, ensure_ascii=False, indent=2)
        f.write('\n')
        f.write('module.exports={data:json}')
        print("写入文件完成...")
    browser.close()

browser = webdriver.Chrome()
# GrabFishData()
# GrabBugData()
GrabDIYRecipes()