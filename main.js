/*
percent explanation
90 [+] 10 [%] = 99  calculates as: 90 + (10% of 90) = 99
90 [-] 10 [%] = 81  calculates as: 90 - (10% of 90) = 81
90 [x] 10 [%] = 810 calculates as: 90 x (10% of 90) = 810
90 [/] 10 [%] = 10  calculates as: 90 / (10% of 90) = 10
10 [%] = 0          calculates as: calculator does not process

For the [+], [-], [x], [/] operators, the calculator sees the 10 [%] as 10% of 90 which is equal to 9. 

*/

const calculator = (function() {

    const calc = document.getElementById('calculator-id');
    const disp = document.getElementById('main-display-id');
    const miniDisp = document.getElementById('mini-display-id');
    const infoM = document.getElementById('info-M-id');
    const infoE = document.getElementById('info-E-id');
    const buttons = document.getElementsByClassName('bt');
    let buttonsIdsAndKeyCodes = getButtonsIdsAndKeyCodes(); // needed for button activation with keyboard
    // let buttons = {};
    let activeBtn;
    let workingButton = null;
    let error = false;
    // now numerStrOnDisplay let str = '';
    let numberStrOnDisplay = '';
    let num1 = null;
    let num2 = null;
    let result = null;
    let operation = null;

    let justGotResult = false;
    let lastEntry = '';
    let memoryNum = 0;
    let memoryError = false;
    let emptyResult = false;
    let isHelpMode = false;


    infoE.textContent = '';
    infoM.textContent = '';
    miniDisp.textContent = 'MR: ' + memoryNum.toString();
    disp.textContent = 0;

    class Button {
        constructor(id) {
            this.id = id;
            this.elem = document.getElementById(id);
            this._numberStr = this.elem.innerText;
            this._dataset = this.elem.dataset;
            this._keyCode = this._dataset.keyCode;
            this._description = this._dataset.description;
            this.operation = operations[this._dataset.operation];
            this.showDescription = function showDescription() { //was info
                miniDisp.textContent = 'Keyboard: ' + this._keyCode;
                disp.textContent = this._description;
            }
            this.impossibleStyle = function impossibleStyle(btn) {
                btn.style.color = 'red';
                setTimeout(function() { btn.style.color = '#cde7b0'; }, 300);
            }
            if (!isHelpMode || this.id === 'help') {
                this.operation();
            } else {
                this.showDescription();
            }
        }
    }

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', activateBtn, false);

    }
    document.addEventListener('keydown', activateBtnWithKeyb, false);

    function activateBtn(evt) {
        activeBtn = new Button(evt.target.id);
        console.log(activeBtn);
    }

    function activateBtnWithKeyb(evt) {
        console.log(evt.type, evt.code);
        if (evt.code !== 'Tab' && evt.code !== 'Enter') {
            evt.preventDefault();
            for (let i = 0; i < buttonsIdsAndKeyCodes.length; i++) {
                if (evt.code === buttonsIdsAndKeyCodes[i].keyCode) {
                    activeBtn = new Button(buttonsIdsAndKeyCodes[i].id);
                    console.log(activeBtn);
                    return;
                }
            }
        }
    }
    /*
        //DOWN// adds buttons properties
        for (let i = 0; i < buttonsIdsAndKeyCodes.length; i++) {
            buttons[buttonsIdsAndKeyCodes[i][0]] = {};
            buttons[buttonsIdsAndKeyCodes[i][0]].elem = document.getElementById(buttonsIdsAndKeyCodes[i][0]);
            buttons[buttonsIdsAndKeyCodes[i][0]].info = dispInfo;
            buttons[buttonsIdsAndKeyCodes[i][0]].keyCode = buttonsIdsAndKeyCodes[i][1];
            buttons[buttonsIdsAndKeyCodes[i][0]].description = buttonsIdsAndKeyCodes[i][2];
            if (i < 10) {
                buttons[buttonsIdsAndKeyCodes[i][0]].numberStr = i.toString();
                buttons[buttonsIdsAndKeyCodes[i][0]].act = writeNumber;
            }
        }
        buttons.decimal.numberStr = '.';
        buttons.help.info = startInfo;
        buttons.help.act = cancelInfo;
        buttons.decimal.act = writeNumber;
        buttons.back.act = deleteLastEntry;
        buttons.ms.act = changeMemory;
        buttons.mplus.act = memoryAdd;
        buttons.mminus.act = memoryMinus;
        buttons.mr.act = memoryRecall;
        buttons.clear.act = clearing;
        buttons.mc.act = memoryClearing;
        buttons.ac.act = function() {
            memoryClearing();
            clearing();
        };
        buttons.posneg.act = changeSign;
        buttons.equals.act = showResult;
        buttons.percent.act = strInToPercentOfNumber;
        buttons.sroot.act = squareRoot;
        buttons.add.act = buttons.subtract.act = buttons.multiply.act = buttons.divide.act = startOperation;
        buttons.add.oper = addition;
        buttons.subtract.oper = substraction;
        buttons.multiply.oper = multiplication;
        buttons.divide.oper = division;
        //UP// adds buttons properties

    */
    //   calc.addEventListener('click', defineWorkingBtn, false);
    //  document.addEventListener('keydown', defineWorkingBtnWithKeyb, false);
    //  calc.addEventListener('touchstart', defineWorkingBtn, false);

    operations = {
            writeNumber: function writeNumber() {

                let numberOfDigits = numberStrOnDisplay.replace('-', '').replace('.', '').length;
                if (numberOfDigits < 8) {
                    if (emptyResult === true) {
                        clearing();
                    }

                    if (justGotResult === true) {
                        numberStrOnDisplay = '';
                        num1 = 0;
                        num2 = 0;
                        result = null;
                        operation = null;
                        justGotResult = false;
                    }
                    if (numberStrOnDisplay === '0') {
                        numberStrOnDisplay = '';
                    }

                    if (this._numberStr === '.') {
                        if (numberStrOnDisplay.indexOf('.') === -1) {
                            if (numberStrOnDisplay.length === 0) {
                                numberStrOnDisplay += '0.';
                            } else {
                                numberStrOnDisplay += '.';
                            }
                        } else {
                            this.impossibleStyle(this.elem);
                        }
                    } else {
                        numberStrOnDisplay += this._numberStr;
                    }
                    if (numberStrOnDisplay) {
                        disp.textContent = numberStrOnDisplay;
                    }
                    emptyResult = false;
                } else {
                    this.impossibleStyle(this.elem);
                }
            },
            toggleHelpMode: function toggleHelpMode() {
                if (isHelpMode === false) {
                    isHelpMode = true;
                    this.elem.style.color = 'orange';
                    this.elem.textContent = 'X'
                    disp.classList.add('info');
                    miniDisp.classList.add('info');
                    disp.textContent = 'Press buttons to display information about them.';
                    miniDisp.textContent = 'Keyboard: ' + this._keyCode;
                } else {

                    isHelpMode = false;
                    this.elem.style.color = '#cde7b0';
                    this.elem.textContent = 'Help'
                    disp.classList.remove('info');
                    miniDisp.classList.remove('info');
                    disp.textContent = 0;
                    miniDisp.textContent = 'MR: ' + memoryNum.toString();
                }
            },
            clear: function clear() {
                workingButton = null;
                error = false;
                numberStrOnDisplay = '';
                num1 = null;
                num2 = null;
                result = null;
                operation = null;
                justGotResult = false;
                emptyResult = false;
                lastEntry = '';
                infoE.textContent = '';
                miniDisp.textContent = 'MR: ' + memoryNum.toString();
                disp.textContent = 0;
                infoE.textContent = '';
                infoM.textContent = '';
            },
            clearMemory: function clearMemory() {
                memoryError = false;
                error = false;
                infoE.textContent = '';
                infoM.textContent = '';
                memoryNum = 0;
                miniDisp.textContent = 'MR: ' + memoryNum.toString();
            },
            clearAll: function clearAll() {
                workingButton = null;
                error = false;
                numberStrOnDisplay = '';
                num1 = null;
                num2 = null;
                result = null;
                operation = null;
                justGotResult = false;
                emptyResult = false;
                lastEntry = '';
                infoE.textContent = '';
                disp.textContent = 0;
                infoE.textContent = '';
                infoM.textContent = '';
                memoryError = false;
                memoryNum = 0;
                miniDisp.textContent = 'MR: ' + memoryNum.toString();
            },

            saveToMemory: function saveToMemory() {
                if (numberStrOnDisplay) {
                    memoryNum = Number(numberStrOnDisplay);
                } else if (result !== null) {
                    memoryNum = result;
                } else if (num1 !== null) {
                    memoryNum = num1;
                }
                infoM.textContent = 'M';
                miniDisp.textContent = 'MR: ' + memoryNum.toString();
            },

            addToMemory: function addToMemory() {
                if (numberStrOnDisplay) {
                    memoryNum += Number(numberStrOnDisplay);
                } else if (result !== null) {
                    memoryNum += result;
                } else if (num1 !== null) {
                    memoryNum += num1;
                }
                infoM.textContent = 'M';
                memoryNum = dealWithBigNumbers(memoryNum);
                if (memoryError === true) {
                    return;
                }
                miniDisp.textContent = 'MR: ' + memoryNum.toString();
            },

            minusFromMemory: function minusFromMemory() {
                if (numberStrOnDisplay) {
                    memoryNum -= Number(numberStrOnDisplay);
                } else if (result !== null) {
                    memoryNum -= result;
                } else if (num1 !== null) {
                    memoryNum -= num1;
                }
                infoM.textContent = 'M';
                memoryNum = dealWithBigNumbers(memoryNum);
                if (memoryError === true) {
                    return;
                }
                miniDisp.textContent = 'MR: ' + memoryNum.toString();
            },

            recallMomory: function recallMomory() {
                numberStrOnDisplay = memoryNum.toString();
                disp.textContent = numberStrOnDisplay;
            },

            changeSign: function changeSign() {
                console.log('changingSig', result, numberStrOnDisplay);
                if (result) {
                    result *= -1;
                    result = dealWithBigNumbers(result);
                } else if (numberStrOnDisplay && numberStrOnDisplay !== '0') {
                    numberStrOnDisplay = Number(numberStrOnDisplay) * (-1);
                    console.log(numberStrOnDisplay);
                    numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
                    numberStrOnDisplay = numberStrOnDisplay.toString();
                    lastEntry = 'changingSign';
                } else {
                    notPossibleStyle(this.elem);
                }
                emptyResult = false;
            },

            calcAndShowResult: function calcAndShowResult() {
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

        }
        /*
                    function defineWorkingBtn(evt) {
                        console.log(evt.type, evt.code);
                        if (evt.type === 'touchstart') {
                            evt.preventDefault();
                        }

                        for (let btn in buttons) {
                            if (evt.target === buttons[btn].elem) {
                                buttonIs(btn);
                                break;
                            }
                        }
                        if (workingButton) {
                            if (isHelpMode === false) {
                                workingButton.act();
                            } else {
                                workingButton.info()
                            }
                        }
                    }

                    function defineWorkingBtnWithKeyb(evt) {

                        console.log(evt.type, evt.code);
                        if (evt.code !== 'Tab' && evt.code !== 'Enter') {
                            evt.preventDefault();
                            for (var btn in buttons) {
                                if (evt.code === buttons[btn].keyCode) {
                                    buttonIs(btn);
                                    break;
                                }
                            }
                            if (workingButton) {
                                if (isHelpMode === false) {
                                    workingButton.act();
                                } else {
                                    workingButton.info()
                                }
                            }
                        }
                    }

                    function buttonIs(property) { // inside defineWorkingButton functions, sets working button,if buttons doesn't need to be disabled
                        let numberOfDigits = numberStrOnDisplay.replace('-', '').replace('.', '').length;
                        if (error === false) {
                            if (buttons[property].hasOwnProperty('numberStr') === false) {
                                workingButton = buttons[property];
                                if (workingButton.act !== deleteLastEntry) {
                                    lastEntry = '';
                                }
                            } else if (numberOfDigits < 8) { //not leting more than 8 digits
                                workingButton = buttons[property];
                                lastEntry = 'enteringString';
                            } else {
                                notPossibleStyle(buttons[property].elem);
                                workingButton = null;
                            }
                        } else if ((buttons[property] === buttons.clear && memoryError === false) ||
                            (buttons[property] === buttons.mc && memoryError === true) ||
                            buttons[property] === buttons.ac) {
                            workingButton = buttons[property];
                        } else {
                            notPossibleStyle(buttons[property].elem);
                            workingButton = null;
                        }
                        if (workingButton.elem === buttons.help.elem && isHelpMode === false) {
                            isHelpMode = true;
                        } else if (workingButton.elem === buttons.help.elem && isHelpMode === true) {
                            isHelpMode = false;
                        }
                        buttons[property].elem.focus();
                    }

                    function notPossibleStyle(btn) {
                        btn.style.color = 'red';
                        setTimeout(function() { btn.style.color = '#cde7b0'; }, 300);
                    }


                    function deleteLastEntry() {
                        if (lastEntry === 'changingSign' && numberStrOnDisplay.indexOf('-') !== -1) {
                            numberStrOnDisplay = numberStrOnDisplay.split('');
                            numberStrOnDisplay.shift();
                            numberStrOnDisplay = numberStrOnDisplay.join('');
                            disp.textContent = numberStrOnDisplay;
                        } else if (numberStrOnDisplay && lastEntry === 'enteringString' ||
                            lastEntry === 'changingSign' && numberStrOnDisplay.indexOf('-') === -1 ||
                            emptyResult === true) {
                            numberStrOnDisplay = numberStrOnDisplay.split('');
                            numberStrOnDisplay.pop();
                            numberStrOnDisplay = numberStrOnDisplay.join('');
                            if (numberStrOnDisplay === '' || numberStrOnDisplay === '-') {
                                numberStrOnDisplay = '0';
                                disp.textContent = '0';
                            } else {
                                disp.textContent = numberStrOnDisplay;
                            }
                        } else {
                            notPossibleStyle(this.elem);
                        }
                        emptyResult === false;
                    }

                    function clearing() {
                        workingButton = null;
                        error = false;
                        numberStrOnDisplay = '';
                        num1 = null;
                        num2 = null;
                        result = null;
                        operation = null;
                        justGotResult = false;
                        emptyResult = false;
                        lastEntry = '';
                        infoE.textContent = '';
                        miniDisp.textContent = 'MR: ' + memoryNum.toString();
                        disp.textContent = 0;
                        infoE.textContent = '';
                        infoM.textContent = '';
                    }

                    function memoryClearing() {
                        memoryError = false;
                        error = false;
                        infoE.textContent = '';
                        infoM.textContent = '';
                        memoryNum = 0;
                        miniDisp.textContent = 'MR: ' + memoryNum.toString();
                    }

                    function changeMemory() {
                        if (numberStrOnDisplay) {
                            memoryNum = Number(numberStrOnDisplay);
                        } else if (result !== null) {
                            memoryNum = result;
                        } else if (num1 !== null) {
                            memoryNum = num1;
                        }
                        infoM.textContent = 'M';
                        miniDisp.textContent = 'MR: ' + memoryNum.toString();
                    }

                    function memoryAdd() {
                        if (numberStrOnDisplay) {
                            memoryNum += Number(numberStrOnDisplay);
                        } else if (result !== null) {
                            memoryNum += result;
                        } else if (num1 !== null) {
                            memoryNum += num1;
                        }
                        infoM.textContent = 'M';
                        memoryNum = dealWithBigNumbers(memoryNum);
                        if (memoryError === true) {
                            return;
                        }
                        miniDisp.textContent = 'MR: ' + memoryNum.toString();
                    }

                    function memoryMinus() {
                        if (numberStrOnDisplay) {
                            memoryNum -= Number(numberStrOnDisplay);
                        } else if (result !== null) {
                            memoryNum -= result;
                        } else if (num1 !== null) {
                            memoryNum -= num1;
                        }
                        infoM.textContent = 'M';
                        memoryNum = dealWithBigNumbers(memoryNum);
                        if (memoryError === true) {
                            return;
                        }
                        miniDisp.textContent = 'MR: ' + memoryNum.toString();
                    }

                    function memoryRecall() {
                        numberStrOnDisplay = memoryNum.toString();
                        disp.textContent = numberStrOnDisplay;
                    }

                    function changeSign() {
                        console.log('changingSig', result, numberStrOnDisplay);
                        if (result) {
                            result *= -1;
                            result = dealWithBigNumbers(result);
                        } else if (numberStrOnDisplay && numberStrOnDisplay !== '0') {
                            numberStrOnDisplay = Number(numberStrOnDisplay) * (-1);
                            console.log(numberStrOnDisplay);
                            numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
                            numberStrOnDisplay = numberStrOnDisplay.toString();
                            lastEntry = 'changingSign';
                        } else {
                            notPossibleStyle(this.elem);
                        }
                        emptyResult = false;
                    }

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
                        result = ((num1 * commonMultip(num1, num2)) + (num2 * commonMultip(num1, num2))) / commonMultip(num1, num2);
                    }

                    function substraction() {
                        console.log('minusing', num1, num2);
                        result = ((num1 * commonMultip(num1, num2)) - (num2 * commonMultip(num1, num2))) / commonMultip(num1, num2);
                    }

                    function multiplication() {
                        console.log('multiplicating', num1, num2);
                        result = ((num1 * decimalRemoval(num1)) * (num2 * decimalRemoval(num2))) /
                            (decimalRemoval(num1) * decimalRemoval(num2));
                    }

                    function division() {
                        console.log('dividing', num1, num2);
                        result = num1 / num2;
                        //result = ((num1 * decimalRemoval(num1)) / (num2 * decimalRemoval(num2))) /
                           //      (decimalRemoval(num1) * decimalRemoval(num2));
            if (num2 === 0) {
                error = true;
                infoE.textContent = 'E';
                miniDisp.textContent = 'Error - division by 0 is not possible.';
                disp.textContent = 'Undefined';
                return;
            }
        }

        function strInToPercentOfNumber() {
            let percent;
            if (operation && numberStrOnDisplay) {
                numberStrOnDisplay = Number(numberStrOnDisplay);
                numberStrOnDisplay = (((num1 * decimalRemoval(num1)) * (numberStrOnDisplay * decimalRemoval(numberStrOnDisplay))) /
                    (decimalRemoval(num1) * decimalRemoval(numberStrOnDisplay))) / 100;
                numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
                numberStrOnDisplay = numberStrOnDisplay.toString();
                // disp.textContent = str;
            } else {
                notPossibleStyle(this.elem);
            }
        }

        function squareRoot() {
            if (numberStrOnDisplay) {
                if (numberStrOnDisplay.indexOf('-') !== -1) {
                    numberStrOnDisplay = numberStrOnDisplay.slice(1, numberStrOnDisplay.length);
                    error = true;
                    infoE.textContent = 'E';
                    miniDisp.textContent = 'Error - negative number can\'t have square root';
                    return;
                }
                numberStrOnDisplay = Number(numberStrOnDisplay);
                numberStrOnDisplay = Math.sqrt(numberStrOnDisplay);
                console.log(numberStrOnDisplay);
                numberStrOnDisplay = dealWithBigNumbers(numberStrOnDisplay);
                numberStrOnDisplay = numberStrOnDisplay.toString();

            } else if (result !== null) {
                if (result.toString().indexOf('-') !== -1) {
                    result = result.toString().slice(1, result.toString().length);
                    result = Number(result);
                    error = true;
                    infoE.textContent = 'E';
                    miniDisp.textContent = 'Error - negative number can\'t have square root';
                    return;
                }
                result = Math.sqrt(result);
                result = dealWithBigNumbers(result);

            } else if (operation && !numberStrOnDisplay) {
                if (num1.toString().indexOf('-') !== -1) {
                    num1 = num1.toString().slice(1, result.toString().length);
                    num1 = Number(num1);
                    error = true;
                    infoE.textContent = 'E';
                    miniDisp.textContent = 'Error - negative number can\'t have square root';
                    return;
                }
                num1 = Math.sqrt(num1);
                num1 = dealWithBigNumbers(num1);
            }
            emptyResult = true;

        }

        function decimalRemoval(num) {
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

        function commonMultip(number1, number2) {
            let common;
            if (decimalRemoval(number1) >= decimalRemoval(number2)) {
                common = decimalRemoval(number1);
            } else {
                common = decimalRemoval(number2);
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
    function getButtonsIdsAndKeyCodes() {
        let buttonsIdsAndKeyCodes = [];
        for (let i = 0; i < buttons.length; i++) {
            let idAndKeyCode = {
                id: buttons[i].id,
                keyCode: buttons[i].dataset.keyCode
            }
            buttonsIdsAndKeyCodes.push(idAndKeyCode);
        }
        return buttonsIdsAndKeyCodes;
    }


})();