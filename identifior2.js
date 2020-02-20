class Identifior {
  constructor() {}
  async load() {
    await fetch("./data.json")
      .then(value => value.json())
      .then(a => {
        this.RawData = a; //json数据
      });
    this.initCharacter();
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
    this.Questions = Object.values(this.RawData.questions).map(value => new Question(value, this));
    this.askdQuestions = [];
  }
  getQuestion() {
    //通过Score获取目前最符合的问题
    this.CharacterList.sort((a, b) => b.Score - a.Score); // 将对象转为数组并从大到小进行排序;
    if(this.Questions.length == 0) return false; // 回答结束判断
    let LastValue;
    if(this.CharacterList.slice(0,3).every((value,index)=>{ //如果前三分数不同 则结束问题
      if(index==0) {
        LastValue=value.Score;
        return true;
      } else {
        if(LastValue != value.Score) {
          LastValue=value.Score;
          return true;
        }
        return false;
      } 
    })) return false; // 回答结束判断
    const MiddleScore = this.CharacterList[Math.round(this.CharacterList.length * 0.5)].Score;
    let ScoreHighCharacters = this.CharacterList.filter(value => value.Score >= MiddleScore); //过滤出 Score >= 中位数的人物
    const ChoiceQuestion=this.Questions.map(value => {
      const Score = ScoreHighCharacters.reduce((previousValue, currentValue) => {
        if (value.Characters.includes(currentValue.Name)) {
          // 如果问题包含这个人物的话
          return ++previousValue; //返回之前的值+1
        }
        return previousValue;
      }, 0); //累加器
      return [Score, value];
    }).sort((a, b) => b[0] - a[0] /* [0]是分数 */)[0 /*取分数最高*/][1 /*问题*/]; // 给每个问题进行打分并且排序，取包含相关度高人物最多的问题 结构 [Score,Question]
    this.askdQuestions.push(this.Questions.splice(this.Questions.indexOf(ChoiceQuestion),1));
    return ChoiceQuestion;
  }
}
class Question {
  constructor(question, identifior) {
    this.Identifior = identifior;
    this.Question = question.question;
    this.Characters = question.characters;
  }
  yes(){
    for(let characterName of this.Characters) {
      this.Identifior.Characters[characterName].Score += 1/this.Characters.length;
    }
  }
  no(){
    for(let characterName of this.Characters) {
      this.Identifior.Characters[characterName].Score *= 0.7;
    }
  }
}
class Character {
  constructor(name) {
    this.Name = name;
    this.Score = 0;
  }
}
