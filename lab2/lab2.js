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