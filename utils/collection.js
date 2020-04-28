const promisify = require('./promisify').default

const getSystemInfo = promisify(wx.getSystemInfo)
let wxpgetStorage = promisify(wx.getStorage)
let wxpsetStorage = promisify(wx.setStorage)

function getCollectionData(){
    return new Promise(function(resolve, reject){
        wxpgetStorage({
            key:'collection'
        }).then(res => {
            resolve(res.data)
        }).catch(res => {
            console.log(res)
            wxpsetStorage({
                key:'collection',
                data:{}
            }).then(res => {
                resolve({})
            }).catch(res => {
                reject(res)
            })
        })
    })
}

function setCollectionData(type, key, value){
    return new Promise(function(resolve, reject){
        getCollectionData().then(data=>{
            if(data[type] === undefined){
                data[type] = {}
            }
            data[type][key] = value
            wxpsetStorage({
                key:'collection',
                data:data
            }).then(resolve)
            .catch(res => {
                reject(res)
            })
        })
    })
}

module.exports = {
    getCollectionData:getCollectionData,
    setCollectionData:setCollectionData,
    getSystemInfo:getSystemInfo,
}
