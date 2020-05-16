var fs = require("fs")
var XLSX = require('xlsx')

const workbook = XLSX.readFile('./database/database.xlsx');
var villagers_sheet_name = 'Villagers'

const woptions = {encoding:'utf8', flag:'w'}

function getTranslation(categroy, key){
    var translation = require(`@stun3r/acnh-translations/${categroy}.json`)
    for(const i in translation){
        var t = translation[i]
        if(t.ref === key){
            return t.localization.zh_CN 
        }
    }
    console.error(`找不到对应的翻译${categroy}, ${key}`)
    return key
}

//#region Villagers
var villagers = require('@nooksbazaar/acdb/villagers.json') 
var villagers_trans = require('@stun3r/acnh-translations/villagers.json')

var biliVillagers = require('../database/neighbors')

function transVillagers(){
    for(const i in biliVillagers.data){
        var biliViliager = biliVillagers.data[i]
        var engName = getVillagerByChineseName(biliViliager.name)
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

function getVillagerByChineseName(zhcnName){
    for(const i in villagers_trans){
        var villager_t = villagers_trans[i]
        if(villager_t.localization.zh_CN === zhcnName){
            return villager_t.ref
        }
    }
    console.error('找不到对应的英文村民', zhcnName)
    return 'undefined'
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


transVillagers()
//#endregion

//#region Reactions
var reactions_trans = require('@stun3r/acnh-translations/reactions.json')
var personlity_trans = require('@stun3r/acnh-translations/personlity.json')
var reactions_sheet_name = 'Reactions'
var reactions = XLSX.utils.sheet_to_json(workbook.Sheets[reactions_sheet_name], {raw:'false'})

function transerReactoins(){
    let results = []

    for(const i in reactions){
        var reaction = reactions[i]
        var result = {}
        result['engName'] = reaction.Name
        result['name'] = getReactionChineseName(reaction.Name)
        result['image'] = reaction.Image
        result['source'] = getPersonlityChineseName(reaction.Source)
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

function getReactionChineseName(engName) {
    for(const i in reactions_trans){
        var reaction_t = reactions_trans[i]
        if(reaction_t.ref === engName){
            return reaction_t.localization.zh_CN
        }
    }
    return engName
}

function getPersonlityChineseName(engName) {
    for(const i in personlity_trans){
        var personlity_t = personlity_trans[i]
        if(personlity_t.ref === engName){
            return personlity_t.localization.zh_CN
        }
    }
    return engName
}

// transerReactoins()
//#endregion