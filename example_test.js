(function answerQuestionByCharacter(character, delay) {
  let index = 0;
  function getFeature(character) {
    for (let char of identifior.charList) {
      if (char.name == character) {
        return char.feature;
      }
    }
  }
  function answer() {
    if (identifior.candidateCount == identifior.maxCandidate) {
      console.log("回答结束");
      return;
    }
    let nowQuestion = document.querySelector("#question").innerText.trim()
    console.log(`===== 问题[${index++}]: ${nowQuestion} =====`);
    console.log(`目标角色: ${character.join(", ")}`);
    if (identifior.questionPhase == 0) {
      let matchCount = character.reduce((a, b) => {
        return a + (identifior.nowQuestion.characters.indexOf(b) >= 0 ? 1 : 0);
      }, 0);
      if (matchCount == character.length) {
        console.log(`选择: yes`);
        identifior.yes();
      } else if (matchCount == 0) {
        console.log(`选择: no`);
        identifior.no();
      } else {
        if (matchCount > character.length / 2) {
          console.log(`选择: yes`);
          identifior.yes();
        } else  if (matchCount < character.length / 2) {
          console.log(`选择: no`);
          identifior.yes();
        } else {
          console.log(`选择: noidea`);
          identifior.noidea();
        }
      }
    } else {
      let feature = false;
      for (let char of character) {
        let feat = getFeature(char);
        if (nowQuestion.indexOf(feat)>=0) {
          feature = true;
          break;
        }
      }
      if (feature) {
        console.log(`选择: yes`);
        identifior.yes();
      } else {
        console.log(`选择: no`);
        identifior.no();
      }
    }
    identifior.noideaCombo=0;
    identifior.noideaCount=0;
    setTimeout(answer, delay);
  }
  answer();
})(["小恶魔", "铃仙·优昙华院·因幡","魂魄妖梦"], 30);
