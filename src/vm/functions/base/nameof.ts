import { isCallParam } from "../../../utils";
import { ScopeStack } from "../../scope";

export const nameof = (input: unknown[], _: ScopeStack): string => {
  if (input.length !== 1 || !isCallParam(input[0])) {
    throw new Error('nameof requires exactly one argument');
  }
  const exprArg = input[0];
  switch (exprArg[0]) {
    case 'boolean':
      return exprArg[1] ? 'true' : 'false';
    case 'number':
      return exprArg[1].toString();
    case 'string':
    case 'name':
      return exprArg[1];
    default:
      throw new Error('nameof requires exactly one expression-like argument');
  }
};