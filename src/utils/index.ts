import { CallParam } from "../ast";

type Flavoring<FlavorT> = { _type?: FlavorT; };
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

type Branding<BrandT> = { _type: BrandT; };
export type Brand<T, BrandT> = T & Branding<BrandT>;

export function isCallParam(param: any): param is CallParam {
  return param && Array.isArray(param) && param.length === 2 && typeof param[0] === 'string';
}