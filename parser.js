const {tokenTypes,Token}=require('./token');

let parseIndex = 0;
let tokenSize = 0;
let displayData = false;


function isInvalidIndex(index, size) {
    return index >= size;
}


function displayParsingStart() {
    if (!displayData) return;
    console.log("Parsing:");
    console.log("-------------------------------");
}


function displayParsingEnd() {
    if (!displayData) return;
    console.log("-------------------------------\n");
}


function displayParsing(tokens) {
    if (!displayData) return;
    console.log(tokens[parseIndex].value);
}


function consume(tokens) {
    displayParsing(tokens);
    parseIndex++;
}

function isClosingToken(type) {
    return type === tokenTypes.RIGHTCURLYBRACKET ||
            type === tokenTypes.RIGHTSQUAREBRACKET;
}


function isValidDataType(type) {
    return type === tokenTypes.STRINGVALUE ||
           type === tokenTypes.NUMBER || 
           type === tokenTypes.BOOLEAN ||
           type === tokenTypes.NULLVALUE;
}


function isInvalidIndex(index, size) {
    return index >= size;
}


function parseLeftCurlyBracket(tokens) {
    consume(tokens); 

    if (isInvalidIndex(parseIndex, tokenSize)) return false;

    if (tokens[parseIndex].type === tokenTypes.STRINGVALUE) {
        consume(tokens); 

        if (isInvalidIndex(parseIndex, tokenSize)) return false;

        if (tokens[parseIndex].type !== tokenTypes.COLON) return false;
        consume(tokens); 

        if (isInvalidIndex(parseIndex, tokenSize)) return false;

        if (tokens[parseIndex].type === tokenTypes.LEFTCURLYBRACKET) {
            if (!parseLeftCurlyBracket(tokens)) return false;
        } else if (tokens[parseIndex].type === tokenTypes.LEFTSQUAREBRACKET) {
            if (!parseLeftSquareBracket(tokens)) return false;
        } else if (isValidDataType(tokens[parseIndex].type)) {
            consume(tokens);
        } else {
            return false;
        }
        
        if (isInvalidIndex(parseIndex, tokenSize)) return false;

        if (tokens[parseIndex].type === tokenTypes.COMMA) {
            if (parseIndex + 1 >= tokenSize) return false;

            if (isClosingToken(tokens[parseIndex + 1].type)) return false;

            if (!parseLeftCurlyBracket(tokens)) return false;
        } else if (tokens[parseIndex].type === tokenTypes.RIGHTCURLYBRACKET) {
            consume(tokens); 
        } else {
            return false;
        }
    } else if (tokens[parseIndex].type === tokenTypes.RIGHTCURLYBRACKET) {
        consume(tokens); 
    } else {
        return false;
    }

    return true; 
}


function parseLeftSquareBracket(tokens) {
    consume(tokens); 

    if (isInvalidIndex(parseIndex, tokenSize)) return false;

    
    if (tokens[parseIndex].type === tokenTypes.LEFTSQUAREBRACKET ||
        tokens[parseIndex].type === tokenTypes.LEFTCURLYBRACKET ||
        isValidDataType(tokens[parseIndex].type)) {

        if (tokens[parseIndex].type === tokenTypes.LEFTSQUAREBRACKET) {
            if (!parseLeftSquareBracket(tokens)) return false;
        } else if (tokens[parseIndex].type === tokenTypes.LEFTCURLYBRACKET) {
            if (!parseLeftCurlyBracket(tokens)) return false;
        } else if (isValidDataType(tokens[parseIndex].type)) {
            consume(tokens);
        }

        if (isInvalidIndex(parseIndex, tokenSize)) return false;

        if (tokens[parseIndex].type === tokenTypes.COMMA) {
            if (parseIndex + 1 >= tokenSize) return false;

            if (isClosingToken(tokens[parseIndex + 1].type)) return false;

            if (!parseLeftSquareBracket(tokens)) return false;
        } else if (tokens[parseIndex].type === tokenTypes.RIGHTSQUAREBRACKET) {
            consume(tokens); 
        } else {
            return false;
        }
    } else if (tokens[parseIndex].type === tokenTypes.RIGHTSQUAREBRACKET) {
        consume(tokens);
    } else {
        return false;
    }

    return true;
}


function parser(tokens,display) {
    tokenSize=tokens.length;
    displayData=display;
    
    displayParsingStart();

   
    if (isInvalidIndex(parseIndex, tokenSize)) return false;

    switch (tokens[parseIndex].type) {
        case tokenTypes.LEFTCURLYBRACKET:
            if (!parseLeftCurlyBracket(tokens)) return false;

            if (!isInvalidIndex(parseIndex, tokenSize)) {
                displayParsing(tokens);
                return false;
            }
            break;

        case tokenTypes.LEFTSQUAREBRACKET:
            if (!parseLeftSquareBracket(tokens)) return false;

            if (!isInvalidIndex(parseIndex, tokenSize)) {
                displayParsing(tokens);
                return false;
            }
            break;

        default:
            displayParsing(tokens);
            return false;
    }

    displayParsingEnd();
    return true; 
}

module.exports={
    parser,
}