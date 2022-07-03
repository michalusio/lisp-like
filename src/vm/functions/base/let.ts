import { ExpressionLiteral } from "../../../ast";
import { isCallParam } from "../../../utils";
import { runStatement } from "../../run-statements";
import { RunType } from "../../runtype";
import { ScopeStack } from "../../scope";

export const _let = (args: RunType[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !isCallParam(args[0]) || args[0][0] !== 'expression') {
    throw new Error('let requires exactly one expression argument');
  }
  const expr = args[0] as ExpressionLiteral;
  if (expr[1].length !== 2) {
    throw new Error('let requires exactly two elements in the expression argument');
  }
  const [nameRef, valueRef] = expr[1];
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

export const letScope = (args: RunType[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !isCallParam(args[0]) || args[0][0] !== 'expression') {
    throw new Error('let-scope requires exactly one array argument');
  }
  const expr = args[0] as ExpressionLiteral;
  if (expr[1].length !== 3) {
    throw new Error('let-scope requires exactly three elements in the array argument');
  }
  const [nameRef, valueRef, scopeLevelRef] = expr[1];
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

export const getScope = (_: RunType[], scopeStack: ScopeStack) => {
  return scopeStack.getLevel();
};