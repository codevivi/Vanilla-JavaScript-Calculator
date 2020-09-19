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
  const disp = document.getElementById('display');
  const miniDisp = document.getElementById('mini-display-id');
  const infoM = document.getElementById('info-M-id');
  const infoE = document.getElementById('info-E-id');


  let buttonsIdsAndKeyCodes = [
  ['zero','Numpad0','Enters 0.'], 
  ['one','Numpad1','Enters 1.'], 
  ['two','Numpad2','Enters 2.'], 
  ['three','Numpad3','Enters 3.'], 
  ['four','Numpad4','Enters 4.'], 
  ['five','Numpad5','Enters 5.'], 
  ['six','Numpad6','Enters 6.'], 
  ['seven','Numpad7', 'Enters 7.'], 
  ['eight','Numpad8','Enters 8.'], 
  ['nine','Numpad9','Enters 9.'], 
  ['decimal','NumpadDecimal','Enters decimal point .'], 
  ['posneg','Backslash', 'Changes sign (multiplying by -1).'], 
  ['add','NumpadAdd','Adds two numbers or a number to itself.'], 
  ['subtract','NumpadSubtract','Subtracts two numbers or a number from itself.'], 
  ['multiply','NumpadMultiply','Multiplies two numbers or a number from by itself.'], 
  ['divide','NumpadDivide', 'Divides two numbers or a number by itself.'], 
  ['equals','Space','Show result, repeat operation.'], 
  ['percent','KeyP', 'Enter Number1, then operator ([+],[-],[x],[/]), then Number2 folowed by [%]. Number2 will become number2 percent of Number1.'], 
  ['sroot','KeyR','Calculates square root of a number.'],
  ['mplus','ArrowRight','Adds number on a display to a memory number and saves the result in to a memory number.'], 
  ['mminus','ArrowLeft', 'Substracts a number on a display from a memory number and saves the result in to a memory number'], 
  ['mr','ArrowUp', 'Recalls numbber memory number.'], 
  ['ms','ArrowDown', 'Changes memory number in to a number, which is on a display.'],
  ['mc','ControlRight', 'Clears memory. Changes memory number to 0.'],
  ['clear','KeyC', 'Clears the Screen.'], 
  ['ac','Delete','Clears Everything.'],
  ['back','Backspace','Deletes last entered digit, if no other operations was performed on a number.'],
  ['help','KeyH','Press buttons to display information about them.']];

  let buttons = {};

  let workingButton = null;
  let error = false;
  let str = '';
  let num1 = null;
  let num2 = null;
  let result = null;
  let operation = null;

  let justGotResult = false;
  let lastEntry = '';
  let memoryNum = 0;
  let memoryError = false;
  let emptyResult = false;
  let helpBol = false;

  infoE.textContent = '';
  infoM.textContent = '';
  miniDisp.textContent = 'MR: ' + memoryNum.toString();
  disp.textContent = 0;


