import { ScopeStack } from "../../scope";

export const log = (args: unknown[], _: ScopeStack) => {
  console.log(...args.map(a => a + ''));
};