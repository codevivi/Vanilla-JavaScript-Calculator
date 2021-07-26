/*
percent explanation
90 [+] 10 [%] = 99  calculates as: 90 + (10% of 90) = 99
90 [-] 10 [%] = 81  calculates as: 90 - (10% of 90) = 81
90 [x] 10 [%] = 810 calculates as: 90 x (10% of 90) = 810
90 [/] 10 [%] = 10  calculates as: 90 / (10% of 90) = 10
10 [%] = 0          calculates as: calculator does not process

For the [+], [-], [x], [/] operators, the calculator sees the 10 [%] as 10% of 90 which is equal to 9. 

*/

let calc = document.getElementById("calculator-id");
let disp = document.getElementById("main-display-id");
let miniDisp = document.getElementById("mini-display-id");
let infoM = document.getElementById("info-M-id");
let infoE = document.getElementById("info-E-id");
let btns = document.getElementsByClassName("bt");
let buttons = {};
let activeBtn = false;
let workingButton = null;
let error = "";

let numberStrOnDisplay = "0";
let num1 = null;
let num2 = null;
let calculation = null;
let result = null;

let justGotResult = false;
let lastEntry = "";
let memoryNum = 0;
let memoryError = "";
let emptyResult = false;
let isHelpMode = false;

infoE.textContent = "";
infoM.textContent = "";
miniDisp.textContent = "MR: " + memoryNum.toString();
disp.textContent = 0;

let operations = {
  clear: clear,
  clearMemory: clearMemory,
  clearAll: clearAll,
  toggleHelpMode: toggleHelpMode,

  recallMemory: recallMemory,
  saveToMemory: saveToMemory,
  minusFromMemory: minusFromMemory,
  addToMemory: addToMemory,

  deleteLastEntry: deleteLastEntry,
  changeSign: changeSign,
  percentageOfNumber1: percentageOfNumber1,
  squareRoot: squareRoot,

  writeNumber: writeNumber,
  writeDecimalPoint: writeDecimalPoint,
  prepCalculation: prepCalculation,
  calcAndShowResult: calcAndShowResult,
};

let calculations = {
  add: add,
  subtract: subtract,
  multiply: multiply,
  divide: divide,
};

let Button = function (element) {
  this.elem = element;
  this.id = this.elem.id;
  this._numberStr = this.elem.innerText;
  this._dataset = this.elem.dataset;
  this._keyCode = this._dataset.keyCode;
  this._description = this._dataset.description;
  //this.operation = operations[this._dataset.operation];
  this.operation = window[this._dataset.operation];

  this.showDescription = function showDescription() {
    miniDisp.textContent = "Keyboard: " + this._keyCode;
    disp.textContent = this._description;
  };
  this.impossibleStyle = function impossibleStyle(btn) {
    btn.style.color = "red";
    setTimeout(function () {
      btn.style.color = "#cde7b0";
    }, 300);
  };
  this.act = function act() {
    if (isHelpMode && this.id !== "help") {
      this.showDescription();
    } else {
      if (
        (!error && !memoryError) ||
        this.id === "clear" ||
        this.id === "ac" ||
        this.id === "mc"
      ) {
        this.operation();
      }
    }
  };
};

function makeButtons() {
  for (let i = 0; i < btns.length; i++) {
    buttons[btns[i].id] = new Button(btns[i]);
  }
}
makeButtons();

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", activateBtn, false);
}
document.addEventListener("keydown", activateBtnWithKeyb, false);
document.addEventListener("keyup", removeActiveClassWithKeyb, false);

function activateBtn(evt) {
  evt.preventDefault();
  activeBtn = buttons[evt.target.id];
  activeBtn.act();
}
let keyDown = false;

function activateBtnWithKeyb(evt) {
  if (!keyDown) {
    if (evt.code !== "Tab" && evt.code !== "Enter") {
      evt.preventDefault();
      activeBtn = Object.values(buttons).find(
        (button) => button._keyCode === evt.code
      );

      console.log("Active button: ", activeBtn);
      activeBtn.act();
      activeBtn.elem.classList.add("bt-active");
      keyDown = true;
    }
  }
}

