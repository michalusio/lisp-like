import { any, between, boolP, expect, intP, map, oneOrMany, opt, realP, ref, regex, seq, str, wspaces, zeroOrMany } from 'parser-combinators/parsers';
import { Context, Parser } from 'parser-combinators/types';
import { Brand } from '../utils';

export type Name = Brand<string, 'name literal'>;

export type CallParam = StringLiteral | NumberLiteral | BooleanLiteral | NameLiteral | ExpressionLiteral | ArrayLiteral | CallLiteral | SpreadLiteral;

export type StringLiteral = Readonly<['string', string]>;

export type NumberLiteral = Readonly<['number', number]>;

export type BooleanLiteral = Readonly<['boolean', boolean]>;

export type NameLiteral = Readonly<['name', Name]>;

export type SpreadLiteral = Readonly<['spread', ExpressionLiteral | ArrayLiteral | CallLiteral | NameLiteral]>;

export type ExpressionLiteral = Readonly<['expression', Array<CallParam>]>;

export type ArrayLiteral = Readonly<['array', Array<CallParam>]>;

export type CallLiteral = Readonly<['call', Array<CallParam>]>;

export type CommentLiteral = Readonly<['comment']>;

const stringLiteral = map(
  between(str('"'), regex(/(?:\.|(\\\")|[^\""\n])*/, "string literal"), str('"')),
  value => (['string', value ] as StringLiteral)
);
const comment = map(any(
  regex(/\/\/[\t \S]*/gm, 'comment'),
  regex(/\/\*[\s\S]*?\*\//gm, 'comment')
  ), () => (['comment' ] as CommentLiteral));
const numberLiteral = map(seq(opt(str('-')), any(intP, realP)), ([minusSign, value]) => (['number', minusSign ? -value : value ] as NumberLiteral));
const booleanLiteral = map(boolP, value => (['boolean', value ] as BooleanLiteral));
const nameLiteral = map(regex(/[a-zA-Z_+\-*/<=>][a-zA-Z0-9_+\-*/<=>?]*/, "name literal"), value => (['name', value as Name ] as NameLiteral));

const callParam = any(stringLiteral, numberLiteral, booleanLiteral, comment, nameLiteral, expression(), array(), call());

const whitespace = regex(/(?:\s|\t|\n|\r)+/g, "whitespace");

const manyParams = map(zeroOrMany(callParam, whitespace), a => a.filter(x => x[0] !== 'comment'));

const arrayManyParams = map(zeroOrMany(
  map(seq(opt(str('...')), callParam), ([spread, value]) => (spread ? ['spread', value ] as SpreadLiteral : value)),
  whitespace
), a => a.filter(x => x[0] !== 'comment'));

const expressionParams = map(manyParams, params => (['expression',
  params,
] as ExpressionLiteral));

const arrayParams = map(arrayManyParams, params => (['array',
  params,
] as ArrayLiteral));

const callParams = map(manyParams, params => ([
  'call',
  params
] as CallLiteral));

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