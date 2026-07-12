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
    console.log("Here is the result:" + arr);
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
    console.log(operationValue);
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
    console.log(operationValue);
    arr.splice(position, 2, operationValue);
  }
}

/* for any operator in format 
  operator(operand1, operand2...)
*/
class funcOperation extends Operation {
  constructor(correspondingFunc, priority){
    super(correspondingFunc, priority);
  }

  //overide
  calculate(position, arr) {
    console.log(arr[position + 1].length);
    if (position + 1 > arr.length || !Array.isArray(arr[position + 1]
    || super.correspondingFunc.length !== arr[position + 1].length))
      throw new Error("invalid operation");
    
    /*At some point I want functions to be able to have functions, but for now, only take 
    numbers as input 
    */
    arr.forEach(elem => Number(elem)); 
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
  ROOT: new funcOperation((index, radican) => radican ** (1 / index))
};


class Equation {
 result;



 /* creates an finds value for a given equation, invalid equation throws errors*/
 constructor(equation) {
  const parsedArr = [];

  // goes through every parathesis in the array and replaces with an equation's value

  /* need while loop as (3 + 3 * (1 * 2)) first solves center most parathesis, but not
    outter ones, so loop untill all parthesis equations have been solved
  */
  const groupingSymbolsPattern = /\([^,()]+\)|\[[^\[\]]+\]|{[^{}]+}/g;
  while (equation.match(groupingSymbolsPattern) !== null)
    equation = equation.replace(groupingSymbolsPattern, group => 
  new Equation(group.replace(/[\(\)\[\]{}]/g, '')).result);  
          
  console.log(equation);
  const tokenizedEq = 
  equation.match(/\([^()]+\)+|[0-9\.]+|[-+\/*^!%]+|sin+|tan+|cos+|sqrt+|root+/gi);
  /* to make sure that anything doesnt get tokenized, then it considered invalid*/
  console.log(tokenizedEq);
  //TODO, make it so it compares and ignores whotespace properly
  if (equation.replaceAll(' ','') != tokenizedEq.join(''))
    throw new Error('invalid equation');
  console.log(tokenizedEq);

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
  * 
  * also checks for any invalid operand input
  */
  #parseOperator(operator) {
    console.log(operator);
    switch (operator.toUpperCase()) {
      case '+':
      return Operations.ADD;
      case '-':
        return Operations.SUB;
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
      case 'SIN':
        return Operations.SIN;
      case 'COS':
        return Operations.COS;
      case 'TAN':
        return Operations.TAN;
      case 'SQRT':
        return Operations.SQRT;
      case 'ROOT':
        return Operations.ROOT;
      
    default:
      throw new Error('invalid operator');
    }
  }

  /* takes input for a function, and converts to array*/
  #parseFuncInput(funcInput) {
    return funcInput.substring(1, funcInput.length -1 ).split(',');
}

/* this function is made to convert the inner array
 readble repesentation of an equation into a single
 value */
 #evaluate(parsedArr) {
  console.log(parsedArr);
  //First find highest priority operator
  while (parsedArr.length > 1) {
    /* this finds the highest priority operation, with left operations taking priority */
    const highPriorityOperatorIndex = parsedArr.reduce((maxIndex, curr, currIndex, arr) => {
      return isNaN(curr) && (maxIndex === -1 || curr.priority > arr[maxIndex].priority)
       ? currIndex : maxIndex}, -1);
    console.log( "my index: " + highPriorityOperatorIndex);
    if (highPriorityOperatorIndex === -1)
      throw new Error('invalid equation');
    const currOperator = parsedArr[highPriorityOperatorIndex];

    currOperator.calculate(highPriorityOperatorIndex, parsedArr);
  }
  return parsedArr[0];
 }

}
 


let input = document.getElementById('input');
let output = document.getElementById('output');

function updateOutput(result) {
 output.textContent = result;
}

input.oninput = () => {
 console.log(input.value)
 updateOutput(new Equation(input.value).result);
}