function removeActiveClassWithKeyb(evt) {
  activeBtn.elem.classList.remove("bt-active");
  keyDown = false;
}

//////////////////////////////// Calculations functions DOWN ////////////////////////////
function add(num1, num2) {
  let result;
  let commonMultiplier = getCommonMultiplier(num1, num2);

  result =
    (num1 * commonMultiplier + num2 * commonMultiplier) / commonMultiplier;
  return dealWithLongNumbers(result);
}

function subtract(num1, num2) {
  let result;
  let commonMultiplier = getCommonMultiplier(num1, num2);

  result =
    (num1 * commonMultiplier - num2 * commonMultiplier) / commonMultiplier;
  return dealWithLongNumbers(result);
}

function multiply(num1, num2) {
  let result;
  result =
    (removeDecimal(num1) * removeDecimal(num2)) /
    (decimalMultiplier(num1) * decimalMultiplier(num2));
  return dealWithLongNumbers(result);
}

function divide(num1, num2) {
  let result;
  if (num2 === 0) {
    error = "Division by 0 is impossible.";
    infoE.textContent = "E";
    miniDisp.textContent = error;
    return "Undefined";
  }
  result =
    (removeDecimal(num1) / removeDecimal(num2)) *
    (decimalMultiplier(num2) / decimalMultiplier(num1));
  return dealWithLongNumbers(result);
}
/////// Helpers DOWN////////

function removeDecimal(num) {
  return Number(num.toString().replace(".", ""));
}

function decimalMultiplier(num) {
  let numberString = num.toString();
  let decimalIndex = numberString.indexOf(".");
  let multiplier;
  let decimalPlace;
  if (decimalIndex !== -1) {
    decimalPlace = numberString.length - decimalIndex - 1;
    multiplier = 1;
    for (let i = 1; i <= decimalPlace; i++) {
      multiplier *= 10;
    }
    return multiplier;
  } else {
    return 1;
  }
}

function getCommonMultiplier(number1, number2) {
  let common;
  let num1DecimalMultiplier = decimalMultiplier(number1);
  let num2DecimalMultiplier = decimalMultiplier(number2);

  if (num1DecimalMultiplier >= num2DecimalMultiplier) {
    common = num1DecimalMultiplier;
  } else {
    common = num2DecimalMultiplier;
  }
  return common;
}

function dealWithLongNumbers(possiblyLongNumber, thisIsMemoryNum = false) {
  possiblyLongNumber = possiblyLongNumber.toString();
  let savedSign = 1;
  let haveDecimal = 0;
  if (possiblyLongNumber.charAt(0) === "-") {
    possiblyLongNumber = possiblyLongNumber.slice(1);
    savedSign = -1;
  }
  let decimalIndex = possiblyLongNumber.indexOf(".");
  if (decimalIndex !== -1) {
    haveDecimal = 1;
  }
  let numberOfDigits = possiblyLongNumber.length - haveDecimal;

  if (numberOfDigits > 8 && decimalIndex !== -1 && decimalIndex < 9) {
    //possiblyLongNumber = possiblyLongNumber.slice(0, 8 + haveDecimal);
    //possiblyLongNumber = Number(possiblyLongNumber).toPrecision(8);
    possiblyLongNumber = roundDecimalToEightDigits(Number(possiblyLongNumber));
    console.log(
      "Number did not fit to 8 digits and is rounded.",
      possiblyLongNumber
    );
  } else if (
    (numberOfDigits > 8 && decimalIndex === -1) ||
    (decimalIndex > 7 && numberOfDigits > 8)
  ) {
    possiblyLongNumber = possiblyLongNumber.slice(0, 8 + haveDecimal);
    if (thisIsMemoryNum) {
      memoryError = "Number is too long for display.";
      infoE.textContent = "E";
      miniDisp.textContent = memoryError;
    } else {
      error = "Number is too long for display.";
      infoE.textContent = "E";
      miniDisp.textContent = error;
    }
  }
  possiblyLongNumber = Number(possiblyLongNumber) * savedSign;
  return possiblyLongNumber;
}

