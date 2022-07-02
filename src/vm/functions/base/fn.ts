import { CallParam } from "../../../ast";
import { isCallParam } from "../../../utils";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const fn = (input: unknown[], outerStack: ScopeStack) => {
  if (input.length !== 2 || !isCallParam(input[0]) || !isCallParam(input[1])) {
    throw new Error('fn requires exactly two array arguments');
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
  if (!Array.isArray(body)) {
    console.log(typeof body, body);
  }
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
        getAllSymbols([value], symbols);
        break;
      }
    }
  });
  return symbols;
}

