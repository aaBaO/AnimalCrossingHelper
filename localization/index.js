const Locale = {
    //shadow size
    "X-Small":"特小", "Small":"小", "Medium":"中等", "Large":"大", "X-Large":"特大",

    //movement speed
    "Stationary":"静止的", "Very slow":"非常慢", "Slow":"慢", "Medium":"中等", "Fast":"快", "Very fast":"非常快",

    //color
    "Aqua":"水蓝色", "Beige":"米色", "Black":"黑色", "Blue":"蓝色",
    "Brown":"棕色", "Colorful":"彩色", "Gray":"灰色", "Green":"绿色",
    "Orange":"橙色", "Pink":"粉色", "Purple":"紫色", "Red":"红色", "White":"白色", "Yellow":"黄色",

    //special npc 
    "Cyrus": "健兆",
    "Reese": "莉咏",
    "Chip": "俞正",
    "C.J.": "俞司廷",
    "Joan": "曹谷",
    "Daisy Mae": "曹卖",
    "Katrina": "星薇",
    "Nat": "龙山先生",
    "Flick": "龙克斯",
    "Saharah": "骆岚",
    "Copper": "警察叔叔",
    "Booker": "警察叔叔",
    "Wilbur": "陆德里",
    "Orville": "莫里",
    "Redd": "狐利",
    "Phineas": "博陆恩",
    "Gracie": "葛瑞斯",
    "Wisp": "幽幽",
    "Gulliver": "吕游",
    "Gullivarrr": "海盗",
    "Label": "绵儿",
    "Mabel": "绢儿",
    "Sable": "麻儿",
    "Grams": "阿玉婆婆",
    "Leilani": "沽玉",
    "Kapp'n": "航平",
    "Leila": "沽沽",
    "Katie": "咪露",
    "Blanca": "无脸猫",
    "Porter": "车长叔叔",
    "Don": "开关叔叔",
    "Resetti": "电源叔叔",
    "Lottie": "巧美",
    "Lyle": "阿本先生",
    "Blathers": "傅达",
    "Celeste": "傅珂",
    "Pavé": "阿欢",
    "Brewster": "老板",
    "Jack": "南瓜王",
    "Pelly": "宋信子",
    "Phyllis": "宋信美",
    "Pete": "程信雄",
    "Harriet": "刀丽茹",
    "Zipper": "蹦蹦",
    "Timmy": "豆狸",
    "Tom Nook": "狸克",
    "Tommy": "粒狸",
    "Jingle": "铃铃鹿",
    "Pascal": "阿獭",
    "Kicks": "薛革",
    "Leif": "然然",
    "Harvey": "巴猎",
    "Isabelle": "西施惠",
    "Digby": "西施德",
    "Luna": "梦美",
    "K.K.": "K.K.",
    "DJ KK": "DJ KK",
    "Tortimer": "寿伯",
    "Franklin": "富蓝",
    "Shrunk": "笑匠",
    "Wendell": "海项",
    "Rover": "陌陌",

    //source
    "Crafting":"DIY", "Nook's Cranny":"Nook商店", "Nintendo":"Nintendo", "Nook Shopping Daily Selection":"Nook购物每日精选(里程机)",
    "Nook Shopping Promotion":"Nook购物促销(里程机)", "Birthday":"生日", "Starting items":"初始道具", "Nook Miles Redemption":"里数兑换(里程机)", 
    "NookLink":"NookLink手机app", "HHA":"快乐家协会", "Dodo Airlines":"", "Mom":"妈妈", "All villagers":"全部村民",

    //exchange currency
    "Nook Points":"狸点数(手机NS online app)","Heart Crystals":"爱的结晶","Nook Miles":"里数",
}

function getCNzh(key){
    return Locale[key] ?? key
}

module.exports = {
    getCNzh
}