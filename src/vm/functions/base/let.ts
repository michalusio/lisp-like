import { CallParam } from "../../../ast";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const _let = (args: any[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !Array.isArray(args[0])) {
    throw new Error('let requires exactly one array argument');
  }
  if (args[0].length !== 2) {
    throw new Error('let requires exactly two elements in the array argument');
  }
  const [nameRef, valueRef] = args[0] as [CallParam, CallParam];
  let name = '';
  switch(nameRef.type) {
    case 'string':
      name = nameRef.value;
      break;
    case 'name':
      name = nameRef.value;
      break;
    default:
      name = runStatement(nameRef, scopeStack) + '';
      break;
  }
  const value = runStatement(valueRef, scopeStack);
  scopeStack.setTo(name, value, scopeStack.getLevel() - 1);
};

export const letScope = (args: any[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !Array.isArray(args[0])) {
    throw new Error('let-scope requires exactly one array argument');
  }
  if (args[0].length !== 3) {
    throw new Error('let-scope requires exactly three elements in the array argument');
  }
  const [nameRef, valueRef, scopeLevelRef] = args[0] as [CallParam, CallParam, CallParam];
  let name = '';
  switch(nameRef.type) {
    case 'string':
      name = nameRef.value;
      break;
    case 'name':
      name = nameRef.value;
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