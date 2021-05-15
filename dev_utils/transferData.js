const fs = require("fs")
const XLSX = require('xlsx')
const workbook = XLSX.readFile('./database/database.xlsx');
const pinyin = require('pinyin')
const slug = require('slug')

const woptions = {encoding:'utf8', flag:'w'}

const MonthEnum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Locale = {
    shadow : {"X-Small":"特小", "Small":"小", "Medium":"中等", "Large":"大", "X-Large":"特大"},
    movementSpeed : {"Stationary":"静止的", "Very slow":"非常慢", "Slow":"慢", "Medium":"中等", "Fast":"快", "Very fast":"非常快"},
    dayTime : {"All day":"全天"}
}

function getTranslation(categroy, key, locale='CNzh'){
    var translation = require(`@alexislours/translation-sheet-data/${categroy}.json`)
    for(const i in translation){
        var t = translation[i]
        if(t.id === key){
            return t.locale[locale]
        }
    }
    console.error(`找不到对应的翻译${categroy}, ${key}`)
    return key
}

function getJSONObject_FromSheet(sheet_name) {
    var sheet = workbook.Sheets[sheet_name]
    if(sheet === 'undefined'){
        console.log('Can not found the sheet!', sheet_name)
        return sheet
    }
    var range = XLSX.utils.decode_range(sheet["!ref"])
    for(var R = range.s.r + 1; R <= range.e.r; ++R) {
        for(var C = range.s.c; C <= range.e.c; ++C) {
            var cell_address = {c:C, r:R};
            /* if an A1-style address is needed, encode the address */
            var cell_ref = XLSX.utils.encode_cell(cell_address);
            var cell = sheet[cell_ref]
            if(cell){
                if(cell.f){
                    cell.t = 's'
                    cell.v = cell.f
                }
            }
        }
    }
    return XLSX.utils.sheet_to_json(sheet, {raw:'true'})
}

//#region Villagers
var villagers = require('@nooksbazaar/acdb/villagers.json') 

var biliVillagers = require('../database/neighbors')

function transVillagers(){
    for(const i in biliVillagers.data){
        var biliViliager = biliVillagers.data[i]
        var engName = getTranslation('villagers', biliViliager.name)
        var villager = getVillager(engName)
        biliViliager['houseImage'] = villager.houseImage
        biliViliager['hobby'] = getTranslation('hobby', villager.hobby) 
        var colorlist = []
        for(var ci in villager.colors){
            var c = getTranslation('color', villager.colors[ci]) 
            colorlist.push(c)
        }
        biliViliager['colors'] = colorlist 
        var stylelist = []
        for(var si in villager.styles){
            var s = getTranslation('style', villager.styles[si]) 
            if(!(stylelist.includes(s))){
                stylelist.push(s)
            }
        }
        biliViliager['styles'] = stylelist 

        biliViliager['favoriteSong'] = getTranslation('music', villager.favoriteSong)
    }

    var data = JSON.stringify(biliVillagers.data, null, 2)
    fs.writeFile('./database/villagers.js', data, woptions,
        (err)=>{
            if(err) {
                console.error(err)
                return
            }

            console.log('写入文件成功, villagers')
        })
}

function getVillager(engName){
    for(const i in villagers){
        var villager = villagers[i]
        if(villager.name === engName){
            return villager
        }
    }
    console.error('找不到对应的村民', engName)
    return 'undefined'
}


//#endregion

//#region Reactions
function transerReactoins(){
    let results = []
    let reactions = getJSONObject_FromSheet('Reactions')
    for(const i in reactions){
        var reaction = reactions[i]
        var result = {}
        result['engName'] = reaction.Name
        result['name'] = getTranslation('reactions', reaction.Name)
        result['image'] = reaction.Image
        result['source'] = getTranslation('personlity', reaction.Source)
        result['notes'] = reaction['Source Notes']
        results.push(result)
    }

    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/reactions.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! reactions')
    })
}

//#endregion