//DOWN// adds buttons properties
  for(let i = 0; i < buttonsIdsAndKeyCodes.length; i++) {
    buttons[buttonsIdsAndKeyCodes[i][0]] = {};
    buttons[buttonsIdsAndKeyCodes[i][0]].elem = document.getElementById(buttonsIdsAndKeyCodes[i][0]);
    buttons[buttonsIdsAndKeyCodes[i][0]].info = dispInfo;
    buttons[buttonsIdsAndKeyCodes[i][0]].keyCode = buttonsIdsAndKeyCodes[i][1];
        buttons[buttonsIdsAndKeyCodes[i][0]].description = buttonsIdsAndKeyCodes[i][2];
    if(i < 10) {
      buttons[buttonsIdsAndKeyCodes[i][0]].string = i.toString();
      buttons[buttonsIdsAndKeyCodes[i][0]].act = writeNumber;
    }
  }
  buttons.decimal.string = '.';
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


  calc.addEventListener('click', defineWorkingBtn, false);
  document.addEventListener('keydown', defineWorkingBtnWithKeyb, false);
  calc.addEventListener('touchstart', defineWorkingBtn, false);

  function defineWorkingBtn (evt) {
      console.log(evt.type, evt.code);
    if(evt.type === 'touchstart') {
      evt.preventDefault();
    }

    for(var prop in buttons) {
      if(evt.target === buttons[prop].elem) {
        buttonIs(prop);
        break;
      }
    }
    if(workingButton){
      if(helpBol === false) {
        workingButton.act();
      }else {
        workingButton.info()
      }
    }
  }

  function defineWorkingBtnWithKeyb (evt) {

    console.log(evt.type, evt.code);
    if(evt.code !== 'Tab' && evt.code !== 'Enter') {
      evt.preventDefault();
      for(var prop in buttons) {
        if(evt.code === buttons[prop].keyCode) {
          buttonIs(prop);
          break;
        }
      }
      if(workingButton){
        if(helpBol === false) {
          workingButton.act();
        }else {
          workingButton.info()
        }
      }
    }
  }

  function buttonIs (property) { // inside defineWorkingButton functions, sets working button,if buttons doesn't need to be disabled
  let numberOfDigits = str.replace('-','').replace('.','').length;
    if(error === false) {
      if(buttons[property].hasOwnProperty('string') === false) {
            workingButton = buttons[property];
            if(workingButton.act !== deleteLastEntry) {
              lastEntry = '';
            }
      }else if( numberOfDigits < 8) { //not leting more than 8 digits
        workingButton = buttons[property];
        lastEntry = 'enteringString';
      }else {
        notPossibleStyle(buttons[property].elem);
        workingButton = null;
      }
    }else if((buttons[property] === buttons.clear && memoryError === false) ||
      (buttons[property] === buttons.mc && memoryError === true) ||
     buttons[property] === buttons.ac) {
      workingButton = buttons[property];
    }else{
      notPossibleStyle(buttons[property].elem);
      workingButton = null;
    }
    if(workingButton.elem === buttons.help.elem && helpBol === false) {
      helpBol = true;
    }else if(workingButton.elem === buttons.help.elem && helpBol === true) {
      helpBol = false;
    }
    buttons[property].elem.focus();
  }

  function notPossibleStyle (btn) {
    btn.style.color = 'red';
    setTimeout(function() {btn.style.color = '#cde7b0';}, 300);
  }

  function writeNumber () {
    if(emptyResult === true) {
      clearing();
    }

    if(justGotResult === true) {
      str = '';
      num1 = 0;
      num2 = 0;
      result = null;
      operation = null;
      justGotResult = false;
    }
    if (this.string === '0') {
      if(str === '0'){
        notPossibleStyle(this.elem);
      }else {
        str += this.string;
      }
    }else if(this.string === '.'){
      if(str.indexOf('.') === -1) {
        if(str.length === 0) {
            str +='0.';
          }else { 
            str +='.';
          }
      }else {
        notPossibleStyle(this.elem);
      }
    }else {
      if(str === '0') {
        str = '';
      }
      str += this.string;
    }
    if(str){
    disp.textContent = str;
    }
    emptyResult = false;
  }

  function deleteLastEntry () {
    if(lastEntry === 'changingSign' && str.indexOf('-') !== -1) {
      str = str.split('');
      str.shift();
      str = str.join('');
      disp.textContent = str; 
    }else if (str && lastEntry === 'enteringString' ||
              lastEntry === 'changingSign' && str.indexOf('-') === -1 ||
              emptyResult === true) {
      str = str.split('');
      str.pop();
      str = str.join('');
      if (str === '' || str === '-') {
        str = '0';
        disp.textContent = '0';
      }else {
        disp.textContent = str;
      }
    }else {
      notPossibleStyle(this.elem);
    }
    emptyResult === false;
  }

  function clearing () {
    workingButton = null;
    error = false;
    str = '';
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

  function memoryClearing () {
    memoryError = false;
    error = false;
    infoE.textContent = '';
    infoM.textContent = '';
    memoryNum = 0;
    miniDisp.textContent = 'MR: ' + memoryNum.toString();
  }

  function changeMemory () {
    if(str) {
      memoryNum = Number(str);
    }else if(result !== null) {
      memoryNum = result;
    }else if(num1 !== null){
      memoryNum = num1;
    }
    infoM.textContent = 'M';
    miniDisp.textContent = 'MR: ' + memoryNum.toString();
  }

  function memoryAdd () {
    if(str) {
      memoryNum += Number(str);
    }else if(result !== null) {
      memoryNum += result;
    }else if(num1 !== null){
      memoryNum += num1;
    }
    infoM.textContent = 'M';
    memoryNum = dealWithBigNumbers(memoryNum);
    if(memoryError === true) {
      return;
    }
    miniDisp.textContent = 'MR: ' + memoryNum.toString();
  }

  function memoryMinus () {
    if(str) {
      memoryNum -= Number(str);
    }else if(result !== null) {
      memoryNum -= result;
    }else if(num1 !== null){
      memoryNum -= num1;
    }
    infoM.textContent = 'M';
    memoryNum = dealWithBigNumbers(memoryNum);
     if(memoryError === true) {
      return;
    }
    miniDisp.textContent = 'MR: ' + memoryNum.toString();
  }

  function memoryRecall () {
    str = memoryNum.toString();
    disp.textContent = str;
  }

  function changeSign () {
    console.log('changingSig', result, str);
    if(result) {
      result*=-1;
      result = dealWithBigNumbers(result);
    }else if (str && str !== '0'){
      str = Number(str) * (-1);
      console.log(str);
      str = dealWithBigNumbers(str);
      str = str.toString();
      lastEntry = 'changingSign';
    }else {
      notPossibleStyle(this.elem);
    }
    emptyResult = false;
  }

  function showResult () {
    if(operation) {
      if(num1 !== null && operation && result === null) {
        if(!str) {
          num2 = num1;
        }else {
          num2 = Number(str);
          str = '';
        }
      }else if (result !== null){
        num1 = result;
        if(str) {
          num2 = Number(str);
          str = '';
        }
      }
      operation();
      if(error === true){
        return;
      }
      result = dealWithBigNumbers(result);
      justGotResult = true;
      emptyResult = false;
    }else {
      emptyResult = true;
      console.log(emptyResult);
    }
  }

  function startOperation () {
      emptyResult = false;
    if(num1 === null && result === null) {
      if (str) {
        num1 = Number(str);
        str = '';
      }else {
        num1 = 0;
      }
      justGotResult = false;
    }else if(num1 !== null && str && result === null) {
      num2 = Number(str);
      str = '';
      operation();
      num1 = result;;
      result = null;
      num1 = dealWithBigNumbers(num1);
      justGotResult = false;
    }else if(result!== null && num1!== null && justGotResult === false) {
      if(str){
        num1 = result;
        result = null;
        num2 = Number(str);
        str ='';
      }else {
        num2 = num1;
      }
      operation(num1,num2);
      if(error === true) {
        return;
      }
      result = dealWithBigNumbers(result);
      justGotResult = true;
    }else if(result!== null) {
      num1 = result;
      result = null;
      num2 = null;
      justGotResult = false;
    }
    operation = this.oper;
  }

  function addition () {
    console.log('adding', num1, num2);
    result = ((num1 * commonMultip(num1, num2)) + (num2 * commonMultip(num1, num2))) / commonMultip(num1, num2);
  }

  function substraction () {
    console.log('minusing', num1, num2);
    result = ((num1 * commonMultip(num1, num2)) - (num2 * commonMultip(num1, num2))) / commonMultip(num1, num2);
  }

  function multiplication () {
    console.log('multiplicating', num1, num2);
    result = ((num1 * decimalRemoval(num1)) * (num2 * decimalRemoval(num2))) /
             (decimalRemoval(num1) * decimalRemoval(num2));
  }

  function division () {
    console.log('dividing', num1, num2);
    result = num1 / num2;
    /*result = ((num1 * decimalRemoval(num1)) / (num2 * decimalRemoval(num2))) /
             (decimalRemoval(num1) * decimalRemoval(num2));*/
    if(num2 === 0) {
      error = true;
      infoE.textContent = 'E';
      miniDisp.textContent = 'Error - division by 0 is not possible.';
      disp.textContent = 'Undefined';
      return;
    }
  }

  function strInToPercentOfNumber () {
    let percent;
    if(operation && str) {
      str = Number(str);
      str = (((num1 * decimalRemoval(num1)) * (str * decimalRemoval(str))) /
              (decimalRemoval(num1) * decimalRemoval(str))) / 100;
      str = dealWithBigNumbers(str);
      str = str.toString();
     // disp.textContent = str;
    }else {
      notPossibleStyle(this.elem);
    }
  }

  function squareRoot (){
    if(str) {
      if(str.indexOf('-') !== -1 ) {
        str = str.slice(1, str.length);
        error = true;
        infoE.textContent = 'E';
        miniDisp.textContent = 'Error - negative number can\'t have square root';
        return;
      }
      str = Number(str);
      str = Math.sqrt(str);
      console.log(str);
      str = dealWithBigNumbers(str);
      str = str.toString();

    }else if(result !== null) {
      if(result.toString().indexOf('-') !== -1) {
        result = result.toString().slice(1, result.toString().length);
        result = Number(result);
        error = true;
        infoE.textContent = 'E';
        miniDisp.textContent = 'Error - negative number can\'t have square root';
        return;
      }
      result = Math.sqrt(result);
      result = dealWithBigNumbers(result);

    }else if (operation && !str ) {
      if(num1.toString().indexOf('-') !== -1) {
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
      for(let i = 1; i <= decimal; i++) {
        multiplyer *=10;
      }
      return  multiplyer;
    } else {
      return 1;
    }
  }

  function commonMultip (number1, number2) {
    let common;
    if(decimalRemoval(number1) >= decimalRemoval(number2)) {
      common = decimalRemoval(number1);
    }else {
      common = decimalRemoval(number2);
    }
    return common;
  }

  function dealWithBigNumbers (possiblyBigNumber) {
    let reg = /\.9999/;
    let stringFromNumber = possiblyBigNumber.toString();
    let decimalIndex = stringFromNumber.indexOf('.');
    let numberOfDigits = stringFromNumber.replace('-','').replace('.','').length;
    let notDigitsCount = stringFromNumber.length - numberOfDigits;
        if(reg.test(stringFromNumber) === true) {
            stringFromNumber = Number(stringFromNumber);
            stringFromNumber = Math.round(stringFromNumber).toString();
            console.log('acuracy warning: number is rounded');
        }
        if(numberOfDigits > 8 && decimalIndex !== -1) {
          stringFromNumber = stringFromNumber.slice(0, 8 + notDigitsCount);
          console.log('acuracy warning: number is cut at 8 digits');
        }else if(numberOfDigits > 8 && decimalIndex === -1 || decimalIndex > 9 ) {
          console.log('number is too large for this calculator, number is', stringFromNumber);
          stringFromNumber = stringFromNumber.slice(0, 8 + notDigitsCount); 
          error = true;
        }
        if(error === true) {
          if(workingButton.elem !== buttons.mplus.elem &&
             workingButton.elem !== buttons.mminus.elem) {
             miniDisp.textContent = 'Error - number too large.';
             disp.textContent = stringFromNumber;
          }else if(workingButton.elem === buttons.mplus.elem ||
             workingButton.elem === buttons.mminus.elem) {
             miniDisp.textContent = 'MR: ' + stringFromNumber + '\; Error - number in memory is too large.';
             memoryError = true;
          }
          infoE.textContent = 'E';
        }else if(workingButton.elem !== buttons.mplus.elem &&
          workingButton.elem !== buttons.mminus.elem) {
          disp.textContent = stringFromNumber; 
        }
        possiblyBigNumber = Number(stringFromNumber);
        return possiblyBigNumber;
  }

  function startInfo () {
    this.elem.style.color = 'orange';
    this.elem.textContent = 'X'
    disp.classList.add('info');
    miniDisp.classList.add('info');
    disp.textContent = 'Press buttons to display information about them.';
    miniDisp.textContent = 'Keyboard: ' + this.keyCode;
  }

    function cancelInfo () {
    this.elem.style.color = '#cde7b0';
    this.elem.textContent = 'Help'
    disp.classList.remove('info');
    miniDisp.classList.remove('info');
    disp.textContent = 0;
    miniDisp.textContent = 'MR: ' + memoryNum.toString();

  }
  function dispInfo () {
    miniDisp.textContent = 'Keyboard: ' + this.keyCode;
    disp.textContent = this.description;
  }

})();




