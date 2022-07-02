import { isCallParam } from "../../../utils";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const _let = (args: any[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !isCallParam(args[0]) || args[0][0] !== 'expression') {
    throw new Error('let requires exactly one expression argument');
  }
  if (args[0][1].length !== 2) {
    throw new Error('let requires exactly two elements in the expression argument');
  }
  const [nameRef, valueRef] = args[0][1];
  let name = '';
  switch(nameRef[0]) {
    case 'string':
    case 'name':
      name = nameRef[1];
      break;
    default:
      name = runStatement(nameRef, scopeStack) + '';
      break;
  }
  const value = runStatement(valueRef, scopeStack);
  scopeStack.setTo(name, value, scopeStack.getLevel() - 1);
};

export const letScope = (args: any[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !isCallParam(args[0]) || args[0][0] !== 'expression') {
    throw new Error('let-scope requires exactly one array argument');
  }
  if (args[0][1].length !== 3) {
    throw new Error('let-scope requires exactly three elements in the array argument');
  }
  const [nameRef, valueRef, scopeLevelRef] = args[0][1];
  let name = '';
  switch(nameRef[0]) {
    case 'string':
    case 'name':
      name = nameRef[1];
      break;
    default:
      name = runStatement(nameRef, scopeStack) + '';
      break;
  }
  const value = runStatement(valueRef, scopeStack);
  const scopeLevel = runStatement(scopeLevelRef, scopeStack) as number;
  scopeStack.setTo(name, value, scopeLevel);
};

export const getScope = (_: any[], scopeStack: ScopeStack) => {
  return scopeStack.getLevel();
};