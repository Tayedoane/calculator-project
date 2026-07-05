class Operation {
 priotriy;
 calculate;

 constructor(priority, calculate){
  this.priotriy = priority;
  this.calculate = calculate;
 }
}

const Operations = Object.freeze({
 ADD: new Operation(1 , (operand1, operand2) => operand1 + operand2),
 SUB: new Operation(1, (operand1, operand2) => operand1 - operand2),
 DIV: new Operation(2, (operand1, operand2) => operand1 / operand2),
 MUL: new Operation(2, (operand1, operand2) => operand1 * operand2),
});


class Equation {
 #innerArr;


 /*TODO, make it so operations are based on number of args in calculate function,
   I.E x^2 or sin(x) need only one operand, current method only supports having 2 operands */
 constructor(equation) {
  equation = equation.replace(/ /g, '');
  this.#innerArr = [];

  if (equation.length < 3){
   throw new Error('Equation not complete')
  }

  const tokenizedEq = equation.match(/[0-9]+|[-+/*]+/gi);
  console.log(tokenizedEq);

  this.#validateOperand(tokenizedEq[0])
  this.#innerArr.push(tokenizedEq[0]);

  this.#innerArr.push(this.#parseOperator(tokenizedEq[1]));

  this.#innerArr.push(this.#validateOperand(tokenizedEq[2]));

  for (let i = 3; i < tokenizedEq.length; i += 2) {
   this.#innerArr.push(this.#parseOperator(tokenizedEq[i]));

   this.#innerArr.push(this.#validateOperand(tokenizedEq[i + 1]));
  } 
 }

 /* converts any corresponding char values to symbols,
  * 
  * also checks for any invalid operand input
  */
  #parseOperator(operator) {
  console.log(Operations.ADD);
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

 /* short validation for operands as well as parathesis*/
 #validateOperand(operand) { 
  console.log(operand)
   if (isNaN(operand))
    throw new Error('Invalid operand');
   return operand;
 }

 evaluate() {

 }

 printInner() {
  console.log(this.#innerArr);
 }
}
 


let input = document.getElementById('input');
let output = document.getElementById('output');

function updateOutput() {
 output.textContent = input.value;
}

input.oninput = () => {
 console.log(input.value)
 var val = new Equation(input.value);
 val.printInner();
 
 updateOutput();
}


