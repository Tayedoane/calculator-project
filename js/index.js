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

class CenterOperation extends Operation {
  constructor(calculate, priority) {
    super(calculate, priority);
  }

  /* for any operator in the format:
  operand1 operator operand2*/
  calculate(position, arr) {
    if (position + 1 > arr.length || position - 1 < 0 ||
      isNaN(arr[position + 1]) || isNaN(arr[position - 1]))
      throw new Error("invalid operation");
    
    const operationValue = super.correspondingFunc(arr[position - 1], arr[position + 1]);
    arr.splice(position - 1, 3, operationValue);
    console.log("Here is the result:" + arr);
  }
}





/* seperate from individual operation, stores every single created
 operaration*/
let Operations = {
 ADD: new CenterOperation((operand1, operand2) => operand1 + operand2, 1),
 SUB: new CenterOperation((operand1, operand2) => operand1 - operand2, 1),
 DIV: new CenterOperation((operand1, operand2) => operand1 / operand2, 2),
 MUL: new CenterOperation((operand1, operand2) => operand1 * operand2, 2),
};


class Equation {
 result;



 /* creates an finds value for a given equation, invalid equation throws errors*/
 constructor(equation) {
  const parsedArr = [];

  const tokenizedEq = equation.match(/[0-9]+|[-+/*]+/gi);
  console.log(tokenizedEq);

  tokenizedEq.forEach(token => {
    parsedArr.push(isNaN(token) ? this.#parseOperator(token) : Number(token))
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
  switch (operator) {
   case '+':
     return Operations.ADD;
   case '-':
    return Operations.SUB;
   case '*':
    return Operations.MUL;
   case '/':
    return Operations.DIV;
   default:
    throw new Error('invalid operator');
  }
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
      isNaN(curr) && (maxIndex === -1 || curr.priority > arr[maxIndex].priority)
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

