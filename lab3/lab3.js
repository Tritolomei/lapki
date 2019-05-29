'use strict';

// function LW78Encode(string) {
// 	// let output = {dictionary: , output:};
// 	let current = "";
// 	let phrases = [];
// 	for(let i = 0; i < string.length; i++) {
// 		current += string[i];
// 		if(!phrases.includes(current)) {
// 			phrases.push(current);
// 			current = "";
// 		} else if(i === string.length - 1) {
// 			phrases.push(current);
// 		}
// 	}
// 	return phrases;
// }


const fs = require("fs");


function LW78Encode(string) {
	let buffer = "";
	const dict = {"":0};
	let counter = 0;
	let ans = "";

	let helpMe = 1;
	var helpMeCounter = 0;


	//let useless = 0;

	for(let i = 0; i < string.length; i++) {
		if(dict.hasOwnProperty(buffer + ('00' + string[i]).substr(-3))) {
			buffer += ('00' + string[i]).substr(-3);
		} else {
			let numberbits = dict[buffer].toString(2);
			helpMeCounter += 1;
			if (Math.pow(2, helpMe) < helpMeCounter) {
				helpMe++;
				helpMeCounter = 0;
			}
			while (numberbits.length <= helpMe + 1) {
				//useless++;	
				numberbits = '0' + numberbits;
			}

			let symbolbits = string[i].toString(2);

			while (symbolbits.length < 8) {
				//useless++;
				symbolbits = '0' + symbolbits;
			}
			ans += numberbits + symbolbits;
			counter++;
			dict[buffer + ('00' + string[i]).substr(-3)] = counter;
			buffer = "";
		}
	}
	if (buffer.length) {
		let numberbits = dict[buffer].toString(2);
		helpMeCounter += 1;
		if (Math.pow(2, helpMe) < helpMeCounter) {
			helpMe++;
			helpMeCounter = 0;
		}
		while (numberbits.length <= helpMe + 1) {
			numberbits = '0' + numberbits;
		}
		ans += numberbits;
	}
	//console.log(useless);
	return ans;
}


function bitStringToBuffer(string) {
	const output = [];
	for (let i = 0; i < string.length; i = i + 8) {
		output.push(parseInt(string.substr(i,8),2));
	}
	output.push(string.length % 8);
	return Buffer.from(output);
}


// const test = fs.readFileSync("input.m4a");

// const encodingData = LW78Encode(test);

// const byteArray = [];

// for (let i = 0; i < encodingData.ans.length; i = i + 8) {
// 	byteArray.push(parseInt(encodingData.ans.substr(i,8),2));
// }
// byteArray.push(encodingData.ans.length % 8);



// fs.writeFileSync('output.olezkazip', Buffer.from(byteArray), (err) => {
// 	if (err) throw err;
// });


function bufferToBiteString(buffer) {
	let output = "";
	for (const value of buffer.values()) {
		output += ('00000000' + value.toString(2)).substr(-8);
	}
	let kostil = parseInt(output.substr(-8), 2);
	kostil = kostil ? kostil : 8;
	output = output.substr(0, output.length - 16) + output.substr(-16).substring(8 - kostil, 8);
	return output;
}


function stringToEncodedData(string) {
	let helpMe = 1;
	var helpMeCounter = 0;
	const output = [];
	let i = 0;
	while (i < string.length) {
		let number = "";
		let byte = "";
		if(helpMeCounter < Math.pow(2, helpMe)) {
			helpMeCounter++;
		} else {
			helpMe++;
			helpMeCounter = 0;
		}

		for (let j = 0; j <= helpMe + 1; j++) {
			number += string[i];
			i++;
		}
		if(string[i]) {
			for (let j = 0; j < 8; j++) {
				byte += string[i];
				i++;
			}
		}
		output.push([number, byte]);
	}
	return output;
}