function roundDecimalToEightDigits(num) {
  let numStr = num.toString();
  console.log(numStr);
  let result;
  let regex = /^0\.0*/;
  let nonsignificantPart = numStr.match(regex);

  if (nonsignificantPart) {
    nonsignificantPart = nonsignificantPart[0];
    console.log(nonsignificantPart);
    let significantPart = numStr.replace(nonsignificantPart, "0.");
    console.log(significantPart);
    significantPart = Number(significantPart).toPrecision(
      8 - nonsignificantPart.length + 1
    );
    result = significantPart.toString().replace("0.", nonsignificantPart);
  } else {
    result = num.toPrecision(8);
  }
  /*
    if (nonsignificantPart) {
        result = num.toPrecision(7 - nonsignificantPart.length)
    } else {
        result = num.toPrecision(8);
    }
    */
  return result;
}
/////// Helpers  UP////////

//////////////////////////////// Operations functions DOWN ////////////////////////////

function clear() {
  error = "";
  numberStrOnDisplay = "0";
  num1 = null;
  num2 = null;
  result = null;
  calcOperation = null;
  lastEntry = "";
  infoE.textContent = "";
  miniDisp.textContent = "MR: " + memoryNum.toString();
  disp.textContent = 0;
  infoE.textContent = "";
}

function clearMemory() {
  if (!error) {
    memoryError = "";
    if (!memoryError) {
      infoE.textContent = "";
      memoryError = "";
    }
    infoM.textContent = "";
    memoryNum = 0;
    miniDisp.textContent = "MR: " + memoryNum.toString();
  }
}

function clearAll() {
  workingButton = null;
  error = "";
  numberStrOnDisplay = "0";
  num1 = null;
  num2 = null;
  result = null;
  calcOperation = null;
  lastEntry = "";
  infoE.textContent = "";
  disp.textContent = 0;
  infoE.textContent = "";
  infoM.textContent = "";
  memoryError = "";
  memoryNum = 0;
  miniDisp.textContent = "MR: " + memoryNum.toString();
}

function toggleHelpMode() {
  if (!isHelpMode) {
    this.showDescription();
    this.elem.style.color = "orange";
    this.elem.textContent = "X";
    disp.classList.add("info");
    miniDisp.classList.add("info");
    disp.textContent = this._description;
    miniDisp.textContent = "Keyboard: " + this._keyCode;
    isHelpMode = true;
  } else {
    this.elem.style.color = "#cde7b0";
    this.elem.textContent = "Help";
    disp.classList.remove("info");
    miniDisp.classList.remove("info");

    disp.textContent = numberStrOnDisplay;
    miniDisp.textContent = "MR: " + memoryNum.toString();
    isHelpMode = false;
  }
}

function recallMemory() {
  disp.textContent = memoryNum.toString();
  numberStrOnDisplay = disp.textContent;
  lastEntry = "write";
}

function saveToMemory() {
  memoryNum = Number(disp.textContent);
  infoM.textContent = "M";
  miniDisp.textContent = "MR: " + memoryNum.toString();
}

function minusFromMemory() {
  memoryNum = dealWithLongNumbers(memoryNum - Number(disp.textContent), true);
  if (memoryError) {
    return;
  }
  infoM.textContent = "M";
  miniDisp.textContent = "MR: " + memoryNum.toString();
}

function addToMemory() {
  memoryNum = dealWithLongNumbers(memoryNum + Number(disp.textContent), true);
  if (memoryError) {
    return;
  }
  infoM.textContent = "M";
  miniDisp.textContent = "MR: " + memoryNum.toString();
}

