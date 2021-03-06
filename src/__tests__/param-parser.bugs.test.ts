import { parseParameterList } from '../param-parser'

// https://github.com/jeffijoe/awilix/issues/130
//
// The bug was caused by the tokenizer trying to skip the expression at
// the `=`, but it caused it to skip over the constructor.
// The solution was to add a tokenizer flag to put it into "dumb" mode
// when the parser is skipping to the constructor token. This disables
// the "smart-skipping" of expressions.
test('#130', () => {
  const code = `
class Service2 {
    /**
     * Comment out the return statement and parsing works again.
     *
     * @param {string} aParam
     */
    static someStaticMethod(aParam) {
        return typeof aParam !== 'undefined' ? aParam : 'no param';
    }

    /**
     * This constructor fails because of the static method above.
     *
     * @param {function} injectedService
     */
    constructor(injectedService) {
        console.log(Service2.someStaticMethod(this));
        injectedService(this);
    }
}
  `
  const params = parseParameterList(code)
  expect(params).toEqual([{ name: 'injectedService', optional: false }])
})
