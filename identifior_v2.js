var jsondata;
var $ = mdui.$
class Character {
    constructor(name, score) {
        this.name = name
        this.score = score
    }
}
class Identifior {
    constructor() {

    }
    async load() {
        await fetch("./data.json")
            .then(value => value.json())
            .then(a => {
                this.RawData = a; //json数据
            })
            .then(() => { this.initRawData() })
    }

    initRawData() {
        this.questionCount = 0;
        this.charList = this.RawData.charNameList.map(name => ({ name, score: 0 }))
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            v.matchScore = (this.charList.length / v.characters.length) * v.weight;
            v.mismatchScore = (this.charList.length / (this.charList.length - v.characters.length)) * v.weight;
            v.state = "needAnswer"
            this.questionCount++;
        }
        this.noideaCombo = 0;
        this.noideaCount = 0;
        this.getQuestions()
        $(".mdui-col-md-2")
            .parent()
            .find("button")
            .prop("disabled", false);
    }
    getQuestions() {
        var tmpCharacterCounter = 0;
        var tmpQuestion;
        var tmpNeedAnswerQuestion = 0;
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            if (v.state == "needAnswer") { //遍历寻找未被询问的问题
                tmpNeedAnswerQuestion++;
                if (v.characters.length > tmpCharacterCounter) {
                    let preFlag = true
                    if (("predecessor" in v)) { //若该问题含有前驱
                        for (let [k, w] of Object.entries(this.RawData.questions)) { //如果前驱已被回答为是或前驱不存在（即默认为是）
                            if (w.id == v.predecessor) { 
                                preFlag = false
                                if (w.state != "yes"){ //如果前驱未回答为是，则以false退出
                                    break
                                }
                            } //遍历完所有问题未发现前驱，则默认为true
                        }

                    }
                    if (!preFlag) continue;
                    tmpCharacterCounter = v.characters.length;
                    tmpQuestion = v;
                }
            }
        }
        $("#answerProgress")[0].style.width = (1 - (tmpNeedAnswerQuestion / this.questionCount)) * 100 + "%"
        if (!tmpCharacterCounter) { //无法找到更多可被选择的未被回答的问题
            //多层前驱的话可能要把所有state为needAnswer的问题设为no
            $("#answerProgress")[0].style.width = 100 + "%"
            this.calResult();
            showResult(0);
            return;
        }
        this.nowQuestion = tmpQuestion;
        console.log(this.nowQuestion.matchScore, this.nowQuestion.mismatchScore)
        this.refreshQuestions();
    }
    refreshQuestions() {
        $("#question")[0].innerHTML = this.nowQuestion.question;
    }

    checkConflict() {
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            if ("predecessor" in this.nowQuestion && v.state == "needAnswer" && this.nowQuestion.predecessor==v.predecessor) { //若该问题有前驱，且与遍历问题有相同前驱，将该问题设为NO
                v.state = "no"
            }
            if ("repel" in this.nowQuestion && v.state == "needAnswer" && this.nowQuestion.repel.indexOf(v.id) != -1) { //将该问题排斥的问题设为NO
                v.state = "no"
            }
            if ("repel" in v && v.repel.indexOf(this.nowQuestion.id) != -1){ //将排斥该问题的问题设为NO
                v.state = "no"
            }
        }
    }
    checkLeaf(question = this.nowQuestion){
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            if ("predecessor" in v && v.state == "needAnswer" && question.id==v.predecessor) { //若该问题是其他问题的前驱
                v.state = "no"
                this.checkLeaf(v)
            }
        }
    }
    yes() {
        this.nowQuestion.state = "yes"
        this.checkConflict()
        this.getQuestions()
        this.noideaCombo = 0;
    }

    no() {
        this.nowQuestion.state = "no"
        this.checkLeaf()
        this.getQuestions()
        this.noideaCombo = 0;
    }

    noidea() {
        this.noideaCombo++;
        this.noideaCount++;
        if (this.noideaCombo > 5 || this.noideaCount > 10) {
            mdui.alert('你丫是认真的？');
            this.calResult(true);
            showResult(0);
            return;
        }

        this.nowQuestion.state = "noidea"
        this.getQuestions()
    }

    calResult(baka = false) {
        for (let [k, v] of Object.entries(this.RawData.questions)) { //对于每个问题
            if (v.state == "yes") {
                for (let char of this.charList) { //对于角色列表的每个角色
                    if (v.characters.indexOf(char.name) != -1) { //如果具有该问题的属性
                        char.score += v.matchScore
                    }
                    else {
                        char.score -= v.mismatchScore
                    }
                }
            }
            if (v.state == "no") {
                for (let char of this.charList) { //对于角色列表的每个角色
                    if (v.characters.indexOf(char.name) != -1) { //如果具有该问题的属性
                        char.score -= v.matchScore
                    }
                    else {
                        char.score += v.mismatchScore
                    }
                }
            }
        }
        for (let char of this.charList) {
            if (baka && char.name == "琪露诺") {
                char.score += 999
                break;
            }
        }
        console.clear()
        this.charList = this.softmax(this.charList).sort((a, b) => b.score - a.score)

        for (let [k, v] of Object.entries(this.charList)) {
            console.log(v.name + ":" + v.score)
        }
        $("#answerGroup")
            .find("button")
            .prop("disabled", true);
    }

    softmax(arr, temp = 2) {
        const exps = arr.map(obj => Math.exp(obj.score / temp));
        const sumOfExps = exps.reduce((acc, val) => acc + val, 0);
        const softmaxScores = exps.map(exp => exp / sumOfExps);
        const scoredArr = arr.map((obj, index) => ({
            name: obj.name,
            score: softmaxScores[index],
        }));
        return scoredArr.sort((a, b) => b.score - a.score);
    }
}
var identifior = new Identifior()
identifior.load()

