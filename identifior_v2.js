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
        this.maxCandidate = 10;
        this.candidateCount = 0;
        this.questionCount = 0;
        this.questionPhase = 0;
        this.charList = this.RawData.charNameList.map(obj => ({ name: obj.name, feature: obj.feature, score: 0, maxScore: 0, conf: 0 }))
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            v.matchScore = (this.charList.length / v.characters.length) * v.weight;
            v.mismatchScore = (this.charList.length / (this.charList.length - v.characters.length)) * v.weight;
            v.state = "needAnswer"
            this.questionCount++;
        }
        this.noideaCombo = 0;
        this.noideaCount = 0;
        this.calMaxScore()
        this.getQuestions()
        $(".mdui-col-md-2")
            .parent()
            .find("button")
            .prop("disabled", false);
    }

    calMaxScore() {
        for (let [k, v] of Object.entries(this.RawData.questions)) { //对于每个问题
            for (let char of this.charList) { //对于角色列表的每个角色
                if (v.characters.indexOf(char.name) != -1) { //如果具有该问题的属性
                    char.maxScore += v.matchScore
                }
                else {
                    char.maxScore += v.mismatchScore
                }
            }
        }
    }

    getQuestions() {
        var tmpCharacterCounter = 0;
        var tmpQuestion;
        this.NeedAnswerQuestion = 0;
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            if (v.state == "needAnswer") { //遍历寻找未被询问的问题
                this.NeedAnswerQuestion++;
                if (v.characters.length > tmpCharacterCounter) {
                    let preFlag = true
                    if (("predecessor" in v)) { //若该问题含有前驱
                        for (let [k, w] of Object.entries(this.RawData.questions)) { //如果前驱已被回答为是或前驱不存在（即默认为是）
                            if (w.id == v.predecessor) {
                                preFlag = false
                                if (w.state != "yes") { //如果前驱未回答为是，则以false退出
                                    break
                                }
                                else {
                                    preFlag = true
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
        this.refreshBar()
        if (!tmpCharacterCounter) { //无法找到更多可被选择的未被回答的问题
            this.questionPhase = 1;
            this.calScore();
            this.calConf();
            this.getFeatureQuestions();
            return;
        }
        this.nowQuestion = tmpQuestion;
        console.log(this.nowQuestion.matchScore, this.nowQuestion.mismatchScore)
        this.refreshQuestions();
    }

    getFeatureQuestions() {
        $("#question")[0].innerHTML = "这个角色" + this.charList[this.candidateCount].feature + "吗？";
        this.candidateCount++;
        this.refreshBar();
        if (!(this.candidateCount - this.maxCandidate)) {
            $("#answerProgress")[0].style.width = 100 + "%"
            this.calConf();
            showResult(0);
            return;
        }
    }

    refreshBar() {
        //1 - 未回答问题比例 = 回答了的问题比例
        $("#answerProgress")[0].style.width = (1 - ((this.NeedAnswerQuestion + (this.maxCandidate - this.candidateCount)) / (this.questionCount + this.maxCandidate))) * 100 + "%"
    }

    refreshQuestions() {
        $("#question")[0].innerHTML = this.nowQuestion.question;
    }

    checkConflict() {
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            if ("predecessor" in this.nowQuestion && v.state == "needAnswer" && this.nowQuestion.predecessor == v.predecessor) { //若该问题有前驱，且与遍历问题有相同前驱，将该问题设为NO
                v.state = "no"
            }
            if ("repel" in this.nowQuestion && v.state == "needAnswer" && this.nowQuestion.repel.indexOf(v.id) != -1) { //将该问题排斥的问题设为NO
                v.state = "no"
            }
            if ("repel" in v && v.repel.indexOf(this.nowQuestion.id) != -1) { //将排斥该问题的问题设为NO
                v.state = "no"
            }
        }
    }

    checkLeaf(question = this.nowQuestion) {
        for (let [k, v] of Object.entries(this.RawData.questions)) {
            if ("predecessor" in v && v.state == "needAnswer" && question.id == v.predecessor) { //若该问题是其他问题的前驱
                v.state = "no"
                this.checkLeaf(v)
            }
        }
    }

    yes() {
        if (this.questionPhase == 0) {
            this.nowQuestion.state = "yes"
            this.checkConflict()
            this.getQuestions()
            this.noideaCombo = 0;
        }
        else { //特征问题选是 置信度+=(1-置信度)/2
            this.charList[this.candidateCount - 1].score += this.charList[this.candidateCount - 1].maxScore;
            this.charList[this.candidateCount - 1].maxScore *= 2;
            this.getFeatureQuestions()
        }
    }

    no() {
        if (this.questionPhase == 0) {
            this.nowQuestion.state = "no"
            this.checkLeaf()
            this.getQuestions()
            this.noideaCombo = 0;
        }
        else {//特征问题选否 置信度*0.9
            this.charList[this.candidateCount - 1].score *= 0.9;
            this.getFeatureQuestions()
        }
    }

    noidea() {
        if (this.questionPhase == 0) {
            this.noideaCombo++;
            this.noideaCount++;
            if (this.noideaCombo > 5 || this.noideaCount > 10) {
                mdui.alert('你丫是认真的？');
                this.calConf(true);
                showResult(0);
                return;
            }
            this.nowQuestion.state = "noidea"
            this.getQuestions()
        }
        else {
            this.getFeatureQuestions()
        }
    }

    calScore() {
        this.charList = this.charList.map((obj) => ({ name: obj.name, conf: obj.conf, score: 0, maxScore: obj.maxScore, feature: obj.feature })) //重置得分
        for (let [k, v] of Object.entries(this.RawData.questions)) { //对于每个问题
            if (v.state == "yes") {
                for (let char of this.charList) { //对于角色列表的每个角色
                    if (v.characters.indexOf(char.name) != -1) { //如果具有该问题的属性
                        char.score += v.matchScore
                    }
                }
            }
            if (v.state == "no") {
                for (let char of this.charList) { //对于角色列表的每个角色
                    if (v.characters.indexOf(char.name) == -1) { //如果不具有该问题的属性
                        char.score += v.mismatchScore
                    }
                }
            }
        }
    }
    calConf(baka = false) {
        //console.clear()
        this.charList = this.charList.map((obj) => ({ name: obj.name, conf: obj.score / obj.maxScore, score: obj.score, maxScore: obj.maxScore, feature: obj.feature })).sort((a, b) => b.conf - a.conf) //通过角色的得分除以最大得分获得置信度
        for (let char of this.charList) {
            if (baka && char.name == "琪露诺") {
                char.conf = 9.9999;
                break;
            }
        }

        for (let [k, v] of Object.entries(this.charList)) {
            console.log(v.name + ":" + v.conf)
        }
    }

}
var identifior = new Identifior()
identifior.load()

