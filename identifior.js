class Identifior {
  constructor() {
    this.SpecialIndex = 0;
    this.QuestionSpilt = 0.5;
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
    this.calcWeight();
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
  calcWeight() {
    //计算每个角色的(权?)
    let AllQuestions = this.Questions; //拼接数组
    let CharData = {}; // 每个角色在问题中的占比
    for (let question of AllQuestions) {
      if (question.special) {
        //如果为特殊问题,则仅考虑符合问题的角色
        for (let char of question.Characters) {
          if (!(char in CharData)) CharData[char] = [];
          CharData[char].push(1 / question.Characters.length);
        }
      } else {
        //如果不是特殊问题 则考虑到所有角色
        for (let char of question.Characters) {
          if (!(char in CharData)) CharData[char] = [];
          CharData[char].push(1 / question.Characters.length);
        }
        const NotInQuestionCharacters = this.CharacterList.filter(value => !question.Characters.includes(value.Name));
        for (let char of NotInQuestionCharacters) {
          if (!(char.Name in CharData)) CharData[char.Name] = [];
          CharData[char.Name].push(1 / NotInQuestionCharacters.length);
        }
      }
    }
    CharData = Object.entries(CharData);
    for (let [name, data] of CharData) {
      this.Characters[name].Weight = 100 / data.reduce((a, b) => a + b);
    }
  }
  getQuestion() {
    //通过Score获取目前最符合的问题
    if (this.Questions.length == 0) return false;
    if (Math.max(...this.CharacterList.map(a => a.Score)) > 95) return false; //当最大可信度>95%结束提问
    this.CharacterList.sort((a, b) => b.Score - a.Score); // 从大到小进行排序（人物分数）;
    const MiddleScore = this.CharacterList[Math.round(this.CharacterList.length * this.QuestionSpilt)].Score;
    this.QuestionSpilt *= 0.85;
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
    this.askdQuestions.push(this.Questions.splice(this.Questions.indexOf(ChoiceQuestion), 1));
    return ChoiceQuestion;
  }
}
class Question {
  constructor(question, identifior) {
    this.Identifior = identifior;
    this.Question = question.question;
    this.Characters = question.characters;
  }
  yes() {
    for (let characterName of this.Characters) {
      this.Identifior.Characters[characterName].Score +=
        (1 / this.Characters.length) * this.Identifior.Characters[characterName].Weight; //加分
    }
  }
  no() {
    let addScoreCharacters = this.Identifior.CharacterList.filter(value => !this.Characters.includes(value.Name));
    for (let item of addScoreCharacters) {
      item.Score += (1 / addScoreCharacters.length) * item.Weight; //加分
    }
  }
}
class Character {
  // 这个对象没有任何原型功能
  constructor(name) {
    this.Name = name;
    this.Score = 0;
    this.Weight = 0;
  }
}
