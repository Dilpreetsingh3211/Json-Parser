const tokenTypes = {
    LEFTCURLYBRACKET: '{',
    RIGHTCURLYBRACKET: '}',
    LEFTSQUAREBRACKET: '[',
    RIGHTSQUAREBRACKET: ']',
    LEFTROUNDBRACKET: '(',
    RIGHTROUNDBRACKET: ')',
    DOT: '.',
    COLON: ':',
    COMMA: ',',
    DOUBLEQUOTE: '"',
    STRINGVALUE: 'string',
    BOOLEAN: 'boolean',
    NUMBER: 'number',
    NULLVALUE: 'null',
    UNKNOWN: 'unknown'
};


class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

module.exports={
    tokenTypes,
    Token,
}