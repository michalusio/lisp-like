import { CallParam } from "../../../ast";
import { ScopeStack } from "../../scope";

export const nameof: (_: unknown[], __: ScopeStack) => string = (input: unknown[], _: ScopeStack) => {
  if (input.length !== 1) {
    throw new Error('nameof requires exactly one expression argument');
  }
  let expr: CallParam;
  if (Array.isArray(input[0])) {
    [expr] = input[0] as [CallParam];
  } else {
    expr = input[0] as CallParam;
  }
  switch (expr[0]) {
    case 'boolean':
      return expr[1] ? 'true' : 'false';
    case 'number':
      return expr[1].toString();
    case 'string':
    case 'name':
      return expr[1];
    default:
      throw new Error('nameof requires exactly one expression-like argument');
  }
};