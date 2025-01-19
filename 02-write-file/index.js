var fs = require('fs');
var txtPath = require('path');
var readline = require('readline');

var filePath = txtPath.join(__dirname, 'output.txt');

var writeStream = fs.createWriteStream(filePath, { flags: 'a' });

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Greetings!Type anything that will be added to the newly created txt file or  type "exit" to terminate the program. Also press ctrl + c to terminate',
);

rl.on('line', function (input) {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Farewell');
    writeStream.end();
    process.exit(0);
  } else {
    writeStream.write(input + '\n');
  }
});

process.on('SIGINT', function () {
  console.log('\nFarewell');
  writeStream.end();
  process.exit(0);
});
