import { CallParam } from "../../../ast";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const fn = (input: unknown[], outerStack: ScopeStack) => {
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

  const otherSymbols: string[] = [];
  getAllSymbols(body).forEach(s => {
    if (!symbols.includes(s)) {
      otherSymbols.push(s);
    }
  });

  const otherValues = otherSymbols
    .map(s => [s, outerStack.get(s)] as [string, unknown]);

  return (args: unknown[], scopeStack: ScopeStack) => {
    otherValues.forEach(([symbol, value]) => scopeStack.set(symbol, value));
    symbols.forEach((symbol, index) => scopeStack.set(symbol, args[index]));
    const data = body.map(b => runStatement(b, scopeStack));
    return data[data.length - 1];
  }
};

export function getAllSymbols(body: CallParam[], symbols?: Set<string>): Set<string> {
  symbols ??= new Set<string>();
  body.forEach(b => {
    switch (b[0]) {
      case 'name':
        symbols!.add(b[1]);
        break;

      case 'array':
      case 'expression':
      case 'call':
        getAllSymbols(b[1], symbols);
        break;

      case 'spread': {
        const value = b[1];
        getAllSymbols(value[1], symbols);
        break;
      }
    }
  });
  return symbols;
}

