import { CallParam } from "../../../ast";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";
import { IOMonad } from "../io";

export const _main = (input: unknown[], scope: ScopeStack) => {
  if (input.length !== 2 || !Array.isArray(input[0]) || !Array.isArray(input[1])) {
    throw new Error('fn requires exactly two array arguments');
  }
  if (input[0].some(x => typeof x !== 'object' || x.type !== 'name')) {
    throw new Error('fn requires first argument to be an expression array of symbols');
  }
  if (input[1].some(x => typeof x !== 'object' || !x.type)) {
    throw new Error('fn requires second argument to be an expression array of statements');
  }

  const symbols = input[0].map(s => s.value) as string[];
  const body = input[1] as CallParam[];

  return ((args: unknown[], scopeStack: ScopeStack) => {
    symbols.forEach((symbol, index) => scopeStack.set(symbol, args[index]));
    const data = body.map(b => runStatement(b, scopeStack));
    return data[data.length - 1];
  })([new IOMonad()], scope);
};