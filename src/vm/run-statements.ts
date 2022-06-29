import { CallParam } from "../ast";
import { ScopeStack } from "./scope";

export function runStatement(statement: CallParam, scopeStack: ScopeStack): unknown {
  switch (statement.type) {
    case 'call': {
      const func = runStatement(statement.value, scopeStack);
      if (!func) {
        throw new Error(`Function ${statement.value} not found`);
      }
      if (typeof func !== 'function') {
        throw new Error(`${JSON.stringify(statement.value)} is not a function`);
      }
      scopeStack.pushNew();
      const runArgs = statement.args.map(arg => runStatement(arg, scopeStack));
      const funcResult = func(runArgs, scopeStack);
      scopeStack.pop();
      return funcResult;
    }
    case 'name': {
      const value = scopeStack.get(statement.value);
      if (value != null) {
        return value;
      } else {
        throw new Error(`Variable ${statement.value} not found`);
      }
    }
    case 'boolean':
    case 'number':
    case 'string':
    case 'expression':
      return statement.value;
    case 'array': return statement.value.flatMap(arg => arg.type === 'spread' ? runStatement(arg.value, scopeStack) : [runStatement(arg, scopeStack)]);
    case 'spread': return runStatement(statement.value, scopeStack);

    default: {
      const _: never = statement;
      throw new Error(JSON.stringify(_));
    }
  }
}