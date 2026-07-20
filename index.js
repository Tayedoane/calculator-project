/* this abstract classs stores a repesentation of an operation
   
  each operation can have as many, or as little operands as needed, 
  
  it's priority is ment to be a number signifying it's respective pemdas
  order, calculate is the literall operation */
class Operation {
 priority;
 correspondingFunc;
 
  constructor(correspondingFunc, priority) { 
    this.priority = priority;
    this.correspondingFunc = correspondingFunc;
  }

  /* takes in the relative position of the element in the innerArr, and completes
   it's operation with respect to the elements around 
   EX: for [3, +, 2], it's pos would be one, and would use 3 and 2 as operands
   
   it also updates arr so any used elements are deleted, and replaced with the result of 
   the operation so [3, +, 2] -> [5]*/
  calculate(positon, arr){
    throw new Error("Need to override this function, this class is abstract")
  }

  
  get correspondingFunc(){
    return this.correspondingFunc;
  }
  
  get priority(){
    return this.priority;
  }

  
}

  /* for any operator in the format:
  operand1 operator operand2*/
class CenterOperation extends Operation {
  constructor(correspondingFunc, priority) {
    super(correspondingFunc, priority);
  }


  //Overide
  calculate(position, arr) {
    if (position + 1 > arr.length || position - 1 < 0 ||
      isNaN(arr[position + 1]) || isNaN(arr[position - 1]))
      throw new Error("invalid operation");
    
    const operationValue = super.correspondingFunc(arr[position - 1], arr[position + 1]);
    arr.splice(position - 1, 3, operationValue);
  }

}

/* for any operator in format
   operand operator */
class RightUnaryOperation extends Operation {
  constructor(correspondingFunc, priority) {
    super(correspondingFunc, priority);
  }

  //Overide
  calculate(position, arr) {
    if (position -1 < 0 || isNaN(arr[position - 1]))
      throw new Error("invalid operation");


    const operationValue = super.correspondingFunc(arr[position - 1]);
    arr.splice(position -1, 2, operationValue);
  }
}

/* for any operator in format
   operator operand */
class LeftUnaryOperation extends Operation {
  constructor(correspondingFunc, priority) {
    super(correspondingFunc, priority);
  }

  //Overide
  calculate(position, arr) {
    if (position + 1 > arr.length || isNaN(arr[position + 1]))
      throw new Error("invalid operation");


    const operationValue = super.correspondingFunc(arr[position + 1]);
    arr.splice(position, 2, operationValue);
  }
}

/* done to allow symbol - to be either a negation operator, or subtraction
    value  */
class NegationOperation extends Operation{
  constructor(correspondingFunc, priority){
    super(correspondingFunc, priority);
  }

  //Overide
  calculate(position, arr){
    let operationValue;
    if (position + 1 > arr.length || isNaN(arr[position + 1]))
      throw new Error("invalid operation");
    if (position - 1 < 0 || isNaN(arr[position - 1])){
      operationValue = super.correspondingFunc(arr[position + 1]);
      arr.splice(position, 2, operationValue)
    }
    else 
      arr.splice(position , 1, Operations.SUB);
  }

}



/* for any operator in format 
  operator(operand1, operand2...)
*/
class FuncOperation extends Operation {
  constructor(correspondingFunc, priority){
    super(correspondingFunc, priority);
  }

  //overide
  calculate(position, arr) {
    if (position + 1 > arr.length || !Array.isArray(arr[position + 1]
    || super.correspondingFunc.length !== arr[position + 1].length))
      throw new Error("invalid operation");
    

    arr[position + 1].forEach((elem, index, arr) => {
      arr[index] = new Equation(elem).result;
    })
    const operationValue = super.correspondingFunc(...arr[position + 1]);
    arr.splice(position, 2, operationValue);
  }
}





/* seperate from individual operation, stores every single created
 operaration*/
