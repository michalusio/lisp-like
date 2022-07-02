import { ParseFile } from "parser-combinators";
import { resolve, sep } from "path";
import { CallLiteral, root } from "../ast";

let allowedFiles: Set<string>;
let cache: Map<string, CallLiteral[]> = new Map<string, CallLiteral[]>();
let runCache: Map<string, unknown[]> = new Map<string, unknown[]>();

export function init(_allowedFiles: string[]) {
  const allowed = _allowedFiles.map(file => resolve(file).split(sep).join("/"));
  allowedFiles = new Set<string>(allowed);
  loadFiles();
}

export function get(fileName: string): CallLiteral[] {
  if (!allowedFiles.has(fileName)) {
    throw new Error(`File ${fileName} not allowed to be loaded.`);
  }
  console.info(`Loading ${fileName}`);
  return cache.get(fileName)!;
}

export function tryGetRun(fileName: string): [boolean, unknown[]] {
  return [runCache.has(fileName), runCache.get(fileName)!];
}

export function setRun(fileName: string, value: unknown[]) {
  runCache.set(fileName, value);
}

export function getAll(): [string, CallLiteral[]][] {
  const entries: [string, CallLiteral[]][] = [];
  cache.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
}

export function findMain(): [string, number] {
  const mains: [string, number][] = [];
  cache.forEach((value, key) => {
    value.forEach((v, index) => {
      if (v[0] === 'call') {
        const funcName = v[1][0];
        if (funcName[0] === 'name' && funcName[1] === 'main') {
          mains.push([key, index]);
        }
      }
    });
  });
  if (mains.length === 0) {
    throw new Error('No main specified');
  } else if (mains.length === 1) {
    return mains[0];
  } else {
    throw new Error('Multiple mains specified');
  }
}

function loadFiles() {
  allowedFiles.forEach(fileName => {
    cache.set(fileName, ParseFile(fileName, root));
  });
}