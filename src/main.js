/*
percent explanation
90 [+] 10 [%] = 99  calculates as: 90 + (10% of 90) = 99
90 [-] 10 [%] = 81  calculates as: 90 - (10% of 90) = 81
90 [x] 10 [%] = 810 calculates as: 90 x (10% of 90) = 810
90 [/] 10 [%] = 10  calculates as: 90 / (10% of 90) = 10
10 [%] = 0          calculates as: calculator does not process

For the [+], [-], [x], [/] operators, the calculator sees the 10 [%] as 10% of 90 which is equal to 9. 

*/

//document.onload = Calculator();

//function Calculator() {
let calc = document.getElementById("calculator-id");
let disp = document.getElementById("main-display-id");
let miniDisp = document.getElementById("mini-display-id");
let infoM = document.getElementById("info-M-id");
let infoE = document.getElementById("info-E-id");
console.log(infoE);
let btns = document.getElementsByClassName("bt");
// const clickSound = new sound("click.wav");
let buttons = {};
let activeBtn;
let workingButton = null;
let error = false;
let errorMsg = "";

let numberStrOnDisplay = "0";
let num1 = null;
let num2 = null;
let calculation = null;
let result = null;
//  let justGotResult = false;

let justGotResult = false;
let lastEntry = "";
let memoryNum = 0;
let memoryError = false;
let memoryErrorMsg = "";
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
  substract: substract,
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
  this.operation = operations[this._dataset.operation];

  this.showDescription = function showDescription() {
    //was info
    console.log("showing description");
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
    //      clickSound.play();
    if (isHelpMode && this.id !== "help") {
      this.showDescription();
    } else {
      this.operation();
    }
  };
};

function makeButtons() {
  for (let i = 0; i < btns.length; i++) {
    buttons[btns[i].id] = new Button(btns[i]);
  }
}
makeButtons();

//console.log(buttons);

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", activateBtn, false);
}
document.addEventListener("keydown", activateBtnWithKeyb, false);

function activateBtn(evt) {
  evt.preventDefault();
  activeBtn = buttons[evt.target.id];
  //console.log("Acive button: ", activeBtn);
  activeBtn.act();
}
function activateBtnWithKeyb(evt) {
  console.log(evt.code);
  if (evt.code !== "Tab" && evt.code !== "Enter") {
    evt.preventDefault();
    activeBtn = Object.values(buttons).find(
      (button) => button._keyCode === evt.code
    );

    // console.log("Acive button: ", activeBtn);
    activeBtn.act();
    activeBtn.elem.classList.add("bt-active");

    setTimeout(function () {
      activeBtn.elem.classList.remove("bt-active");
    }, 100);
  }
}

//////////////////////////////// Calculations functions DOWN ////////////////////////////
function add(num1, num2) {
  //  return dealWithBigNumbers(num1 + num2);
  return dealWithBigNumbers(
    (num1 * commonMultiplyer(num1, num2) + num2 * commonMultiplyer(num1, num2)) /
      commonMultiplyer(num1, num2)
  );
}

function substract(num1, num2) {
  return dealWithBigNumbers(
    (num1 * commonMultiplyer(num1, num2) - num2 * commonMultiplyer(num1, num2)) /
      commonMultiplyer(num1, num2)
  );
}