//#region 家具
//Housewares,Miscellaneous,Wall-mounted,Fencing,Wallpaper,Floors,Rugs,
let handled_InternalID_list = []
function transferFurniture(){
    handled_InternalID_list = []

    var houseware_list = getJSONObject_FromSheet('Housewares')
    var miscellaneous_list = getJSONObject_FromSheet('Miscellaneous')
    var wall_mounted_list = getJSONObject_FromSheet('Wall-mounted')
    var fencing_list = getJSONObject_FromSheet('Fencing')
    var wallpaper_list = getJSONObject_FromSheet('Wallpaper')
    var floors_list = getJSONObject_FromSheet('Floors')
    var rugs_list = getJSONObject_FromSheet('Rugs')

    let results = []

    for(const i in houseware_list){
        var item = houseware_list[i]
        if(handled_InternalID_list.includes(item['Internal ID'])){
            continue
        }
        
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('furniture', item.Name)
        result['buy'] = item.Buy
        result['sell'] = item.Sell
        result['size'] = item.Size
        result['source'] = item.Source
        result['interact'] = item.Interact ? '是':'否'
        var variants = getVariants(houseware_list, item)
        var variants_list = []
        for(const v in variants){
            var variant = variants[v]
            var vresult = {}
            vresult['variation'] = variant.Variation 
            vresult['imgRef'] = variant.Image.substring(7, variant.Image.length-2)
            vresult['color'] = [getTranslation('color', variant['Color 1']), 
                getTranslation('color', variant['Color 2'])]
            variants_list.push(vresult)
        }
        result['variants'] = variants_list
        results.push(result)
    }

    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/housewares.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! housewares')
    })

    results = []
    for(const i in miscellaneous_list){
        var item = miscellaneous_list[i]
        if(handled_InternalID_list.includes(item['Internal ID'])){
            continue
        }
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('etc', item.Name)
        result['buy'] = item.Buy
        result['sell'] = item.Sell
        result['size'] = item.Size
        result['source'] = item.Source
        result['interact'] = item.Interact ? '是':'否'
        var variants = getVariants(miscellaneous_list, item)
        var variants_list = []
        for(const v in variants){
            var variant = variants[v]
            var vresult = {}
            vresult['variation'] = variant.Variation 
            vresult['imgRef'] = variant.Image.substring(7, variant.Image.length-2)
            vresult['color'] = [getTranslation('color', variant['Color 1']), 
                getTranslation('color', variant['Color 2'])]
            variants_list.push(vresult)
        }
        result['variants'] = variants_list
        results.push(result)
    }
    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/miscellaneous.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! miscellaneous')
    })

    results = []
    for(const i in wall_mounted_list){
        var item = wall_mounted_list[i]
        if(handled_InternalID_list.includes(item['Internal ID'])){
            continue
        }
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('all', item.Name)
        result['buy'] = item.Buy
        result['sell'] = item.Sell
        result['size'] = item.Size
        result['source'] = item.Source
        result['interact'] = item.Interact ? '是':'否'
        var variants = getVariants(wall_mounted_list, item)
        var variants_list = []
        for(const v in variants){
            var variant = variants[v]
            var vresult = {}
            vresult['variation'] = variant.Variation 
            vresult['imgRef'] = variant.Image.substring(7, variant.Image.length-2)
            vresult['color'] = [getTranslation('color', variant['Color 1']), 
                getTranslation('color', variant['Color 2'])]
            variants_list.push(vresult)
        }
        result['variants'] = variants_list
        results.push(result)
    }
    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/wall_mounted.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! wall_mounted')
    })

    results = []
    for(const i in fencing_list){
        var item = fencing_list[i]
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('fences', item.Name)
        result['imgRef'] = item.Image.substring(7, item.Image.length-2)
        result['stackSize'] = item['Stack Size']
        result['sell'] = item.Sell
        result['source'] = item.Source
        results.push(result)
    }
    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/fencing.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! fencing')
    })

    results = []
    for(const i in wallpaper_list){
        var item = wallpaper_list[i]
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('walls', item.Name)
        result['imgRef'] = item.Image.substring(7, item.Image.length-2)
        result['VFX'] = item.VFX
        result['VFXType'] = item['VFX Type']
        result['buy'] = item.Buy
        result['sell'] = item.Sell
        result['source'] = item.Source
        result['color'] = [getTranslation('color', item['Color 1']), 
            getTranslation('color', item['Color 2'])]
        results.push(result)
    }
    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/wallpaper.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! wallpaper')
    })

    results = []
    for(const i in floors_list){
        var item = floors_list[i]
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('floors', item.Name)
        result['VFX'] = item.VFX
        result['VFXType'] = item['VFX Type']
        result['buy'] = item.Buy
        result['sell'] = item.Sell
        result['source'] = item.Source
        results.push(result)
    }
    var data = JSON.stringify(results, null, 2)
    fs.writeFile('./database/floors.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! floors')
    })

    results = []
    for(const i in rugs_list){
        var item = rugs_list[i]
        var result = {}
        result['engName'] = item.Name
        result['name'] = getTranslation('rugs', item.Name)
        results.push(result)
    }
}

