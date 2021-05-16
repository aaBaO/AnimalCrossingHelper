const fs = require("fs")
const XLSX = require('xlsx')
const workbook = XLSX.readFile('./database/database.xlsx');
const pinyin = require('pinyin')
const slug = require('slug')
const {Source, Color} = require('@nooksbazaar/acdb/all')
const {Category} = require('@nooksbazaar/acdb/items')

const woptions = {encoding:'utf8', flag:'w'}

const MonthEnum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Locale = {
    shadow : {"X-Small":"特小", "Small":"小", "Medium":"中等", "Large":"大", "X-Large":"特大"},
    movementSpeed : {"Stationary":"静止的", "Very slow":"非常慢", "Slow":"慢", "Medium":"中等", "Fast":"快", "Very fast":"非常快"},
    dayTime : {"All day":"全天"},
    color:{[Color.Aqua]:"水蓝色", [Color.Beige]:"米色", [Color.Black]:"黑色", [Color.Blue]:"蓝色",
           [Color.Brown]:"棕色", [Color.Colorful]:"彩色", [Color.Gray]:"灰色", [Color.Green]:"绿色",
           [Color.Orange]:"橙色", [Color.Pink]:"粉色", [Color.Purple]:"紫色", [Color.Red]:"红色", [Color.White]:"白色", [Color.Yellow]:"黄色"}
}

//翻译需要查询的文件索引
const TranslateFileMap = {
    items:['furniture', 'variants', 'etc', 'marinesuitsvariants', 'swim_suit', 'patterns', 'accessories', 'accessoriesvariants', 
           'fishmodels', 'bugsmodels', 'furniture'],
    creatures:['sea'],
    villagers:['villagers'],
    source:['specialnpcs']
}

function getTranslation(category, key, locale = 'CNzh'){
    if(key == "NA") return key
    if(key == "NFS") return "非卖品"
    for(let i in TranslateFileMap[category]){
        var translation = require(`@alexislours/translation-sheet-data/${TranslateFileMap[category][i]}.json`)
        for(const i in translation){
            var t = translation[i]
            if(t.locale.USen === key){
                return t.locale[locale]
            }
        }
    }
    console.error(`找不到对应的翻译${category}, ${key}`)
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
function handleItems(){
    let handled_InternalID_list = []
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

    let categoryList = [Category.Housewares, Category.Miscellaneous, Category.ClothingOther]

    for(const index in categoryList){
        let category = categoryList[index]
        let data_list = getJSONObject_FromSheet(category)
        category = category.replace(/\s+/g, '')
        let results = []
        
        for(const i in data_list){
            var item = data_list[i]
            if(handled_InternalID_list.includes(item['Internal ID'])){
                continue
            }
            
            let result = {}
            result['category'] = category
            result['enName'] = item["Name"]
            result['jpName'] = getTranslation('items', item.Name, 'JPja')
            result['name'] = getTranslation('items', item.Name)
            result['size'] = item["Size"] 
            if(item["Buy"] != "NFS"){
                result['price'] = item["Buy"].toString() 
            }
            else{
                if(item["Exchange Price"] != "NA"){
                    let ex_currency = getTranslation('source', item["Exchange Currency"]) 
                    result['price'] = item["Exchange Price"].toString()+ex_currency 
                }
            }
            result['source'] = item["Source"].split(';')
            for(let i in result['source']){
                result['source'][i] = result['source'][i].trim()
            }
            //source/event
            if(item["Season/Event"] != "NA"){
                result['src-evt'] =  item["Season/Event"]
            }
            result['interact'] = item["Interact"] == "No" ? '否':'是'
            let variants = getVariants(data_list, item)
            let variants_list = []
            for(const index in variants){
                let variant = variants[index]
                let vresult = {}
                vresult['variation'] = getTranslation('items', variant["Variation"]) 
                let imgPath = (variant["Image"] || variant["Closet Image"])
                vresult['imgRef'] = imgPath.substring(7, imgPath.length-2)
                vresult['color'] = [Locale.color[variant['Color 1']] ?? variant['Color 1'], 
                    Locale.color[variant['Color 2']] ?? variant['Color 2']]
                variants_list.push(vresult)
            }
            result['variants'] = variants_list
            results.push(result)
        }

        const data = `var json=${JSON.stringify(results, null, 0)}
    module.exports={data:json}`
        fs.writeFile(`./package_items/database/${category}.js`, data, woptions, (err)=>{
            if(err){
                console.error(err)
                return
            }

            console.log(`写入文件成功! ${category}`)
        })
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
        info['jpName'] = getTranslation('creatures', data['Name'], 'JPja')
        info['name'] = getTranslation('creatures', data['Name'])
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
handleItems()
// transerReactoins()
// hanldeAllSeaCreature()