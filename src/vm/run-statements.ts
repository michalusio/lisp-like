import { CallParam } from "../ast";
import { ScopeStack } from "./scope";

export function runStatement(statement: CallParam, scopeStack: ScopeStack): unknown {
  switch (statement[0]) {
    case 'call': {
      const [value, ...args] = statement[1];
      const func = runStatement(value, scopeStack);
      if (!func) {
        throw new Error(`Function ${value} not found`);
      }
      if (typeof func !== 'function') {
        throw new Error(`${JSON.stringify(value)} is not a function`);
      }
      scopeStack.pushNew();
      const runArgs = args.map(arg => runStatement(arg, scopeStack));
      const funcResult = func(runArgs, scopeStack);
      scopeStack.pop();
      return funcResult;
    }
    case 'name': {
      const value = scopeStack.get(statement[1]);
      if (value != null) {
        return value;
      } else {
        throw new Error(`Variable ${value} not found`);
      }
    }
    case 'boolean':
    case 'number':
    case 'string':
      return statement[1];
    case 'expression':
      return statement;
    case 'array': return statement[1].flatMap(arg => arg[0] === 'spread' ? runStatement(arg[1], scopeStack) : [runStatement(arg, scopeStack)]);
    case 'spread': return runStatement(statement[1], scopeStack);

    default: {
      const _: never = statement;
      throw new Error(JSON.stringify(_));
    }
  }
}