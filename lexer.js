const {tokenTypes,Token}=require('./token');

function getTokenType(option) {
    for (let key in tokenTypes) {
        if (tokenTypes[key] === option) {
            return key;
        }
    }
    return tokenTypes.UNKNOWN;
}


function addToken(tokens, type, value) {
    const token = new Token(type, value);
    tokens.push(token);
}


function isNumber(input) {
    const numberPattern = /^[-+]?(0|([1-9]\d*\.?\d*)|0?\.?\d+)([eE][-+]?\d+)?$/;
    return numberPattern.test(input);
}


function getValueType(str) {
    if (str === "true" || str === "false") return tokenTypes.BOOLEAN;
    if (str === "null") return tokenTypes.NULLVALUE;
    if (isNumber(str)) return tokenTypes.NUMBER;
    return tokenTypes.UNKNOWN;
}


function isClosingBracketOrComma(ch) {
    return [')', '}', ']', ','].includes(ch);
}


function isValidEscapeCharacterForJSON(ch) {
    return ['"', '\\', '/', 'b', 'f', 'n', 'r', 't'].includes(ch);
}


function displayTokens(tokens) {
    console.log("-------------------------Tokenization:-------------------------------");
    tokens.forEach(token => {
        console.log(`${getTokenType(token.type)} : ${token.value}`);
    });
    console.log("---------------------------------------------------------------------\n");
}


function isValidString(str) {
    for (let index = 0; index < str.length; index++) {
        if (str[index] === '\\') {
            index++;
            if (isValidEscapeCharacterForJSON(str[index])) {
                continue;
            }
            else if(str[index] === 'u') {
               
                for (let j = 0; j < 4; j++) {
                    index++;
                    if (index >= str.length || !/[0-9a-fA-F]/.test(str[index])) {
                        return false;
                    }
                }
            }
            else{
                return false;
            }
        }
    }
    return true;
}


function lexer(inputString) {
    const tokens = [];
    let index = 0;

    while (index < inputString.length) {
        if (/\s/.test(inputString[index])) { 
            index++;
            continue;
        }

        switch (inputString[index]) {
            case '{':
                addToken(tokens, tokenTypes.LEFTCURLYBRACKET, "{");
                break;
            case '}':
                addToken(tokens, tokenTypes.RIGHTCURLYBRACKET, "}");
                break;
            case '[':
                addToken(tokens, tokenTypes.LEFTSQUAREBRACKET, "[");
                break;
            case ']':
                addToken(tokens, tokenTypes.RIGHTSQUAREBRACKET, "]");
                break;
            case '(':
                addToken(tokens, tokenTypes.LEFTROUNDBRACKET, "(");
                break;
            case ')':
                addToken(tokens, tokenTypes.RIGHTROUNDBRACKET, ")");
                break;
            case ':':
                addToken(tokens, tokenTypes.COLON, ":");
                break;
            case ',':
                addToken(tokens, tokenTypes.COMMA, ",");
                break;
            case '"': {
               
                let str = '"';
                let strEndsWithDoubleQuotes = false;
                index++;

                while (index < inputString.length) {
                    if (inputString[index] === '\\') {
                        str += inputString[index++];
                        if (index < inputString.length) {
                            str += inputString[index++];
                        }
                        continue;
                    } 

                    if (inputString[index] === '"') {
                        str += '"';
                        strEndsWithDoubleQuotes = true;
                        break;
                    }
                    str += inputString[index++];
                    
                }

                if (isValidString(str) && strEndsWithDoubleQuotes) {
                    addToken(tokens, tokenTypes.STRINGVALUE, str);
                } else {
                    addToken(tokens, tokenTypes.UNKNOWN, str);
                    return tokens; 
                }
                break;
            }
            default: {
                
                let str = '';
                while (index  < inputString.length && !isClosingBracketOrComma(inputString[index]) && !/\s/.test(inputString[index])) {
                    str += inputString[index++];
                }

                const valueType = getValueType(str);
                addToken(tokens, valueType, str);

                if (valueType === tokenTypes.UNKNOWN) {
                    return tokens; 
                }

                if (index < inputString.length && isClosingBracketOrComma(inputString[index])) {
                    index--;
                }
                break;
            }
        }
        index++;
    }
    return tokens;
}

module.exports={
    displayTokens,
    lexer,
}