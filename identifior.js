genso = new Array
var character; //将character 移动到全局作用域
//propertyarr=[hair,eye,cloth,hat,bow,wing,hand,tail]
//(发色,瞳色,服色,帽子,蝴蝶结,翅膀,手持物,尾巴){ //暖色设为true
question = ["角色名占位",
    "这个角色的头发第一眼看上去是暖色调的吗？",
    "这个角色的瞳色看上去是暖色调的吗？",
    "这个角色穿的衣服看上去是暖色调的吗？",
    "这个角色头上戴了帽子吗？",
    "这个角色身上有类似于蝴蝶结的饰品吗（头上，胸前或者其他）？",
    "这个角色有翅膀吗？",
    "这个角色的手上拿着东西吗？",
    "这个角色有尾巴吗？",
    "这个角色身上有明显可见的动物特征吗？",
]
function girl(name, hair, eye, cloth, hat, bow, wing, hand, tail, animal, question, score) {
    this.name = name
    this.hair = hair
    this.eye = eye
    this.cloth = cloth
    this.hat = hat
    this.bow = bow
    this.wing = wing
    this.hand = hand
    this.tail = tail
    this.animal = animal
    this.score = 0
    this.question = question
    genso.push(this)
}
function reload() {
    commonquestion = 9
    genso = new Array
    decision = new Array
    decision.push("角色名")
    showbest.innerHTML = " "
    showother.innerHTML = " "
    document.getElementById("yesbtn").onclick = yes
    document.getElementById("nobtn").onclick = no
    document.getElementById("dontknowbtn").onclick = noidea
    //红
    var 博丽灵梦 = new girl("博丽灵梦", false, false, true, false, true, false, true, false, false, "她手中的道具是御币吗？")
    var 雾雨魔理沙 = new girl("雾雨魔理沙", true, true, false, true, true, true, true, false, false, "她手中的道具是扫把吗？")
    var 露米娅 = new girl("露米娅", true, true, false, false, false, false, false, false, false, "她的手臂呈十字架形吗？")
    var 琪露诺 = new girl("琪露诺", false, false, false, false, true, true, false, false, false, "她的翅膀由六根冰晶组成吗？")
    var 大妖精 = new girl("大妖精", false, false, false, false, true, true, true, false, false, "她的头发是绿色的吗？")
    var 红美铃 = new girl("红美铃", false, false, false, true, false, false, false, false, false, "她看起来会武术吗？")
    var 小恶魔 = new girl("小恶魔", true, true, false, false, false, true, false, true, true, "她背后有恶魔翅膀吗？")
    var 帕秋莉 = new girl("帕秋莉", false, false, false, true, false, false, true, false, false, "她手中的道具是魔法书吗？")
    var 十六夜咲夜 = new girl("十六夜咲夜", false, false, false, true, false, false, true, false, false, "她手中的道具是飞刀吗？")
    var 蕾米莉亚_斯卡雷特 = new girl("蕾米莉亚·斯卡雷特", false, false, false, true, false, true, false, false, true, "她背后有恶魔翅膀吗？")
    var 芙兰朵露_斯卡雷特 = new girl("芙兰朵露·斯卡雷特", true, true, true, true, false, true, false, true, false, "她的翅膀上有水晶吗？")
    //妖
    var 蕾蒂_霍瓦特洛克 = new girl("蕾蒂·霍瓦特洛克", false, false, false, true, false, false, false, false, false, "她戴着一顶白色帽子吗？")
    var 橙 = new girl("橙", false, false, true, true, true, false, false, true, true, "她有两条尾巴吗？")
    var 爱丽丝_玛格特洛依德 = new girl("爱丽丝·玛格特洛依德", true, false, false, false, false, false, true, false, false, "她手中的道具是魔法书吗")
    var 莉莉霍瓦特 = new girl("莉莉霍瓦特", true, true, false, true, true, true, false, false, false, "她的翅膀看起来像蝴蝶吗")
    var 露娜萨_普莉兹姆利巴 = new girl("露娜萨·普莉兹姆利巴", true, true, false, true, false, false, true, false, false, "她手里拿的是提琴吗？")
    var 梅露兰_普莉兹姆利巴 = new girl("梅露兰·普莉兹姆利巴", false, false, false, true, false, false, true, false, false, "她手里拿的是小号吗？")
    var 莉莉卡_普莉兹姆利巴 = new girl("莉莉卡·普莉兹姆利巴", false, false, true, true, false, false, true, false, false, "她手里拿的是琴吗？")
    var 魂魄妖梦 = new girl("魂魄妖梦", false, true, false, false, true, false, true, false, false, "她身旁飘着灵魂吗？")
    var 西行寺幽幽子 = new girl("西行寺幽幽子", true, true, false, true, false, false, false, false, false, "她手里拿着扇子吗？")
    var 八云蓝 = new girl("八云蓝", true, true, false, true, false, false, false, true, true, "她是狐狸吗")
    var 八云紫 = new girl("八云紫", true, false, false, true, true, false, true, false, false, "她手上拿着花伞吗")
    //永
    var 莉格露_奈特巴格 = new girl("莉格露·奈特巴格", false, false, false, false, false, false, false, false, true, "她头上有触角吗？")
    var 米斯蒂娅_萝蕾拉 = new girl("米斯蒂娅·萝蕾拉", true, false, true, true, false, true, false, false, true, "她是鸟吗？")
    var 上白泽慧音 = new girl("上白泽慧音", false, true, false, true, false, false, false, false, false, "她头上顶着奇怪的帽子吗？")
    var 因幡帝 = new girl("因幡帝", false, true, false, false, false, false, false, false, true, "她长着兔耳吗？")
    var 铃仙_优昙华院_因幡 = new girl("铃仙·优昙华院·因幡", false, true, false, false, false, false, false, false, true, "她穿着制服吗？")
    var 八意永琳 = new girl("八意永琳", false, false, true, true, false, false, true, false, false, "她手中拿着弓吗？")
    var 蓬莱山辉夜 = new girl("蓬莱山辉夜", false, false, true, false, true, false, false, false, false, "她手中拿着蓬莱玉枝吗？")
    var 藤原妹红 = new girl("藤原妹红", false, true, true, false, false, false, false, false, false, "她穿着背带裤吗？")
    //花
    var 射命丸文 = new girl("射命丸文", false, true, false, true, true, false, true, false, true, "她看起来跑得很快吗？")
    var 梅蒂欣_梅兰可莉 = new girl("梅蒂欣·梅兰可莉", true, false, true, false, true, false, false, false, false, "她是人偶吗")
    var 风见幽香 = new girl("风见幽香", false, true, true, false, false, false, true, false, false, "她身上有花作装饰吗")
    var 小野塚小町 = new girl("小野塚小町", true, true, false, false, false, false, true, false, false, "她拿着镰刀？")
    var 四季映姬_夜摩仙那度 = new girl("四季映姬·夜摩仙那度", false, false, false, true, false, false, true, false, false, "她拿着悔悟之棒吗")
    //风
    var 秋静叶 = new girl("秋静叶", true, true, true, false, false, false, false, false, false, "她看起来有秋天的感觉吗？")
    var 秋穰子 = new girl("秋穰子", true, true, true, true, false, false, false, false, false, "她看起来像红薯吗")
    var 键山雏 = new girl("键山雏", false, false, true, false, true, false, false, false, false, "她头上的发带和她的头发红配绿吗？")
    var 河城荷取 = new girl("河城荷取", false, false, false, true, false, false, true, false, false, "她手中拿着狗尾草或者水枪吗")
    var 犬走椛 = new girl("犬走椛", false, false, false, true, false, false, true, true, true, "她拿着刀和盾吗")
    var 东风谷早苗 = new girl("东风谷早苗", false, false, false, false, false, false, true, false, false, "她头发上有蛇形饰物吗")
    var 八坂神奈子 = new girl("八坂神奈子", false, true, true, false, false, false, false, false, false, "她背后背着像麻花一样的东西吗")
    var 洩矢诹访子 = new girl("洩矢诹访子", true, true, false, true, false, false, false, false, false, "她帽子上有眼睛吗")
    //地
    var 琪斯美 = new girl("琪斯美", false, false, false, false, false, false, false, false, false, "她坐在桶里吗？")
    var 黑谷山女 = new girl("黑谷山女", true, true, true, false, false, false, false, false, false, "她穿着泡泡裤吗？")
    var 水桥帕露西 = new girl("水桥帕露西", true, true, true, false, false, false, false, false, false, "她看起来一副忧郁/嫉妒脸吗？")
    var 星熊勇仪 = new girl("星熊勇仪", true, true, false, false, false, false, true, false, false, "她头上有一只角吗？")
    var 古明地觉 = new girl("古明地觉", false, false, false, false, false, false, false, false, false, "她胸口有紧闭的眼睛饰物吗")
    var 火焰猫燐 = new girl("火焰猫燐", true, true, false, false, true, false, true, true, true, "她是猫吗？")
    var 灵乌路空 = new girl("灵乌路空", false, false, false, false, true, true, true, false, true, "她手上套着一个核燃料棒吗？")
    var 古明地恋 = new girl("古明地恋", false, false, true, true, false, false, false, false, false, "她胸口有打开的眼睛饰物吗")
    //星
    var 娜兹玲 = new girl("娜兹玲", false, true, false, false, false, false, true, true, true, "她是老鼠吗？")
    var 多多良小伞 = new girl("多多良小伞", false, true, false, false, false, false, true, false, false, "她的伞有舌头吗？")
    var 云居一轮 = new girl("云居一轮", false, false, false, true, false, false, true, false, false, "她看起来像宗教信徒吗？")
    var 村纱水蜜 = new girl("村纱水蜜", false, false, false, true, false, false, true, false, false, "她看起来像舰长吗？")
    var 寅丸星 = new girl("寅丸星", true, true, true, false, true, false, true, false, true, "她看起来像老虎吗？")
    var 圣白莲 = new girl("圣白莲", true, true, false, false, false, false, true, false, false, "她头发和身边有咒语吗？")
    var 封兽鵺 = new girl("封兽鵺", false, true, false, false, true, true, true, false, false, "她的翅膀看起来很特别吗？")
    //神
    var 幽谷响子 = new girl("幽谷响子", false, false, true, false, false, false, true, false, false, "她拿着跟扫把吗？");
    var 宫古芳香 = new girl("宫古芳香", false, false, true, true, false, false, false, false, false, "她是僵尸吗？");
    var 霍青娥 = new girl("霍青娥", false, false, false, false, false, false, false, false, false, "她头上有个八字辫吗？");
    var 苏我屠自古 = new girl("苏我屠自古", false, false, false, true, false, false, false, false, false, "她看起来像幽灵吗？");
    var 物部布都 = new girl("物部布都", false, false, false, true, false, false, false, false, false, "她头上有个高高的帽子吗？");
    var 丰聪耳神子 = new girl("丰聪耳神子", true, false, true, false, false, false, true, false, false, "她戴着耳机(?)吗？");
    var 二岩猯藏 = new girl("二岩猯藏", true, false, true, false, false, false, false, true, true, "她看起来像狸猫吗？");
    //辉
    var 堀川雷鼓 = new girl("堀川雷鼓", true, true, false, false, false, true, false, false, "她是不是身旁有很多鼓？");
    var 少名针妙丸 = new girl("少名针妙丸", false, true, true, true, false, false, true, false, false, "她的帽子是黑色的吗?");
    var 鬼人正邪 = new girl("鬼人正邪", false, true, false, false, true, false, false, false, false, "她的眼睛是红色的吗？");
    var 九十九弁弁 = new girl("九十九弁弁", false, false, true, false, false, true, false, false, "她的衣服是以黄色的吗");
    var 九十九八桥 = new girl("九十九八桥", true, false, false, false, false, false, true, false, false, "他她是短发吗？");
    var 今泉影狼 = new girl("今泉影狼", false, true, true, false, true, false, false, false, true, "她的裙子是以红白为主吗？");
    var 赤蛮奇 = new girl("赤蛮奇", true, true, true, false, true, false, false, false, false, "她头上的蝴蝶结是不是紫色的？");
    var 若鹭姬 = new girl("若鹭姬", false, false, false, true, false, false, false, true, true, "她是人鱼吗？");
    //绀
    var 清兰 = new girl("清兰", false, true, false, false, false, false, true, false, true, "她有没有兔耳朵？");
    var 铃瑚 = new girl("铃瑚", false, true, true, true, false, false, true, false, true, "她的衣服是黄色的吗");
    var 哆来咪_苏伊特 = new girl("哆来咪·苏伊特", false, false, false, true, false, false, true, false, false, "她的帽子是红色的吗？");
    var 稀神探女 = new girl("稀神探女", false, true, false, false, false, true, false, false, "她的翅膀是白色的吗？ ");
    var 克劳恩皮丝 = new girl("克劳恩皮丝", true, true, true, true, false, false, true, false, false, "她的衣服是不是红色和蓝色为主？");
    var 纯狐 = new girl("纯狐", true, true, false, true, false, false, false, false, false, "她的衣服是黑色为主吗？");
    var 赫卡提亚_拉碧斯拉祖利 = new girl("赫卡提亚·拉碧斯拉祖利", true, true, false, true, false, false, true, false, false, "她的头发是不是红色的？");
    //天
    var 爱塔妮缇拉尔瓦 = new girl("爱塔妮缇拉尔瓦", false, true, false, false, false, true, false, false, true, "她的衣服是不是绿色的？");
    var 坂田合欢 = new girl("坂田合欢", false, true, true, false, false, false, true, false, false, "她的头发是不是灰色的？");
    var 高丽野阿吽 = new girl("高丽野阿吽", false, false, true, false, false, false, false, false, "她的衣服是不是有祥云图案？");
    var 矢田寺成美 = new girl("矢田寺成美", false, true, false, true, false, false, false, false, false, "她的裙子是灰色为主吗？");
    var 摩多罗隐岐奈 = new girl("摩多罗隐岐奈", true, true, true, true, false, false, true, false, false, "她的衣服是以黄色为主吗?");
    var 尔子田里乃 = new girl("尔子田里乃", false, true, true, true, false, false, true, false, false, "她手里是不是拿着草叶？");
    var 丁礼田舞 = new girl("丁礼田舞", false, false, false, true, false, false, true, false, false, "她是不是手里拿着竹子？");
    //鬼
    var 戎璎花 = new girl("戎璎花", false, true, false, false, false, false, false, false, false, "她的裙子是以白色为主吗？");
    var 牛崎润美 = new girl("牛崎润美", false, true, false, false, false, false, true, true, true, "她的头发是不是一半黑一半白？");
    var 庭渡久侘歌 = new girl("庭渡久侘歌", true, true, true, true, true, true, false, true, true, "她的帽子是红色的吗？");
    var 吉吊八千慧 = new girl("吉吊八千慧", true, true, false, false, true, false, false, true, true, "她是不是有黄色的鹿角？");
    var 杖刀偶磨弓 = new girl("杖刀偶磨弓", true, true, true, false, false, false, true, false, false, "她的衣服是以黄色为主吗");
    var 埴安神袿姬 = new girl("埴安神袿姬", false, true, true, false, false, false, true, false, false, "她身上是不是带着雕刻刀？");
    var 骊驹早鬼 = new girl("骊驹早鬼", false, true, true, true, false, true, false, false, false, "她的帽子是红色的吗？");
    //格
    var 永江衣玖 = new girl("永江衣玖", false, true, false, true, true, false, false, false, false, "她的头发是不是紫色的？");
    var 比那名居天子 = new girl("比那名居天子", false, true, false, true, true, false, true, false, false, "她的帽子上面有没有草叶？");
    var 秦心 = new girl("秦心", true, true, false, false, true, false, true, false, false, "她的头上是不是有一个类似于面具的东西？");
    var 依神紫苑 = new girl("依神紫苑", false, false, false, false, true, false, true, false, false, "她的头发是深蓝色的吗？");
    var 依神女苑 = new girl("依神女苑", true, true, true, true, true, false, true, false, false, "她的衣服是不是紫色的？");
    var 宇佐见堇子 = new girl("宇佐见堇子", false, true, false, true, false, false, false, false, false, "她是不是带着眼镜？");
    //弹幕小数点
    var 桑妮米尔克 = new girl("桑妮米尔克", true, true, true, true, true, true, false, false, false, "她的裙子是以红白为主吗？");
    var 露娜切露德 = new girl("露娜切露德", true, true, false, false, true, true, false, false, false, "她的裙子是以黑白为主吗？");
    var 斯塔萨菲雅 = new girl("斯塔萨菲雅", false, false, false, false, true, true, false, false, false, "她的裙子上有星星吗？");
    var 姬海棠果 = new girl("姬海棠果", false, false, false, false, false, true, false, false, false, "她的翅膀是黑色的吗？");
    for (i = 1; i < genso.length; i++) {
        genso[i].score = 0
    }
    nowquestion = 1
    document.getElementById("question").innerHTML = question[nowquestion]
    document.getElementById("total").innerHTML = "当前本系统可以鉴定" + genso.length + "个角色！"
    document.getElementById("firstpage").innerHTML = " "
    document.getElementById("secondpage").innerHTML = " "
    document.getElementById("thirdpage").innerHTML = " "
}
function yes() {
    var truecount = 0
    var propertytmp = new Array
    decision.push("true")
    for (i = 0; i < genso.length; i++) { //取出所有该特征为true的成员
        var values = Object.values(genso[i])
        propertytmp.push(values[nowquestion]) //把所有成员的该属性放入数组方便加分时使用
        if (values[nowquestion]) {
            truecount++
        }
    }
    bonuspower = truecount / (genso.length - truecount) //属性特别程度决定该问题得分倍率
    for (i = 0; i < genso.length; i++) {
        if (propertytmp[i]) {
            genso[i].score = ((100 / Object.keys(genso[i]).length) / bonuspower) + genso[i].score //加分
        }
    }
    next()
}
function no() {
    var falsecount = 0
    var propertytmp = new Array
    decision.push("false")
    for (i = 0; i < genso.length; i++) { //取出所有该特征为false的成员
        var values = Object.values(genso[i])
        propertytmp.push(values[nowquestion]) //把所有成员的该属性放入数组方便加分时使用
        if (!values[nowquestion]) {
            falsecount++
        }
    }
    bonuspower = falsecount / (genso.length - falsecount) //属性特别程度决定该问题得分倍率
    for (i = 0; i < genso.length; i++) {
        if (!propertytmp[i]) {
            genso[i].score = ((100 / Object.keys(genso[i]).length) / bonuspower) + genso[i].score //加分
        }
    }
    next()
}
function noidea() {
    decision.push("noidea")
    next()
}
function next() {
    nowquestion++
    if (nowquestion > 10) {
        specialquestion.load()
        specialquestion.ask()
    } else if (nowquestion <= commonquestion) {
        document.getElementById("question").innerHTML = question[nowquestion]
    }
}
function end() {
    scoresort()
    document.getElementById("showbest").innerHTML = "她应该是:" + character[0][0]
    document.getElementById("showother").innerHTML = " 上面的答案不对？那还可能是:" + character[0][1] + "或者" + character[0][2]
    document.getElementById("wikitip").innerHTML = "你可以查看thbwiki上的角色介绍:"
    document.getElementById("firstpage").href = "https://thbwiki.cc/" + character[0][0]
    document.getElementById("firstpage").innerHTML = character[0][0]
    document.getElementById("secondpage").href = "https://thbwiki.cc/" + character[0][1]
    document.getElementById("secondpage").innerHTML = character[0][1]
    document.getElementById("thirdpage").href = "https://thbwiki.cc/" + character[0][2]
    document.getElementById("thirdpage").innerHTML = character[0][2]
    if (character[1][2] == 0 && character[1][1] == 0) {
        document.getElementById("showbest").innerHTML = "宁也算是东方众？"
        document.getElementById("showother").innerHTML = " "
        document.getElementById("firstpage").innerHTML = " "
        document.getElementById("secondpage").innerHTML = " "
        document.getElementById("thirdpage").innerHTML = " "
        document.getElementById("wikitip").innerHTML = " "
    }
}
function scoresort() {
    character = new Array(3).fill([]); // ==> [[],[],[]] 人类可读
    for (i = 0; i < genso.length; i++) { //二维数组保存数据
        character[0].push(genso[i].name)
        character[1].push(genso[i].score)
        character[2].push(genso[i].question)
    }
    for (i = 0; i < character[0].length; i++) { //选择排序
        min = character[1][i]
        for (j = i; j < character[0].length; j++) {
            if (character[1][j] > min) {
                min = character[0][j]  //交换角色名称
                temp = character[0][i]
                character[0][i] = character[0][j]
                character[0][j] = temp
                min = character[1][j]  //交换角色分数
                temp = character[1][i]
                character[1][i] = character[1][j]
                character[1][j] = temp
                min = character[2][j]  //交换角色问题
                temp = character[2][i]
                character[2][i] = character[2][j]
                character[2][j] = temp
            }
        }
    }
}
specialquestion = {
    load: function () {
        scoresort()
        document.getElementById("yesbtn").onclick = specialquestion.yes
        document.getElementById("nobtn").onclick = specialquestion.no
        document.getElementById("dontknowbtn").onclick = specialquestion.dontknow
    },
    ask: function () {
        if (nowquestion > commonquestion + 9) {
            end()
            document.getElementById("yesbtn").onclick = ()=>{}
            document.getElementById("nobtn").onclick = ()=>{}
            document.getElementById("dontknowbtn").onclick = ()=>{}
            return;
        }
        document.getElementById("question").innerHTML = character[2][nowquestion - commonquestion]
    },
    yes: function () {
        character[1][nowquestion - commonquestion] = character[1][nowquestion - commonquestion] + 20
        nowquestion++
        specialquestion.ask()
    },
    no: function () {
        character[1][nowquestion - commonquestion] = character[1][nowquestion - commonquestion] * 0.8
        nowquestion++
        specialquestion.ask()
    },
    dontknow: function () {
        nowquestion++
        specialquestion.ask()
    },
}