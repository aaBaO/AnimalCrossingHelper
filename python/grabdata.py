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
import tinify

tinify.key = 'Rk3FNkDK2144jP5Nk7cB3nKwglH3nyXZ'

NorthernHemisiphere = "北半球"
SouthernHemisiphere = "南半球"

def GrabFishData():
    # https://animalcrossing.fandom.com/zh/wiki/Category:魚類(集合啦！動物森友會)?variant=zh-hans
    fishURL = 'https://animalcrossing.fandom.com/zh/wiki/Category:%E9%AD%9A%E9%A1%9E(%E9%9B%86%E5%90%88%E5%95%A6%EF%BC%81%E5%8B%95%E7%89%A9%E6%A3%AE%E5%8F%8B%E6%9C%83)?variant=zh-hans'
    fishAssetsPath = './assets/fish'
    print(urllib.request.unquote(fishURL))
    browser.get(fishURL)
    time.sleep(5)

    results = []
    for hemisiphere in (NorthernHemisiphere, SouthernHemisiphere):
        tag = browser.find_element(By.CSS_SELECTOR,'div > ul.tabbernav > li > a[title=%s]' % hemisiphere)
        browser.execute_script('window.scrollTo(0,%s-100)' % tag.location['y'])
        tag.click()
        selector = 'div.tabbertab[title=%s] > table.roundy > tbody > tr > td > table > tbody > tr' % hemisiphere 
        data = browser.find_elements(By.CSS_SELECTOR, selector)
        for item in data:
            browser.execute_script('window.scrollTo(0,%s)' % item.location['y'])
            index = data.index(item)
            if index >= len(results):
                information = { }
                results.append(information)
            else:
                information = results[index]
            a = item.find_element(By.CSS_SELECTOR, "a.image.image-thumbnail")
            itemName = a.get_attribute('title')
            information['name'] = itemName
            img = a.find_element(By.CSS_SELECTOR, 'img')
            information['imgSource'] = img.get_attribute('src')
            information['price'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
            information['price'] = information['price'].replace(',','')
            information['location'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(3)').text
            information['shadowSize'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(4)').text
            information['time'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(5)').text

            if not 'month' in information.keys():
                information['month'] = {}
            if hemisiphere == NorthernHemisiphere:
                month = {}
                month['Jan'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(6)').text
                month['Feb'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(7)').text
                month['Mar'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(8)').text
                month['Apr'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(9)').text
                month['May'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(10)').text
                month['Jun'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(11)').text
                month['Jul'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(12)').text
                month['Aug'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(13)').text
                month['Sep'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(14)').text
                month['Oct'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(15)').text
                month['Nov'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(16)').text
                month['Dec'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(17)').text
                information['month']['nh'] = month

            elif hemisiphere == SouthernHemisiphere:
                month = {}
                month['Jan'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(6)').text
                month['Feb'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(7)').text
                month['Mar'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(8)').text
                month['Apr'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(9)').text
                month['May'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(10)').text
                month['Jun'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(11)').text
                month['Jul'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(12)').text
                month['Aug'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(13)').text
                month['Sep'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(14)').text
                month['Oct'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(15)').text
                month['Nov'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(16)').text
                month['Dec'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(17)').text
                information['month']['sh'] = month

            information['pinyin'] = (
                slug(itemName, style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
                slug(itemName, style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
            )

            for k in information:
                if k == 'pinyin' :
                    continue
                if k == 'month':
                    for h in information[k]:
                        for m in information[k][h]:
                            information[k][h][m].replace(' ','').replace('\n','').replace('\r','')
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

        fishJsonFile = './database/fish.js'
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

    results = []
    for hemisiphere in (NorthernHemisiphere, SouthernHemisiphere):
        tag = browser.find_element(By.CSS_SELECTOR,'div > ul.tabbernav > li > a[title=%s]' % hemisiphere)
        browser.execute_script('window.scrollTo(0,%s-100)' % tag.location['y'])
        tag.click()
        selector = 'div.tabbertab[title=%s] > table.roundy > tbody > tr > td > table > tbody > tr' % hemisiphere 
        data = browser.find_elements(By.CSS_SELECTOR, selector)
        for item in data:
            browser.execute_script('window.scrollTo(0,%s)' % item.location['y'])
            index = data.index(item)
            if index >= len(results):
                information = { }
                results.append(information)
            else:
                information = results[index]
            a = item.find_element(By.CSS_SELECTOR, "a.image.image-thumbnail")
            itemName = a.get_attribute('title')
            information['name'] = itemName
            img = a.find_element(By.CSS_SELECTOR, 'img')
            information['imgSource'] = img.get_attribute('src')
            information['price'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
            information['price'] = information['price'].replace(',','')
            information['location'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(3)').text
            information['time'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(4)').text

            if not 'month' in information.keys():
                information['month'] = {}
            if hemisiphere == NorthernHemisiphere:
                month = {}
                month['Jan'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(5)').text
                month['Feb'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(6)').text
                month['Mar'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(7)').text
                month['Apr'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(8)').text
                month['May'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(9)').text
                month['Jun'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(10)').text
                month['Jul'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(11)').text
                month['Aug'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(12)').text
                month['Sep'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(13)').text
                month['Oct'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(14)').text
                month['Nov'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(15)').text
                month['Dec'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(16)').text
                information['month']['nh'] = month

            elif hemisiphere == SouthernHemisiphere:
                month = {}
                month['Jan'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(5)').text
                month['Feb'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(6)').text
                month['Mar'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(7)').text
                month['Apr'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(8)').text
                month['May'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(9)').text
                month['Jun'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(10)').text
                month['Jul'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(11)').text
                month['Aug'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(12)').text
                month['Sep'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(13)').text
                month['Oct'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(14)').text
                month['Nov'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(15)').text
                month['Dec'] = item.find_element(By.CSS_SELECTOR, 'td:nth-child(16)').text
                information['month']['sh'] = month

            information['pinyin'] = (
                slug(itemName, style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
                slug(itemName, style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
            )

            for k in information:
                if k == 'pinyin':
                    continue
                if k == 'month':
                    for h in information[k]:
                        for m in information[k][h]:
                            information[k][h][m].replace(' ','').replace('\n','').replace('\r','')
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

        bugJsonFile = './database/bug.js'
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

        recipe = {}

        table = browser.find_element(By.CSS_SELECTOR, '#mw-content-text > div > table > tbody')
        # 名称
        title = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(1) > th')
        recipe['name'] = title.text
        recipe['pinyin'] = (
            slug(recipe['name'], style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
            slug(recipe['name'], style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
        )

        # 图片
        img = table.find_element(By.CSS_SELECTOR, 'tr:nth-child(2) > td > div > div.floatnone > a > img')
        imgURL = img.get_attribute('src')
        # 下载图片
        assetPath = '/assets/DIYRecipes'
        imgFile = '%s/%s.png' %(assetPath, recipe['name'])
        recipe['imgRef'] = imgURL
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
                material['pinyin'] = (
                    slug(material['name'], style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
                    slug(material['name'], style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
                )
                material['count'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
                img = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(1) > div > div.floatnone > a > img')
                imgSrcset = img.get_attribute('srcset')
                img2xURL = imgSrcset.split(',')[-1].split()[0]
                # 材料图片
                assetPath = '/assets/DIYMaterials'
                imgFile = '%s/%s.png' %(assetPath, material['name'])
                material['imgRef'] = img2xURL
                pyImgFile = '.%s' % imgFile
                if not os.path.exists(pyImgFile):
                    imgResponse = requests.get(img2xURL, stream=True)
                    if imgResponse.status_code == 200:
                        # 将内容写入图片
                        open(pyImgFile, 'wb').write(imgResponse.content) 
                        print("%s..图片下载完成" %(pyImgFile))
                    del imgResponse

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

def GrabArtData():
    browser.get('https://www.imore.com/animal-crossing-new-horizons-how-tell-if-redd-selling-fake-art')

    artsMap = []
    #名画
    table = browser.find_element(By.CSS_SELECTOR, '#article-65938 > div:nth-child(2) > div > div:nth-child(3) > table > tbody')
    trs = table.find_elements(By.CSS_SELECTOR, 'tr')
    for tr in trs:
        browser.execute_script('window.scrollTo(0,%s-100)' % tr.location['y'])
        art = {}
        art['engName'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(1)').text.replace(' ', '')
        art['category'] = '名画'
        art['engArtist'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
        art['name'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(1)').text.replace(' ', '')
        art['artist'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
        art['pinyin'] = (
            'pinyin',
            'py'
        )
        img = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(3) > a > img')
        art['imgSource'] = img.get_attribute('src')

        # 下载图片
        assetPath = '/assets/arts'
        imgFile = '%s/%s.png' %(assetPath, art['engName'])
        downloadFile(art['imgSource'], imgFile)

        artsMap.append(art)

    #雕塑
    table = browser.find_element(By.CSS_SELECTOR, '#article-65938 > div:nth-child(2) > div > div:nth-child(5) > table > tbody')
    trs = table.find_elements(By.CSS_SELECTOR, 'tr')
    for tr in trs:
        browser.execute_script('window.scrollTo(0,%s-100)' % tr.location['y'])
        art = {}
        art['engName'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(1)').text.replace(' ', '')
        art['category'] = '雕塑'
        art['engAuthor'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
        art['name'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(1)').text.replace(' ', '')
        art['artist'] = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(2)').text
        art['pinyin'] = (
            'pinyin',
            'py'
        )
        img = tr.find_element(By.CSS_SELECTOR, 'td:nth-child(3) > a > img')
        art['imgSource'] = img.get_attribute('src')

        # 下载图片
        assetPath = '/assets/arts'
        imgFile = '%s/%s.png' %(assetPath, art['engName'])
        downloadFile(art['imgSource'], imgFile)

        artsMap.append(art)

    # 写入js文件
    with open('./database/arts.js', "w", encoding='utf-8') as f:
        f.seek(0)
        f.write('var json=')
        json.dump(artsMap, f, ensure_ascii=False, indent=2)
        f.write('\n')
        f.write('module.exports={data:json}')
        print("写入文件完成...")
    browser.close()
    #真伪数据来源
    #https://gamerjournalist.com/all-real-paintings-and-statues-in-animal-crossing-new-horizons/

#下载图片
def downloadFile(url, filepath):
    pyFilepath = '.%s' % filepath
    if not os.path.exists(pyFilepath):
        imgResponse = requests.get(url, stream=True)
        if imgResponse.status_code == 200:
            # 将内容写入图片
            open(pyFilepath, 'wb').write(imgResponse.content) 
            print("%s..下载完成" %(pyFilepath))
            # # 压缩图片
            # print("%s..开始压缩" %(pyFilepath))
            # source = tinify.from_file(pyFilepath)
            # resized = source.resize(
            #     method="fit",
            #     width=500,
            #     height=500
            # )
            # resized.to_file(pyFilepath)
        del imgResponse

def GrabNeighbors():
    browser = webdriver.Chrome()
    browser.get('https://wiki.biligame.com/dongsen/%E5%B0%8F%E5%8A%A8%E7%89%A9%E5%9B%BE%E9%89%B4')
    neighborsMap = []
    originalWindowHandle = browser.current_window_handle
    datas = browser.find_elements(By.CSS_SELECTOR, '#CardSelectTr > tbody > tr')
    for item in datas:
        browser.execute_script('window.scrollTo(0,%s-100)' % item.location['y'])
        time.sleep(0.5)

        if item.get_attribute('data-param1') == '':
            continue

        neighbor = {}
        neighborsMap.append(neighbor)

        # 种族
        race = item.find_element(By.CSS_SELECTOR, 'td:nth-child(4)')
        neighbor['race'] = race.text

        a = item.find_element(By.CSS_SELECTOR, 'td > div > div.floatnone > a')
        detailURL = a.get_attribute('href')
        # 打开详情
        browser.execute_script('window.open("%s")' % detailURL)
        browser.switch_to_window(browser.window_handles[1])

        table = browser.find_element(By.CSS_SELECTOR, '#mw-content-text > div > div.box-poke-big > div.box-poke-left')

        # 名称
        nameNode = table.find_element(By.CSS_SELECTOR, 'div:nth-child(1)')
        neighbor['name'] = nameNode.text[:-1]

        # 性别 
        if nameNode.text[-1:] == '♂':
            neighbor['sex'] = '男'
        else:
            neighbor['sex'] = '女'

        neighbor['pinyin'] = (
            slug(neighbor['name'], style=Style.NORMAL, strict=False, heteronym=False, separator=''), 
            slug(neighbor['name'], style=Style.FIRST_LETTER, strict=False, heteronym=False, separator='')
        )

        # 图片
        img = browser.find_element(By.CSS_SELECTOR, '#mw-content-text > div > div.box-poke-big > div.box-poke-right > div > div > a > img')
        imgURL = img.get_attribute('src')
        # 下载图片
        assetPath = '/assets/neighbors'
        imgFile = '%s/%s.png' %(assetPath, neighbor['name'])
        neighbor['imgRef'] = imgURL
        pyImgFile = '.%s' % imgFile
        if not os.path.exists(pyImgFile):
            imgResponse = requests.get(imgURL, stream=True)
            if imgResponse.status_code == 200:
                # 将内容写入图片
                open(pyImgFile, 'wb').write(imgResponse.content) 
                print("%s..图片下载完成" %(pyImgFile))
            del imgResponse

        # 生日
        birthday = table.find_element(By.CSS_SELECTOR, 'div:nth-child(2) > font:nth-child(2)')
        neighbor['birthday'] = birthday.text

        # 性格
        character = table.find_element(By.CSS_SELECTOR, 'div:nth-child(3) > font:nth-child(2)')
        neighbor['character'] = character.text

        # 初始口头禅
        tag = table.find_element(By.CSS_SELECTOR, 'div:nth-child(4) > font:nth-child(2)')
        neighbor['tag'] = tag.text

        # 目标
        target = table.find_element(By.CSS_SELECTOR, 'div:nth-child(5) > font:nth-child(2)')
        neighbor['target'] = target.text

        # 座右铭
        motto = table.find_element(By.CSS_SELECTOR, 'div:nth-child(6) > div:nth-child(2)')
        neighbor['motto'] = motto.text

        # 外文名
        foreign_name = table.find_element(By.CSS_SELECTOR, 'div:nth-child(7) > font:nth-child(2)')
        neighbor['foreign_name'] = foreign_name.text

        browser.close()
        browser.switch_to_window(originalWindowHandle)

    # 写入js文件
    with open('./database/neighbors.js', "w", encoding='utf-8') as f:
        f.seek(0)
        f.write('var json=')
        json.dump(neighborsMap, f, ensure_ascii=False, indent=2)
        f.write('\n')
        f.write('module.exports={data:json}')
        print("写入文件完成...")
    browser.close()

# GrabFishData()
# GrabBugData()
# GrabDIYRecipes()
# GrabArtData()
GrabNeighbors()


#压缩图片
# dirPath = './assets/arts/fake'
# for p in os.listdir(dirPath):
#     path = '%s/%s' % (dirPath, p)
#     print("%s..开始压缩" %(path))
#     source = tinify.from_file(path)
#     resized = source.resize(
#         method="fit",
#         width=500,
#         height=500
#     )
#     resized.to_file(path)