function deleteLastEntry() {
  if (lastEntry === "sign" && numberStrOnDisplay.indexOf("-") !== -1) {
    numberStrOnDisplay = (Number(numberStrOnDisplay) * -1).toString();
    disp.textContent = numberStrOnDisplay;
    lastEntry = "write";
  } else if (numberStrOnDisplay !== "0" && lastEntry === "write") {
    numberStrOnDisplay = numberStrOnDisplay.split("");
    numberStrOnDisplay.pop();
    numberStrOnDisplay = numberStrOnDisplay.join("");
    if (numberStrOnDisplay === "" || numberStrOnDisplay === "-") {
      numberStrOnDisplay = "0";
    }
    disp.textContent = numberStrOnDisplay;
  } else {
    this.impossibleStyle(this.elem);
  }
}

function changeSign() {
  if (numberStrOnDisplay !== "0" && lastEntry !== "prep") {
    numberStrOnDisplay = Number(numberStrOnDisplay) * -1;
    numberStrOnDisplay = numberStrOnDisplay.toString();
    disp.textContent = numberStrOnDisplay;
    lastEntry = "sign";
  } else if (num1 && lastEntry !== "prep") {
    num1 *= -1;
    disp.textContent = num1.toString();
  } else {
    this.impossibleStyle(this.elem);
  }
}

function percentageOfNumber1() {
  if (num1 && numberStrOnDisplay && lastEntry === "write") {
    numberStrOnDisplay = divide(multiply(Number(disp.textContent), num1), 100);
    if (error) {
      return;
    }
    disp.textContent = numberStrOnDisplay;
    lastEntry = "write";
  } else {
    this.impossibleStyle(this.elem);
  }
}

function squareRoot() {
  if (disp.textContent.indexOf("-") !== -1) {
    error = true;
    infoE.textContent = "E";
    miniDisp.textContent = "Error - negative number can't have square root";
    return;
  } else {
    numberStrOnDisplay = dealWithLongNumbers(Math.sqrt(disp.textContent));
    if (error) {
      return;
    }
    disp.textContent = numberStrOnDisplay;
    lastEntry = "write";
  }
}

function writeNumber() {
  if (lastEntry === "calc") {
    clear();
  }
  let numberOfDigits = numberStrOnDisplay
    .replace("-", "")
    .replace(".", "").length;
  if (numberOfDigits >= 8) {
    this.impossibleStyle(this.elem);
    return;
  }
  if (numberStrOnDisplay === "0") {
    numberStrOnDisplay = "";
  }
  numberStrOnDisplay += this._numberStr;

  lastEntry = "write";
  disp.textContent = numberStrOnDisplay;
}

function writeDecimalPoint() {
  let numberOfDigits = numberStrOnDisplay
    .replace("-", "")
    .replace(".", "").length;
  if (numberOfDigits >= 7 || numberStrOnDisplay.indexOf(".") !== -1) {
    this.impossibleStyle(this.elem);
    return;
  }
  if (numberStrOnDisplay === "0") {
    numberStrOnDisplay = "0.";
  } else {
    numberStrOnDisplay += ".";
  }
  lastEntry = "write";
  disp.textContent = numberStrOnDisplay;
}

function prepCalculation() {
  if (lastEntry !== "prep") {
    if (num1 !== null && calculation && justGotResult === false) {
      //setNumbers();
      calcAndShowResult();
    } else {
      setNumbers();
    }
  }

  calculation = calculations[activeBtn._dataset.calcFunction];
  justGotResult = false;
  lastEntry = "prep";
}

function setNumbers() {
  if (num1 === null) {
    num1 = Number(numberStrOnDisplay);
    numberStrOnDisplay = "0"; //lets enter second number
  } else if (num2 === null || lastEntry === "write" || lastEntry === "sign") {
    num2 = Number(numberStrOnDisplay);
    numberStrOnDisplay = "0"; //lets enter second number
  }
}

function calcAndShowResult() {
  if (num1 !== null && calculation && num2 === null && lastEntry === "prep") {
    num2 = num1; // lets operate by entering only one operand;
  } else {
    setNumbers();
  }
  if (calculation && num1 !== null) {
    result = calculation(num1, num2);
    numberStrOnDisplay = result.toString();
    disp.textContent = numberStrOnDisplay;
    numberStrOnDisplay = "0";
    num1 = result;
    result = null;
    justGotResult = true;
    lastEntry = "calc";
  }
}