let Operations = {
 ADD: new CenterOperation((operand1, operand2) => operand1 + operand2, 1),
 SUB: new CenterOperation((operand1, operand2) => operand1 - operand2, 1),
 DIV: new CenterOperation((operand1, operand2) => operand1 / operand2, 2),
 MUL: new CenterOperation((operand1, operand2) => operand1 * operand2, 2),
 POW: new CenterOperation((operand1, operand2) => Math.pow(operand1, operand2), 3),
 FAC: new RightUnaryOperation(operand => {
  if (!Number.isInteger(operand))
    throw new Error("Invalid operation");
  let fac = 1
  for(let i = 2; i <= operand; i++)
    fac *= i;
  return fac}, 4),
  PER: new RightUnaryOperation(operand => operand / 100, 4),
  SIN: new LeftUnaryOperation(operand => Math.sin(operand), 3),
  COS: new LeftUnaryOperation(operand => Math.cos(operand), 3),
  TAN: new LeftUnaryOperation(operand => Math.tan(operand), 3),
  SQRT: new LeftUnaryOperation(operand => operand ** 0.5, 3),
  ROOT: new FuncOperation((index, radican) => radican ** (1 / index)),
  SQ: new LeftUnaryOperation(base => base ** 2, 3),
  ABS: new LeftUnaryOperation(operand => Math.abs(operand), 3),
  NEG: new NegationOperation(operand => -operand, 4),
  LOG: new LeftUnaryOperation(operand => Math.log10(operand), 3),
  LOGB: new FuncOperation((base, argument) => Math.log(argument) / Math.log(base), 3),
  DIST: new FuncOperation((x1, y1, x2, y2) =>((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5, 3, 3),
  LSHIFT: new CenterOperation ((operand, bits) => operand << bits, 2), 
  RSHIFT: new CenterOperation ((operand, bits) => operand >> bits, 2),
  ROUND: new LeftUnaryOperation ((operand) => Math.round(operand), 3),
  ASIN: new LeftUnaryOperation(operand => Math.asin(operand), 3),
  ACOS: new LeftUnaryOperation(operand => Math.acos(operand), 3),
  ATAN: new LeftUnaryOperation(operand => Math.atan(operand), 3),
  SCINOTP: new CenterOperation((coefficient, exponent) => coefficient * 10 ** exponent, 5),//scientific notation pos
  SCINOTN: new CenterOperation((coefficient, exponent) => coefficient * 10 ** -exponent, 5)// scientific notation neg
};


/* 
 * This class takes in a string mathmatical expression, and
 * stores it's result into a result class. Any string expression
 *  that is not a valid expression throws an error
 */
class Equation {
 result;



 /* creates and finds value for a given equation, invalid equation throws errors*/
 constructor(equation) {
  equation = equation.replaceAll(' ','');
  const parsedArr = [];

  // goes through every parathesis in the array and replaces with an equation's value

  /* need while loop as (3 + 3 * (1 * 2)) first solves center most parathesis, but not
    outter ones, so loop untill all parthesis equations have been solved, parathesis does
    not includes , so function input can be parsed through
  */
  const groupingSymbolsPattern = /\([^,()]+\)|\[[^\[\]]+\]|{[^{}]+}/g;
  while (equation.match(groupingSymbolsPattern) !== null)
    equation = equation.replace(groupingSymbolsPattern, group => 
  new Equation(group.substring(1, group.length -1)).result);  
          
  console.log(equation);
  const tokenizedEq = 
  equation.match(/\([^()]+\)+|[0-9\.]+|e-+|e\++|\++|-+|\/+|\*+|\^+|!+|%+|sin+|tan+|cos+|sqrt+|root+|sq+|abs+|logb+|log+|dist+|>>+|<<+|round+|asin+|acos+|atan+|ℇ+|π+/gi);
  

  /* to make sure that anything doesnt get tokenized, then the equation is considered invalid*/
  console.log(tokenizedEq.join(''));
  if (equation != tokenizedEq.join(''))
    throw new Error('invalid equation');

  tokenizedEq.forEach(token => {
    parsedArr.push(!isNaN(token) ? Number(token): token.includes(',') ? 
    this.#parseFuncInput(token) : this.#parseOperator(token))
  });

  this.result = this.#evaluate(parsedArr);
  
 }

  get result(){
    return this.result;
  }


 /* converts any corresponding char values to symbols,
  */
  #parseOperator(operator) {
    console.log(operator.toUpperCase());
    switch (operator.toUpperCase()) {
      case '+':
      return Operations.ADD;
      case '-':
        return Operations.NEG;
      case '*':
        return Operations.MUL;
      case '/':
        return Operations.DIV;
      case '^':
        return Operations.POW;
      case '!':
        return Operations.FAC;
      case '%':
        return Operations.PER;
      case '>>':
        return Operations.RSHIFT;
      case '<<':
        return Operations.LSHIFT;
      case 'E+':
        return Operations.SCINOTP;
      case 'E-':
        return Operations.SCINOTN;
      case 'ℇ':
        return Math.E;
      case 'Π'://PIs upper case
        return Math.PI;
      default:
        return Operations[operator.toUpperCase()]
    }
  }

  /* takes input for a function, and converts to array*/
  #parseFuncInput(funcInput) {
    return funcInput.substring(1, funcInput.length -1 ).split(',');
}

/* this function takes a parsed arr that repesentan expression, and returns the result */
 #evaluate(parsedArr) {
  //First find highest priority operator
  while (parsedArr.length > 1) {
    /* this finds the highest priority operation, with left operations taking priority */
    const highPriorityOperatorIndex = parsedArr.reduce((maxIndex, curr, currIndex, arr) => {
      return isNaN(curr) && (maxIndex === -1 || curr.priority > arr[maxIndex].priority)
       ? currIndex : maxIndex}, -1);
    if (highPriorityOperatorIndex === -1)
      throw new Error('invalid equation');
    const currOperator = parsedArr[highPriorityOperatorIndex];

    currOperator.calculate(highPriorityOperatorIndex, parsedArr);
  }

  console.log(parsedArr[0]);
  if (isNaN(parsedArr[0]))
    throw new Error("Invalid equation")
  return parsedArr[0];
 }
}

const input = document.getElementById('input');
const buttons = document.querySelectorAll('#buttons button');




input.onkeydown = event => {
  console.log(event.key);
  if (event.key === 'Enter'){
    try {
      input.value = new Equation(input.value).result;
    } catch (Err) {
      alert("Invalid equation");
    }
  }
}

buttons.forEach(button => {
  if (button.dataset.val === "ENTER"){
    try {
      button.addEventListener('click', button => {input.value = new Equation(input.value).result});
    } catch(Err) {
      alert("Invalid equation");
    }
  }
  else {
    button.addEventListener('click', button => {
    const endPos = input.selectionStart + button.srcElement.dataset.val.length;
    input.value = input.value.slice(0, input.selectionStart) +
     button.srcElement.dataset.val + input.value.slice(input.selectionEnd);
    input.focus();
    input.selectionStart = endPos;
    input.selectionEnd = endPos;
  })
  }
})