function LW78Decode(array) {
	const dict = [""];
	let ans = "";
	array.map((a) => {
		let word = dict[parseInt(a[0], 2)];
		if(a[1] !== undefined) {
			word += a[1];
		}
		ans += word;
		dict.push(word);
	});
	const localByteArray = []; 
	for (let i = 0; i < ans.length; i = i + 8) {
		localByteArray.push(parseInt(ans.substr(i,8),2));
	}
	return localByteArray;
}





// fs.writeFileSync('output.m4a', Buffer.from(LW78Decode(stringToEncodedData(bufferToBiteString(fs.readFileSync("output.olezkazip"))))), (err) => {
// 	if (err) throw err;
// });





// let testStream = fs.createReadStream('input.png');
// testStream
// 	.on('data', function (chunk) {
// 		console.log(chunk.length);
// 	})
// 	.on('end', function () {
// 		console.log('end');
// 	});



// This is a proper way, but it won't work right now
function packFile(from, into) {
	fs.writeFileSync(into, '', (err) => { if (err) throw err; });
	let readStream = fs.createReadStream(from, {});
	readStream
		.on('data', function (chunk) {
			fs.appendFileSync(into, bitStringToBuffer(LW78Encode(chunk)), (err) => { if (err) throw err; });
		})
		.on('end', function () {
			console.log('Packed!');
		});
}

function unpackFile(from, into) {
	fs.writeFileSync(into, '', (err) => { if (err) throw err; });
	let readStream = fs.createReadStream(from, {});
	readStream
		.on('data', function (chunk) {
			fs.appendFileSync(into, Buffer.from(LW78Decode(stringToEncodedData(bufferToBiteString(chunk)))), (err) => { if (err) throw err; });
		})
		.on('end', function () {
			console.log('Unpacked!');
		});
}


// This is working but shity way

function notCoolPackFile (from, into) {
	fs.writeFileSync(into, bitStringToBuffer(LW78Encode(fs.readFileSync(from))), (err) => { if (err) throw err; });
	console.log('Packed!');
}




function notCoolUnpackFile (from, into) {
	fs.writeFileSync('./' + into, Buffer.from(LW78Decode(stringToEncodedData(bufferToBiteString(fs.readFileSync(from))))), (err) => { if (err) throw err; });
	console.log('Unpacked!');
}



// This is a funny way

function packFileIntoDirectory(from, into) {
	let readStream = fs.createReadStream(from, {highWaterMark: 10 * 1024});
	let counter = 1;
	readStream
		.on('data', function (chunk) {
			fs.writeFileSync('./' + into + '/' + counter + '.part', bitStringToBuffer(LW78Encode(chunk)), (err) => { if (err) throw err; });
			counter++;
		})
		.on('end', function () {
			console.log('Packed!');
		});
}


function unpackFileFromDirectory(from, into) {
	fs.readdir(from, function (err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		} 
		let fileArray = files;
		fileArray.sort(function(a, b){
			return (+a.split('.')[0])-(+b.split('.')[0])
		});
		//console.log(fileArray);
		fs.writeFileSync(into, '', (err) => { if (err) throw err; });
		fileArray.map((a) => {
			fs.appendFileSync(into, Buffer.from(LW78Decode(stringToEncodedData(bufferToBiteString(fs.readFileSync('./' + from + '/' + a))))), (err) => { if (err) throw err; });
		})
		console.log('Unpacked!');
	});
}



const toPack = 'input.docx';

const archiveName = 'achive.olzip';

const archiveDirectory = 'archive';

const unpackTo = 'output.docx';

// notCoolPackFile(toPack, archiveName);
// notCoolUnpackFile(archiveName, unpackTo);

// packFileIntoDirectory(toPack, archiveDirectory);

//unpackFileFromDirectory(archiveDirectory, unpackTo);

// console.log(process.argv);
if (process.argv[2] === '--compress') {
	notCoolPackFile(process.argv[3], process.argv[4]);
} else if (process.argv[2] === '--decompress') {
	notCoolUnpackFile(process.argv[3], process.argv[4]);
} else {
	console.log('Input some action')
}