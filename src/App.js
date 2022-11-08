const MissionUtils = require("@woowacourse/mission-utils");

class App {
  START_NUM = 1;
  END_NUM = 9;

  constructor() {
    this.random = [];
    this.userInput = [];
  }

  play() {
    this.generateRandomNums();
    this.compareRandomWithUserInput();
  }

  generateRandomNums() {
    let randomNums = [];

    while (randomNums.length !== 3) {
      let randomNum = MissionUtils.Random.pickNumberInRange(
        this.START_NUM,
        this.END_NUM
      );

      if (!randomNums.includes(randomNum))
        randomNums = [...randomNums, randomNum];
    }
    this.random = randomNums;
  }

  getUserInput(comment, callback) {
    MissionUtils.Console.readLine(comment, callback);
  }

  compareRandomWithUserInput() {
    this.getUserInput("숫자를 입력해주세요 : ", (answers) => {
      this.checkUserInput(answers);

      this.userInput = [...answers];

      this.giveScore();
    });
  }

  checkUserInput(answers) {
    if ((answers + "").length !== 3)
      throw new RangeError("3자리 숫자를 입력해주세요");
    else if ((answers + "").length !== new Set([...(answers + "")]).size)
      throw new Error("중복된 숫자를 입력할 수 없습니다.");
  }

  giveScore() {
    const result = {};

    this.random.forEach((randomNum, i) => {
      if (randomNum === +this.userInput[i]) {
        result.strike = (result.strike ?? 0) + 1;
      } else if (this.random.includes(+this.userInput[i])) {
        result.ball = (result.ball ?? 0) + 1;
      }
    });
    return this.determineGameStatus(result);
  }

  print(input) {
    let notice = "";

    if (typeof input !== "object") notice = input;
    else {
      let { strike, ball } = input;
      notice =
        strike && ball
          ? `${ball}볼 ${strike}스트라이크`
          : strike && !ball
          ? `${strike}스트라이크`
          : !strike && ball
          ? `${ball}볼`
          : `낫싱`;
    }

    MissionUtils.Console.print(notice);
  }

  determineGameStatus({ strike, ball }) {
    this.print({ strike, ball });

    return strike === 3 ? this.engGame() : this.compareRandomWithUserInput();
  }

  engGame() {
    this.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");

    this.getUserInput(
      "게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요",
      (answers) => this.continueGameOrStop(answers)
    );
  }
}

const app = new App();
app.play();

module.exports = App;
