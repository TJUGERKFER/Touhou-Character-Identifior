class Identifior {
  constructor() {
    this.SpecialIndex = 0;
    this.__QuestionSpilt = 0.7;
  }
  async load() {
    await fetch("./data.json")
      .then(value => value.json())
      .then(a => {
        this.RawData = a; //json数据
      });
    this.initQuestions();
  }
  initCharacter() {
    const Characters = this.RawData.characters.map(value => new Character(value)); //转换成Character对象
    this.CharacterList = Characters;
    this.Characters = {};
    for (let value of Characters) {
      this.Characters[value.Name] = value; //转换characters数组为对象 [charactersName]:Character
    }
    this.calcWeight(this.Questions);
  }
  initQuestions() {
    this.Questions = Object.values(this.RawData.questions).map(value => new Question(value, this));
    this.askdQuestions = [];
    let Characters = new Set();
    for (let question of Object.values(this.RawData.questions)) {
      for (let character of question.characters) {
        Characters.add(character);
      }
    }
    this.RawData.characters = [...Characters];
    this.initCharacter();
  }
  calcWeight(AllQuestions) {
    //计算每个角色的(权?)
    let CharData = {}; // 每个角色在问题中的占比
    for (let question of AllQuestions) {
      for (let char of question.Characters) {
        if (!(char in CharData)) CharData[char] = [];
        CharData[char].push(1 / question.Characters.length);
      }
      const NotInQuestionCharacters = this.CharacterList.filter(value => !question.Characters.includes(value.Name));
      for (let char of NotInQuestionCharacters) {
        if (!(char.Name in CharData)) CharData[char.Name] = [];
        CharData[char.Name].push(1 / NotInQuestionCharacters.length);
      }
      question.NotInQuestionCharacters = NotInQuestionCharacters.map(v => v.Name);
    }
    CharData = Object.entries(CharData);
    for (let [name, data] of CharData) {
      this.Characters[name].Weight =
        (this.Questions == AllQuestions ? 100 - this.Characters[name].Score : 100) / data.reduce((a, b) => a + b);
      if (this.askdQuestions == AllQuestions) {
        this.Characters[name].Score = 0;
      }
    }
  }
  getQuestion() {
    const ChoiceQuestion = this._getQuestion();
    const finish = !ChoiceQuestion;
    if (finish) {
      this.calcWeight(this.askdQuestions); // 重新计算权值
      for (let SingleQuestion of this.askdQuestions) {
        if (SingleQuestion.State < 0) {
          // No
          for (let characterName of SingleQuestion.NotInQuestionCharacters) {
            this.Characters[characterName].Score +=
              (1 / SingleQuestion.NotInQuestionCharacters.length) * this.Characters[characterName].Weight;
          }
        } else if (SingleQuestion.State > 0) {
          // Yes
          for (let characterName of SingleQuestion.Characters) {
            this.Characters[characterName].Score +=
              (1 / SingleQuestion.Characters.length) * this.Characters[characterName].Weight;
          }
        }
      }
      this.CharacterList.sort((a, b) => b.Score - a.Score);
    } else {
      this.calcWeight(this.Questions); // 重新计算权值
      this.askdQuestions.push(this.Questions.splice(this.Questions.indexOf(ChoiceQuestion), 1)[0]);
      console.group(`第${this.askdQuestions.length}个问题`);
      console.log(
        "平均权值" +
          this.CharacterList.reduce((a, b) => {
            return a + b.Weight;
          }, 0) /
            this.CharacterList.length
      );
      let MaxWeight = this.CharacterList.reduce(
        (a, b) => {
          if (b.Weight > a.Weight) {
            return b;
          }
          return a;
        },
        { Weight: -Infinity }
      );
      console.log("最大权值" + MaxWeight.Weight + " " + MaxWeight.Name);
      let MinWeight = this.CharacterList.reduce(
        (a, b) => {
          if (b.Weight < a.Weight) {
            return b;
          }
          return a;
        },
        { Weight: Infinity }
      );
      console.log("最小权值" + MinWeight.Weight + " " + MinWeight.Name);
      console.groupEnd(`第${this.askdQuestions.length}个问题`);
    }
    return ChoiceQuestion;
  }
  _getQuestion() {
    //通过Score获取目前最符合的问题
    if (this.Questions.length == 0) return false;
    this.CharacterList.sort((a, b) => b.Score - a.Score); // 从大到小进行排序（人物分数）;
    const MiddleScore = this.CharacterList[Math.round(this.CharacterList.length * this.__QuestionSpilt)].Score;
    this.__QuestionSpilt *= 0.85;
    let ScoreHighCharacters = this.CharacterList.filter(value => value.Score >= MiddleScore); //过滤出 Score >= 中位数的人物
    if (ScoreHighCharacters.length <= 5) return false; //当剩下角色不足5结束提问
    const ChoiceQuestion = this.Questions.map(value => {
      const Score = ScoreHighCharacters.reduce((
        previousValue /*　之前累加器返回的结果　*/,
        currentValue /* 现在处理的数组元素 */
      ) => {
        if (value.Characters.includes(currentValue.Name)) {
          // 如果问题包含这个人物的话
          return ++previousValue; //返回之前的值+1
        }
        return previousValue;
      }, 0); //累加器
      return [Score, value];
    }).sort((a, b) => b[0] - a[0] /* [0]是分数 */)[0 /*取分数最高*/][1 /*问题*/]; // 给每个问题进行打分并且排序，取包含相关度高人物最多的问题 结构 [Score,Question]
    return ChoiceQuestion;
  }
}
class Question {
  constructor(question, identifior) {
    this.Identifior = identifior;
    this.Question = question.question;
    this.Characters = question.characters;
    this.State = 0;
  }
  yes() {
    this.State = 1;
    for (let characterName of this.Characters) {
      this.Identifior.Characters[characterName].Score +=
        (1 / this.Characters.length) * this.Identifior.Characters[characterName].Weight; //加分
    }
  }
  no() {
    this.State = -1;
    let addScoreCharacters = this.Identifior.CharacterList.filter(value => !this.Characters.includes(value.Name));
    for (let item of addScoreCharacters) {
      item.Score += (1 / addScoreCharacters.length) * item.Weight; //加分
    }
  }
}
class Character {
  constructor(name) {
    this.Name = name;
    this.Score = 0;
    this.Weight = 0;
  }
}
