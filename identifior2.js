class Identifior {
  constructor() {
    this.SpecialIndex = 0;
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
    this.SimpleQuestions = Object.values(this.RawData.questions)
      .filter(value => !value.special)
      .map(value => new Question(value, this));
    this.SpecialQuestion = {};
    let SpecialQuestion = Object.values(this.RawData.questions).filter(value => value.special);
    for (let value of SpecialQuestion) {
      this.SpecialQuestion[value.characters[0]] = new Question(value, this);
    }
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
    let AllQuestions = this.SimpleQuestions.concat(Object.values(this.SpecialQuestion));
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
    if (this.SimpleQuestions.length == 0) {
      let NowQuestion = this.GetSpecialQuestion();
      if (!NowQuestion) this.CharacterList.sort((a, b) => b.Score - a.Score); // 从大到小进行排序;
      if (Math.max(...this.CharacterList.map(a => a.Score)) > 99) return false;
      return NowQuestion;
    } // 普通问题回答结束判断
    this.CharacterList.sort((a, b) => b.Score - a.Score); // 从大到小进行排序;
    const MiddleScore = this.CharacterList[Math.round(this.CharacterList.length * 0.5)].Score;
    let ScoreHighCharacters = this.CharacterList.filter(value => value.Score >= MiddleScore); //过滤出 Score >= 中位数的人物
    const ChoiceQuestion = this.SimpleQuestions.map(value => {
      const Score = ScoreHighCharacters.reduce((previousValue, currentValue) => {
        if (value.Characters.includes(currentValue.Name)) {
          // 如果问题包含这个人物的话
          return ++previousValue; //返回之前的值+1
        }
        return previousValue;
      }, 0); //累加器
      return [Score, value];
    }).sort((a, b) => b[0] - a[0] /* [0]是分数 */)[0 /*取分数最高*/][1 /*问题*/]; // 给每个问题进行打分并且排序，取包含相关度高人物最多的问题 结构 [Score,Question]
    this.askdQuestions.push(this.SimpleQuestions.splice(this.SimpleQuestions.indexOf(ChoiceQuestion), 1));
    return ChoiceQuestion;
  }
  GetSpecialQuestion() {
    if (this.SpecialIndex == 0) {
      this.CharacterList.sort((a, b) => b.Score - a.Score); // 从大到小进行排序;
    }
    if (this.SpecialIndex < 5) {
      if (Object.keys(this.SpecialQuestion).length == 0) return false;
      if (!(this.CharacterList[this.SpecialIndex].Name in this.SpecialQuestion)) {
        this.SpecialIndex++;
        return this.GetSpecialQuestion();
      }
      this.askdQuestions.push(this.SpecialQuestion[this.CharacterList[this.SpecialIndex].Name]);
      const Question = this.SpecialQuestion[this.CharacterList[this.SpecialIndex].Name];
      delete this.SpecialQuestion[this.CharacterList[this.SpecialIndex].Name];
      this.SpecialIndex++;
      return Question;
    }
    this.SpecialIndex++;
    return false;
  }
}
class Question {
  constructor(question, identifior) {
    this.Identifior = identifior;
    this.Question = question.question;
    this.Characters = question.characters;
    this.special = question.special;
  }
  yes() {
    for (let characterName of this.Characters) {
      this.Identifior.Characters[characterName].Score +=
        (1 / this.Characters.length) * this.Identifior.Characters[characterName].Weight;
    }
  }
  no() {
    if (this.special) {
      for (let characterName of this.Characters) {
        this.Identifior.Characters[characterName].Score *= 0.8;
        this.Identifior.SpecialIndex = 0;
      }
    } else {
      let addScoreCharacters = this.Identifior.CharacterList.filter(value => !this.Characters.includes(value.Name));
      for (let item of addScoreCharacters) {
        item.Score += (1 / addScoreCharacters.length) * item.Weight;
      }
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
