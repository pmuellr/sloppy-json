export interface IToken {
  value: any;
  isEOF: boolean
  isBraceL: boolean
  isBraceR: boolean
  isBracketL: boolean
  isBracketR: boolean
  isColon: boolean
  isString: boolean
  isNumber: boolean
  isTrue: boolean
  isFalse: boolean
  isNull: boolean
}

export interface ITokenizer {
  next(): IToken
}