function multiply(num1, num2) {
//  return dealWithBigNumbers(num1 * num2);

  //return dealWithBigNumbers(
 // return dealWithBigNumbers((decimalMultiplyer(num1) * decimalMultiplyer(num2)) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
 //return decimalMultiplyer(num2);
 //return num2 * decimalMultiplyer(num2);
 // return dealWithBigNumbers(((num1 * decimalMultiplyer(num1)) * (num2 * decimalMultiplyer(num2)))) / (decimalMultiplyer(num1) * decimalMultiplyer(num2));
 //return (num1 * decimalMultiplyer(num1) * (num2 * decimalMultiplyer(num2)));
 // return dealWithBigNumbers((num1.toString().replace() * decimalMultiplyer(num1) * (num2 * decimalMultiplyer(num2))) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
  return dealWithBigNumbers((Number(num1.toString().replace('.','')) * Number(num2.toString().replace('.',''))) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
  //return dealWithBigNumbers((num1 * decimalMultiplyer(num1) * (num2 * decimalMultiplyer(num2))) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
}

function divide(num1, num2) {
  if (num2 === 0) {
    errorMsg = "Division by 0 is impossible.";
    error = true;
    return "Undefined";
  }
  return dealWithBigNumbers((Number(num1.toString().replace('.','')) / Number(num2.toString().replace('.',''))) * (decimalMultiplyer(num2) / decimalMultiplyer(num1)));
// return dealWithBigNumbers(num1 / num2);
// return dealWithBigNumbers((num1 * decimalMultiplyer(num1) / (num2 * decimalMultiplyer(num2))) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
//  return dealWithBigNumbers((num1 * decimalMultiplyer(num1)) / (num2 * decimalMultiplyer(num2)) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
}
function decimalMultiplyer(num) {
  let numberString = num.toString();
  let decimalIndex = numberString.indexOf(".");
  let multiplyer;
  let decimal;
  //if (decimalIndex >= 0) {
  if (decimalIndex !== -1) {
    decimal = numberString.length - decimalIndex - 1;
    multiplyer = 1;
    for (let i = 1; i <= decimal; i++) {
      multiplyer *= 10;
    }
    return multiplyer;
  } else {
    return 1;
  }
}

function commonMultiplyer(number1, number2) {
  let common;
  if (decimalMultiplyer(number1) >= decimalMultiplyer(number2)) {
    common = decimalMultiplyer(number1);
  } else {
    common = decimalMultiplyer(number2);
  }
  return common;
}

 function dealWithBigNumbers(possiblyBigNumber) {
//   let reg = /\.9999/;
//   if (reg.test(possiblyBigNumber) === true) {
//     possiblyBigNumber = Number(possiblyBigNumber);
//     possiblyBigNumber = Math.round(possiblyBigNumber);
//     warning = true;
//     warningMsg = 'Acuracy warning: number is rounded';
//     //       console.log("acuracy warning: number is rounded");
//   }
  possiblyBigNumber = possiblyBigNumber.toString();
  let savedSign = 1;
  if(possiblyBigNumber.charAt(0) === '-') {
    possiblyBigNumber = possiblyBigNumber.slice(1,);
    savedSign = -1;
  }
  let decimalIndex = possiblyBigNumber.indexOf(".");
  let numberOfDigits = possiblyBigNumber.replace(".", "").length;
 // let numberOfDigits = possiblyBigNumber.replace("-", "").replace(".", "").length;
  let notDigitsCount = possiblyBigNumber.length - numberOfDigits;
  
  if (decimalIndex !== -1) {

    //possiblyBigNumber = Number(possiblyBigNumber).toPrecision(8).toString();
  }

  if (numberOfDigits > 8 && decimalIndex !== -1) {
    possiblyBigNumber = possiblyBigNumber.slice(0, 8 + notDigitsCount);

    // return [possiblyBigNumber, "acuracy warning: number is cut at 8 digits."];
    //return possiblyBigNumber;
  }else if (decimalIndex !== -1) {
    possiblyBigNumber = Number(possiblyBigNumber).toPrecision(8).toString();

  }else if ((numberOfDigits > 8 && decimalIndex === -1) || decimalIndex > 9) {
    possiblyBigNumber = possiblyBigNumber.slice(0, 8 + notDigitsCount);
    error = true;
    errorMsg = 'Number too large for display';
  }
   possiblyBigNumber = Number(possiblyBigNumber) * savedSign;
  return possiblyBigNumber;
}

//////////////////////////////// Operations functions DOWN ////////////////////////////

function clear() {
  // workingButton = null;
  error = "";
  numberStrOnDisplay = "0";
  num1 = null;
  num2 = null;
  result = null;
  calcOperation = null;
  //justGotResult = false;
  //emptyResult = false;
  lastEntry = "";
  infoE.textContent = "";
  miniDisp.textContent = "MR: " + memoryNum.toString();
  disp.textContent = 0;
  infoE.textContent = "";
  //infoM.textContent = '';
}
function clearMemory() {
  memoryError = "";
  // error = false;
  infoE.textContent = "";
  infoM.textContent = "";
  memoryNum = 0;
  miniDisp.textContent = "MR: " + memoryNum.toString();
}
function clearAll() {
  workingButton = null;
  error = "";
  numberStrOnDisplay = "0";
  num1 = null;
  num2 = null;
  result = null;
  calcOperation = null;
  //  justGotResult = false;
  // emptyResult = false;
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
  numberStrOnDisplay = memoryNum.toString();
  disp.textContent = numberStrOnDisplay;
}

function saveToMemory() {
  memoryNum = Number(numberStrOnDisplay);
  infoM.textContent = "M";
  miniDisp.textContent = "MR: " + numberStrOnDisplay;
}
function minusFromMemory() {
  if (numberStrOnDisplay) {
    memoryNum -= Number(numberStrOnDisplay);
  } else if (result !== null) {
    memoryNum -= result;
  } else if (num1 !== null) {
    memoryNum -= num1;
  }
  infoM.textContent = "M";
  // memoryNum = dealWithBigNumbers(memoryNum);
  if (memoryError === true) {
    return;
  }
  miniDisp.textContent = "MR: " + memoryNum.toString();
}

function addToMemory() {
  memoryNum += Number(numberStrOnDisplay);
  infoM.textContent = "M";
  // memoryNum = dealWithBigNumbers(memoryNum);
  if (memoryError) {
    return;
  }
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
  console.log("changingSig", result, numberStrOnDisplay);
  if (numberStrOnDisplay !== "0" && lastEntry !== "prep") {
    numberStrOnDisplay = Number(numberStrOnDisplay) * -1;
    console.log(numberStrOnDisplay);
    //  numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
    numberStrOnDisplay = numberStrOnDisplay.toString();
    disp.textContent = numberStrOnDisplay;
    lastEntry = "sign";
  } else if (num1 && lastEntry !== "prep") {
    num1 *= -1;
    disp.textContent = num1.toString();
    //num1 = dealWithBigNumbers(result);
  } else {
    this.impossibleStyle(this.elem);
  }
  //lastEntry = 'write';
}

function percentageOfNumber1() {
  let percent;
  if (calcFunction && numberStrOnDisplay) {
    numberStrOnDisplay = Number(numberStrOnDisplay);
    numberStrOnDisplay =
      (num1 *
        decimalMultiplyer(num1) *
        (numberStrOnDisplay * decimalMultiplyer(numberStrOnDisplay))) /
      (decimalMultiplyer(num1) * decimalMultiplyer(numberStrOnDisplay)) /
      100;
    numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
    numberStrOnDisplay = numberStrOnDisplay.toString();
    // disp.textContent = str;
  } else {
    notPossibleStyle(this.elem);
  }
}

function squareRoot() {
  if (numberStrOnDisplay) {
    if (numberStrOnDisplay.indexOf("-") !== -1) {
      numberStrOnDisplay = numberStrOnDisplay.slice(
        1,
        numberStrOnDisplay.length
      );
      error = true;
      infoE.textContent = "E";
      miniDisp.textContent = "Error - negative number can't have square root";
      return;
    }
    numberStrOnDisplay = Number(numberStrOnDisplay);
    numberStrOnDisplay = Math.sqrt(numberStrOnDisplay);
    console.log(numberStrOnDisplay);
    numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
    numberStrOnDisplay = numberStrOnDisplay.toString();
  } else if (result !== null) {
    if (result.toString().indexOf("-") !== -1) {
      result = result.toString().slice(1, result.toString().length);
      result = Number(result);
      error = true;
      infoE.textContent = "E";
      miniDisp.textContent = "Error - negative number can't have square root";
      return;
    }
    result = Math.sqrt(result);
    result = dealWithBigNumbers(result);
  } else if (operation && !numberStrOnDisplay) {
    if (num1.toString().indexOf("-") !== -1) {
      num1 = num1.toString().slice(1, result.toString().length);
      num1 = Number(num1);
      error = true;
      infoE.textContent = "E";
      miniDisp.textContent = "Error - negative number can't have square root";
      return;
    }
    num1 = Math.sqrt(num1);
    num1 = dealWithBigNumbers(num1);
  }
  emptyResult = true;
}
function writeNumber() {
  if (lastEntry === "calc") {
    clear();
  }
  let numberOfDigits = numberStrOnDisplay.replace("-", "").replace(".", "")
    .length;
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
  let numberOfDigits = numberStrOnDisplay.replace("-", "").replace(".", "")
    .length;
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
  console.log("exiting prep");
  console.log("num1: ", num1);
  console.log("num2: ", num2);
  console.log("result: ", result);
  console.log("numberStrOnDisplay: ", numberStrOnDisplay);

  //console.log("calculation operation: ", calculation);
}
function setNumbers() {
  if (num1 === null) {
    num1 = Number(numberStrOnDisplay);
    numberStrOnDisplay = "0"; //lets enter second number
  } else if (num2 === null || lastEntry === "write" || lastEntry === "sign") {
    num2 = Number(numberStrOnDisplay);
    numberStrOnDisplay = "0"; //lets enter second number
  }
  console.log("exiting setNumbers");
  console.log("num1: ", num1);
  console.log("num2: ", num2);
  console.log("result: ", result);
  console.log("numberStrOnDisplay: ", numberStrOnDisplay);
  // console.log("calculation operation: ", calculation);
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
    //num2 = null;
    justGotResult = true;
    lastEntry = "calc";
  }
  console.log("exiting result Calc");
  console.log("num1: ", num1);
  console.log("num2: ", num2);
  console.log("result: ", result);
  console.log("numberStrOnDisplay: ", numberStrOnDisplay);
  //console.log("calculation operation: ", calculation);
}
/* 
 
 
               function showResult() {
                   if (operation) {
                       if (num1 !== null && operation && result === null) {
                           if (!numberStrOnDisplay) {
                               num2 = num1;
                           } else {
                               num2 = Number(numberStrOnDisplay);
                               numberStrOnDisplay = '';
                           }
                       } else if (result !== null) {
                           num1 = result;
                           if (numberStrOnDisplay) {
                               num2 = Number(numberStrOnDisplay);
                               numberStrOnDisplay = '';
                           }
                       }
                       operation();
                       if (error === true) {
                           return;
                       }
                       result = dealWithBigNumbers(result);
                       justGotResult = true;
                       emptyResult = false;
                   } else {
                       emptyResult = true;
                       console.log(emptyResult);
                   }
               }
 
               function startOperation() {
                   emptyResult = false;
                   if (num1 === null && result === null) {
                       if (numberStrOnDisplay) {
                           num1 = Number(numberStrOnDisplay);
                           numberStrOnDisplay = '';
                       } else {
                           num1 = 0;
                       }
                       justGotResult = false;
                   } else if (num1 !== null && numberStrOnDisplay && result === null) {
                       num2 = Number(numberStrOnDisplay);
                       numberStrOnDisplay = '';
                       operation();
                       num1 = result;;
                       result = null;
                       num1 = dealWithBigNumbers(num1);
                       justGotResult = false;
                   } else if (result !== null && num1 !== null && justGotResult === false) {
                       if (numberStrOnDisplay) {
                           num1 = result;
                           result = null;
                           num2 = Number(numberStrOnDisplay);
                           numberStrOnDisplay = '';
                       } else {
                           num2 = num1;
                       }
                       operation(num1, num2);
                       if (error === true) {
                           return;
                       }
                       result = dealWithBigNumbers(result);
                       justGotResult = true;
                   } else if (result !== null) {
                       num1 = result;
                       result = null;
                       num2 = null;
                       justGotResult = false;
                   }
                   operation = this.oper;
               }
 
               function addition() {
                   console.log('adding', num1, num2);
                   result = ((num1 * commonMultiplyer(num1, num2)) + (num2 * commonMultiplyer(num1, num2))) / commonMultiplyer(num1, num2);
               }
 
               function substraction() {
                   console.log('minusing', num1, num2);
                   result = ((num1 * commonMultiplyer(num1, num2)) - (num2 * commonMultiplyer(num1, num2))) / commonMultiplyer(num1, num2);
               }
 
               function multiplication() {
                   console.log('multiplicating', num1, num2);
                   result = ((num1 * decimalMultiplyer(num1)) * (num2 * decimalMultiplyer(num2))) /
                       (decimalMultiplyer(num1) * decimalMultiplyer(num2));
               }
 
               function division() {
                   console.log('dividing', num1, num2);
                   result = num1 / num2;
                   //result = ((num1 * decimalMultiplyer(num1)) / (num2 * decimalMultiplyer(num2))) /
                      //      (decimalMultiplyer(num1) * decimalMultiplyer(num2));
       if (num2 === 0) {
           error = true;
           infoE.textContent = 'E';
           miniDisp.textContent = 'Error - division by 0 is not possible.';
           disp.textContent = 'Undefined';
           return;
       }
   }
 
 
   function decimalMultiplyer(num) {
       let numberString = num.toString();
       let decimalIndex = numberString.indexOf('.');
       let multiplyer;
       let decimal;
       if (decimalIndex >= 0) {
           decimal = numberString.length - decimalIndex - 1;
           multiplyer = 1;
           for (let i = 1; i <= decimal; i++) {
               multiplyer *= 10;
           }
           return multiplyer;
       } else {
           return 1;
       }
   }
 
   function commonMultiplyer(number1, number2) {
       let common;
       if (decimalMultiplyer(number1) >= decimalMultiplyer(number2)) {
           common = decimalMultiplyer(number1);
       } else {
           common = decimalMultiplyer(number2);
       }
       return common;
   }
 
   function dealWithBigNumbers(possiblyBigNumber) {
       let reg = /\.9999/;
       let stringFromNumber = possiblyBigNumber.toString();
       let decimalIndex = stringFromNumber.indexOf('.');
       let numberOfDigits = stringFromNumber.replace('-', '').replace('.', '').length;
       let notDigitsCount = stringFromNumber.length - numberOfDigits;
       if (reg.test(stringFromNumber) === true) {
           stringFromNumber = Number(stringFromNumber);
           stringFromNumber = Math.round(stringFromNumber).toString();
           console.log('acuracy warning: number is rounded');
       }
       if (numberOfDigits > 8 && decimalIndex !== -1) {
           stringFromNumber = stringFromNumber.slice(0, 8 + notDigitsCount);
           console.log('acuracy warning: number is cut at 8 digits');
       } else if (numberOfDigits > 8 && decimalIndex === -1 || decimalIndex > 9) {
           console.log('number is too large for this calculator, number is', stringFromNumber);
           stringFromNumber = stringFromNumber.slice(0, 8 + notDigitsCount);
           error = true;
       }
       if (error === true) {
           if (workingButton.elem !== buttons.mplus.elem &&
               workingButton.elem !== buttons.mminus.elem) {
               miniDisp.textContent = 'Error - number too large.';
               disp.textContent = stringFromNumber;
           } else if (workingButton.elem === buttons.mplus.elem ||
               workingButton.elem === buttons.mminus.elem) {
               miniDisp.textContent = 'MR: ' + stringFromNumber + '\; Error - number in memory is too large.';
               memoryError = true;
           }
           infoE.textContent = 'E';
       } else if (workingButton.elem !== buttons.mplus.elem &&
           workingButton.elem !== buttons.mminus.elem) {
           disp.textContent = stringFromNumber;
       }
       possiblyBigNumber = Number(stringFromNumber);
       return possiblyBigNumber;
   }
 
   function startInfo() {
       this.elem.style.color = 'orange';
       this.elem.textContent = 'X'
       disp.classList.add('info');
       miniDisp.classList.add('info');
       disp.textContent = 'Press buttons to display information about them.';
       miniDisp.textContent = 'Keyboard: ' + this.keyCode;
   }
 
   function cancelInfo() {
       this.elem.style.color = '#cde7b0';
       this.elem.textContent = 'Help'
       disp.classList.remove('info');
       miniDisp.classList.remove('info');
       disp.textContent = 0;
       miniDisp.textContent = 'MR: ' + memoryNum.toString();
 
   }
 
   function dispInfo() {
       miniDisp.textContent = 'Keyboard: ' + this.keyCode;
       disp.textContent = this.description;
   }
   */
////////Helper functions

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";

  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
//}
