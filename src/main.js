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
let activeBtn = false;
let workingButton = null;
let error = '';
//let errorMsg = "";

let numberStrOnDisplay = "0";
let num1 = null;
let num2 = null;
let calculation = null;
let result = null;
//  let justGotResult = false;

let justGotResult = false;
let lastEntry = "";
let memoryNum = 0;
let memoryError = '';
//let memoryErrorMsg = "";
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

let Button = function(element) {
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
        setTimeout(function() {
            btn.style.color = "#cde7b0";
        }, 300);
    };
    this.act = function act() {
        //      clickSound.play();
        if (isHelpMode && this.id !== "help") {
            this.showDescription();
        } else {
            if (!error && !memoryError || this.id === 'clear' || this.id === 'ac' || this.id === 'mc') {
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

//console.log(buttons);

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", activateBtn, false);
}
document.addEventListener("keydown", activateBtnWithKeyb, false);
document.addEventListener("keyup", removeActiveClassWithKeyb, false);

function activateBtn(evt) {
    evt.preventDefault();
    activeBtn = buttons[evt.target.id];
    //console.log("Acive button: ", activeBtn);
    activeBtn.act();
}
let keyDown = false;

function activateBtnWithKeyb(evt) {
    if (!keyDown) {
        console.log(evt.code);
        if (evt.code !== "Tab" && evt.code !== "Enter") {
            evt.preventDefault();
            activeBtn = Object.values(buttons).find(
                (button) => button._keyCode === evt.code
            );

            console.log("Acive button: ", activeBtn);
            activeBtn.act();
            activeBtn.elem.classList.add("bt-active");

            /*        setTimeout(function() {
                        activeBtn.elem.classList.remove("bt-active");
                    }, 100);
                    */
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
    return dealWithLongNumbers(
        (num1 * commonMultiplyer(num1, num2) + num2 * commonMultiplyer(num1, num2)) /
        commonMultiplyer(num1, num2)
    );
}

function substract(num1, num2) {
    return dealWithLongNumbers(
        (num1 * commonMultiplyer(num1, num2) - num2 * commonMultiplyer(num1, num2)) /
        commonMultiplyer(num1, num2)
    );
}

function multiply(num1, num2) {
    return dealWithLongNumbers((Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', ''))) / (decimalMultiplyer(num1) * decimalMultiplyer(num2)));
}

function divide(num1, num2) {
    if (num2 === 0) {
        error = "Division by 0 is impossible.";
        infoE.textContent = "E";
        miniDisp.textContent = error;
        return "Undefined";
    }
    return dealWithLongNumbers((Number(num1.toString().replace('.', '')) / Number(num2.toString().replace('.', ''))) * (decimalMultiplyer(num2) / decimalMultiplyer(num1)));
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

function dealWithLongNumbers(possiblyLongNumber, thisIsMemoryNum = false) {

    possiblyLongNumber = possiblyLongNumber.toString();
    let savedSign = 1;
    let haveDecimal = 0;
    if (possiblyLongNumber.charAt(0) === '-') {
        possiblyLongNumber = possiblyLongNumber.slice(1, );
        savedSign = -1;
    }
    let decimalIndex = possiblyLongNumber.indexOf(".");
    if (decimalIndex !== -1) {
        haveDecimal = 1;
    }
    let numberOfDigits = possiblyLongNumber.length - haveDecimal;
    //let notDigitsCount = possiblyLongNumber.length - numberOfDigits;

    if (numberOfDigits > 8 && decimalIndex !== -1 && decimalIndex < 9) {
        possiblyLongNumber = possiblyLongNumber.slice(0, 8 + haveDecimal);
        console.log("Number is cut at 8 digits.");

    } else if ((numberOfDigits > 8 && decimalIndex === -1) || (decimalIndex > 7 && numberOfDigits > 8)) {
        possiblyLongNumber = possiblyLongNumber.slice(0, 8 + haveDecimal);
        if (thisIsMemoryNum) {
            memoryError = 'Number is too long for display.';
            infoE.textContent = "E";
            miniDisp.textContent = memoryError;

        } else {

            error = 'Number is too long for display.';
            infoE.textContent = "E";
            miniDisp.textContent = error;
        }
    }
    possiblyLongNumber = Number(possiblyLongNumber) * savedSign;
    return possiblyLongNumber;
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
    if (!error) {
        memoryError = "";
        // error = false;
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
        // infoE.textContent = '';
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
    lastEntry = 'write';
}

function saveToMemory() {
    memoryNum = Number(disp.textContent);
    infoM.textContent = "M";
    miniDisp.textContent = "MR: " + memoryNum.toString();
}

function minusFromMemory() {
    memoryNum = dealWithLongNumbers(memoryNum - Number(disp.textContent), true);
    if (memoryError) {
        return
    }
    infoM.textContent = "M";
    miniDisp.textContent = "MR: " + memoryNum.toString();

}

function addToMemory() {
    memoryNum = dealWithLongNumbers(memoryNum + Number(disp.textContent), true);
    if (memoryError) {
        return
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
    console.log("changingSig", result, numberStrOnDisplay);
    if (numberStrOnDisplay !== "0" && lastEntry !== "prep") {
        numberStrOnDisplay = Number(numberStrOnDisplay) * -1;
        console.log(numberStrOnDisplay);
        //  numberStrOnDisplay = dealWithLongNumbers(numberStrOnDisplay);
        numberStrOnDisplay = numberStrOnDisplay.toString();
        disp.textContent = numberStrOnDisplay;
        lastEntry = "sign";
    } else if (num1 && lastEntry !== "prep") {
        num1 *= -1;
        disp.textContent = num1.toString();
        //num1 = dealWithLongNumbers(result);
    } else {
        this.impossibleStyle(this.elem);
    }
    //lastEntry = 'write';
}

function percentageOfNumber1() {
    if (num1 && numberStrOnDisplay && lastEntry === 'write') {
        numberStrOnDisplay = divide((multiply(Number(disp.textContent), num1)), 100);
        if (error) {
            return
        }
        disp.textContent = numberStrOnDisplay;
        lastEntry = 'write';
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
            return
        }
        disp.textContent = numberStrOnDisplay;
        lastEntry = 'write';
    };
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

////////Helper functions

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";

    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    };
    this.stop = function() {
        this.sound.pause();
    };
}
//}