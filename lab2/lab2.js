const operatorsData = {
	'^' : {
		debug: '^',
		method: (a,b) => Math.pow(a,b),
		precendence: 4,
		associativity: '>'
	},
	'*' : {
		debug: '*',
		method: (a,b) => a*b,
		precendence: 3,
		associativity: '<'
	},
	'/' : {
		debug: '/',
		method: (a,b) => a/b,
		precendence: 3,
		associativity: '<'
	},
	'+' : {
		debug: '+',
		method: (a,b) => a+b,
		precendence: 2,
		associativity: '<'
	},
	'-' : {
		debug: '-',
		method: (a,b) => a-b,
		precendence: 2,
		associativity: '<'
	},
	'-u' : {
		debug: '-u',
		method: (a) => -a,
		precendence: 5,
		associativity: '>'
	}
}

// Todo this is total garbage, mb you should rewrite this later. mb.
function negativeCheck(string, index) {
	let current = index - 1;
	while (current > 0 && !operatorsData[string[current]] && (isNaN(+(string[current])) || string[current] === ' ') && string[current] !== '(' && string[current] !== ')') {
		current--;
	}
	// console.log(string[current]);
	if (operatorsData[string[current]] || string[current] === '(' || current < 0) {
		return true
		// Todo do you even need this second check?
		// current = index + 1;
		// while (index < string.length && !operatorsData[string[current]] && (isNaN(+(string[current])) || string[current] === ' ') && string[current] !== '(' && string[current] !== ')') {
		// 	current++;
		// }
		// if (!isNaN(+(string[current])) || string[current] === ')' || string[current] === '(') {
		// 	return true
		// }
	}
	return false
}


function stringToRPN(input) {
	// input = input.replace( /\s/g, '');
	// console.log(input);
	const output = [], operators = [];
	for(let i = 0; i < input.length; i++) {
		if (!isNaN(+(input[i])) && input[i] !== ' ') {
			let number = input[i];
			while (!isNaN(+(input[i + 1])) && input[i + 1] !== ' ') {
				i++;
				number += input[i];
			}
			output.push(+number);
			
		} else if (operatorsData[input[i]]) {
			let currentData = operatorsData[input[i]];
			if (input[i] === '-' && negativeCheck(input, i)) {
				currentData = operatorsData['-u']
			}
			while (
				operators.length > 0 
				&& (operators[operators.length - 1].precendence > currentData.precendence 
					|| (operators[operators.length - 1].precendence === currentData.precendence 
						&& operators[operators.length - 1].associativity === '<'
					)
				)
			){
				output.push(operators.pop());
			}
			operators.push(currentData);
		} else if (input[i] === '(') {
			operators.push(input[i]);

		} else if (input[i] === ')') {
			while(operators[operators.length - 1] !== '(' && operators.length > 0) {
				output.push(operators.pop());
			}
			operators.pop();
		}
	}
	while(operators.length > 0) {
		output.push(operators.pop());
	}
	return output;
}


// Input : reverse polish notation array with operators and numbers to calculate
function RPNsolver(input) {
	// Output: array for calculations
	const output = [];
	// Input loop
	while(input.length > 0) {
		// console.log(output);

		// Shift the element from input array (shift = take the first element from array and delete it. Like pop but upside down)
		let data = input.shift();
		if (isNaN(data)) {
			// If data that we shifted is an operator (isNan(data) = data is Not A Number? returns true or false)
			const operand = output.pop();
			// We pop data from the output stack. It won't be empty because operator cannot be first in RPN.
			if(data.debug === '-u') {
				// We check either the operator is unary or not. If unary we use current operator method(from operatorData) on data we just poped, then push in output
				output.push(data.method(operand));
			} else {
				// If operator is binary we pop one more number from output data and use current operator method, then push in output
				output.push(data.method(output.pop(), operand));
			}
		} else {
			// If data is a number we push it in output
			output.push(data);
		}
	};
	// in the end we will always have one number in output stack, wich is out result.
	return output.pop();
}
// console.log(stringToRPN(process.argv[2]));
console.log(RPNsolver(stringToRPN(process.argv[2])));
