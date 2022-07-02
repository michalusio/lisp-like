import { CallParam } from "../../../ast";
import { isCallParam } from "../../../utils";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";
import { IOMonad } from "../io";

export const _main = (input: unknown[], scope: ScopeStack) => {
  if (input.length !== 2 || !isCallParam(input[0]) || !isCallParam(input[1])) {
    throw new Error('main requires exactly two array arguments');
  }
  const func = input[0];
  const args = input[1];
  if (func[0] !== 'expression' || func[1].some((x) => x[0] !== 'name')) {
    throw new Error('fn requires first argument to be an expression array of symbols');
  }
  if (args[0] !== 'expression' || args[1].some((x) => !x[0])) {
    throw new Error('fn requires second argument to be an expression array of statements');
  }

  const symbols = func[1].map(s => s[1]) as string[];
  const body = args[1];

  return ((args: unknown[], scopeStack: ScopeStack) => {
    symbols.forEach((symbol, index) => scopeStack.set(symbol, args[index]));
    const data = body.map(b => runStatement(b, scopeStack));
    return data[data.length - 1];
  })([new IOMonad()], scope);
};