//获得所有变体
function getVariants(source_list, base_item){
    try {
        let variants = []
        for(const i in source_list){
            var item = source_list[i]
            if(item['Internal ID'] === base_item['Internal ID']){
                variants.push(item)
            }
        }
        handled_InternalID_list.push(base_item['Internal ID'])
        return variants
    } catch (error) {
        console.log(error) 
        return 'undifined' 
    }
}

//#endregion

//#region 海洋生物
function hanldeAllSeaCreature(){
    let list = getJSONObject_FromSheet('Sea Creatures')
    let results = []
    for(const i in list){
        const data = list[i]
        let info = {}
        info['enName'] = data['Name']
        info['jpName'] = getTranslation('sea', `DiveFish_${data['Internal ID'].toString().padStart(5, "0")}`, 'JPja')
        info['name'] = getTranslation('sea', `DiveFish_${data['Internal ID'].toString().padStart(5, "0")}`)
        let iconImagePath = data['Icon Image']
        info['imgSource'] = iconImagePath.substring(7, iconImagePath.length-2)
        info['price'] = data['Sell']
        info['totalCatchesToUnlock'] = data['Total Catches to Unlock']
        info['shadowSize'] = Locale.shadow[data['Shadow']] ?? data['Shadow']
        info['movementSpeed'] = Locale.movementSpeed[data['Movement Speed']] ?? data['Movement Speed']
        let time = ""
        let month = {}
        month['nh'] = {}
        month['sh'] = {}
        for(const monthIndex in MonthEnum)
        {
            const monthStr = MonthEnum[monthIndex]
            const nhSpawnTime = data[`NH ${monthStr}`]
            month['nh'][monthStr] = nhSpawnTime != "NA" ? '✓':'-'

            const shSpawnTime = data[`SH ${monthStr}`]
            month['sh'][monthStr] = shSpawnTime != "NA" ? '✓':'-'

            if(nhSpawnTime != "NA" && time == ""){
                time = Locale.dayTime[nhSpawnTime] ?? nhSpawnTime 
            }
        }

        info['month'] = month
        info['time'] = time.trim().replace(/\s+/g, '')
        info['pinyin'] = []
        info['pinyin'].push( slug( pinyin(info['name'], {style:pinyin.STYLE_NORMAL}).toString() ) )
        info['pinyin'].push( slug( pinyin(info['name'], {style:pinyin.STYLE_FIRST_LETTER}).toString() ) )

        results.push(info)
    }

    const data = `var json=${JSON.stringify(results, null, 2)}
module.exports={data:json}`
    fs.writeFile('./database/sea_creatures.js', data, woptions, (err)=>{
        if(err){
            console.error(err)
            return
        }

        console.log('写入文件成功! sea_creatures')
    })

}
//#endregion

// transVillagers()
// transferFurniture()
// transerReactoins()
hanldeAllSeaCreature()