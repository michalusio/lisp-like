import { any, between, boolP, expect, intP, map, oneOrMany, opt, realP, ref, regex, seq, str, wspaces, zeroOrMany } from 'parser-combinators/parsers';
import { Context, Parser } from 'parser-combinators/types';
import { Brand } from '../utils';

export type Name = Brand<string, 'name literal'>;

export type CallParam = StringLiteral | NumberLiteral | BooleanLiteral | NameLiteral | ExpressionLiteral | ArrayLiteral | CallLiteral | SpreadLiteral;

export type StringLiteral = Readonly<{
  type: 'string',
  value: string,
}>;

export type NumberLiteral = Readonly<{
  type: 'number',
  value: number,
}>;

export type BooleanLiteral = Readonly<{
  type: 'boolean',
  value: boolean,
}>;

export type NameLiteral = Readonly<{
  type: 'name',
  value: Name,
}>;

export type SpreadLiteral = Readonly<{
  type: 'spread',
  value: CallParam,
}>;

export type ExpressionLiteral = Readonly<{
  type: 'expression',
  value: Array<CallParam>,
}>;

export type ArrayLiteral = Readonly<{
  type: 'array',
  value: Array<CallParam>,
}>;

export type CallLiteral = Readonly<{
  type: 'call';
  value: CallParam;
  args: CallParam[];
}>;

export type CommentLiteral = Readonly<{
  type: 'comment';
}>;

const stringLiteral = map(
  between(str('"'), regex(/(?:\.|(\\\")|[^\""\n])*/, "string literal"), str('"')),
  value => ({ type: 'string', value } as StringLiteral)
);
const comment = map(any(
  regex(/\/\/[\t \S]*/gm, 'comment'),
  regex(/\/\*[\s\S]*?\*\//gm, 'comment')
  ), () => ({ type: 'comment' } as CommentLiteral));
const numberLiteral = map(seq(opt(str('-')), any(intP, realP)), ([minusSign, value]) => ({ type: 'number', value: minusSign ? -value : value } as NumberLiteral));
const booleanLiteral = map(boolP, value => ({ type: 'boolean', value } as BooleanLiteral));
const nameLiteral = map(regex(/[a-zA-Z_+\-*/<=>][a-zA-Z0-9_+\-*/<=>?]*/, "name literal"), value => ({ type: 'name', value } as NameLiteral));

const callParam = any(stringLiteral, numberLiteral, booleanLiteral, comment, nameLiteral, expression(), array(), call());

const whitespace = regex(/(?:\s|\t|\n|\r)+/g, "whitespace");

const manyParams = map(zeroOrMany(callParam, whitespace), a => a.filter(x => x.type !== 'comment'));

const arrayManyParams = map(zeroOrMany(
  map(seq(opt(str('...')), callParam), ([spread, value]) => (spread ? { type: 'spread', value } as SpreadLiteral : value)),
  whitespace
), a => a.filter(x => x.type !== 'comment'));

const expressionParams = map(manyParams, params => ({
  type: 'expression',
  value: params,
} as ExpressionLiteral));

const arrayParams = map(arrayManyParams, params => ({
  type: 'array',
  value: params,
} as ArrayLiteral));

const callParams = map(manyParams, params => ({
  type: 'call',
  value: params[0],
  args: params.slice(1)
} as CallLiteral));

function expression(): Parser<ExpressionLiteral> {
  return (ctx: Context) => expect(between(seq(str('{'), wspaces), expressionParams, seq(wspaces, str('}'))), 'expression array')(ctx);
}

function array(): Parser<ArrayLiteral> {
  return (ctx: Context) => expect(between(seq(str('['), wspaces), arrayParams, seq(wspaces, str(']'))), 'array')(ctx);
}

function call(): Parser<CallLiteral> {
  return (ctx: Context) => expect(between(seq(str('('), wspaces), callParams, seq(wspaces, str(')'))), 'function call')(ctx);
}

export const root = between(wspaces,oneOrMany(call(), wspaces), wspaces);