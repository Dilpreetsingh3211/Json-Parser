const fs = require('fs');
const {tokenTypes,Token}=require('./token');
const {displayTokens,lexer}=require('./lexer');
const { parser }=require('./parser');


function main() {
    const args = process.argv.slice(2);
    console.log(args);
    if (args.length < 1 || args.length > 2) {
        console.error(`Usage: node ${process.argv[1]} <fileName> [displayData]`);
        return 1;
    }
    displayData=false;
    const fileName = args[0];

 
    let inputFile;
    try {
        inputFile = fs.readFileSync(fileName, 'utf-8');
    } catch (err) {
        console.error(`Error in opening file ${fileName}`);
        return 1;
    }
    console.log(typeof inputFile);
    
    
    if (args.length === 2) {
        console.log(args[1]);
        displayData = args[1] === "true"; 
    }

    let tokens = [];
    
   
    tokens=lexer(inputFile);

    tokenSize = tokens.length;

    
    displayTokens(tokens);

    if (tokenSize > 0 && tokens[tokenSize - 1].type === 'UNKNOWN') {
        console.log("INVALID JSON");
    } else {
   
        console.log("inside");
        if (!parser(tokens,displayData)) {
            console.log("INVALID JSON");
        } else {
            console.log("VALID JSON");
        }
    }

    return 0;
}

main();
