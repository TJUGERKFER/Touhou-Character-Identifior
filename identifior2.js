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
  }
  initQuestions() {
    this.SimpleQuestions = Object.values(this.RawData.questions)
      .filter(value => !value.special)
      .map(value => new Question(value, this));
    this.SpecialQuestion = {};
    let SpecialQuestion = Object.values(this.RawData.questions).filter(value => value.special);
    for (let value of SpecialQuestion) {
      SpecialQuestion[value.characters[0]] = value;
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
  getQuestion() {
    //通过Score获取目前最符合的问题
    this.CharacterList.sort((a, b) => b.Score - a.Score); // 将对象转为数组并从大到小进行排序;
    if (this.SimpleQuestions.length == 0) return this.GetSpecialQuestion(); // 普通问题回答结束判断
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
    if (this.SpecialIndex < 5) {
      this.askdQuestions.push(this.SpecialQuestion[this.CharacterList[0].Name]);
      const Question = this.SpecialQuestion[this.CharacterList[0].Name];
      delete this.SpecialQuestion[this.CharacterList[0].Name];
      return Question;
    }
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
    let bonuspower = this.Characters.length / (this.Identifior.CharacterList.length - this.Characters.length);
    for (let characterName of this.Characters) {
      if (this.special) {
        this.Identifior.Characters[characterName].Score += 22;
      } else {
        this.Identifior.Characters[characterName].Score += 100 / this.Characters.length / bonuspower;
      }
    }
  }
  no() {
    let bonuspower = this.Characters.length / (this.Identifior.CharacterList.length - this.Characters.length);
    if (this.special) {
      this.Identifior.Characters[characterName].Score *= 0.78;
    } else {
      let addScoreCharacters = this.CharacterList.filter(value => !this.Characters.includes(value.Name));
      for (let item of addScoreCharacters) {
        item.Score += 100 / this.Characters.length / bonuspower;
      }
    }
  }
}
class Character {
  constructor(name) {
    this.Name = name;
    this.Score = 0;
  }
}
