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
  switch (expr.type) {
    case 'boolean':
      return expr.value ? 'true' : 'false';
    case 'number':
      return expr.value.toString();
    case 'string':
      return expr.value;
    case 'name':
      return expr.value;
    default:
      throw new Error('nameof requires exactly one expression-like argument');
  }
};