import { resolve, sep, dirname } from "path";
import { get, setRun, tryGetRun } from "../../file-cache";
import { runStatement } from "../../run-statements";
import { RunType } from "../../runtype";
import { ScopeStack } from "../../scope";

export const load = (args: RunType[], scopeStack: ScopeStack) => {
  if (typeof args[0] !== 'string' || args.length !== 1) {
    throw new Error(`Invalid body of loadFile function`);
  }
  const cwd = scopeStack.get("_cwd");
  if (typeof cwd !== 'string') {
    throw new Error(`Cannot load file without a string cwd`);
  }
  const resolvedPath = resolve(cwd, args[0]).split(sep).join("/");
  let [isData, data] = tryGetRun(resolvedPath);
  if (!isData) {
    scopeStack.set("_cwd", dirname(resolvedPath));
    data = get(resolvedPath).map(v => runStatement(v, scopeStack));
    setRun(resolvedPath, data);
  }
  return data;
};