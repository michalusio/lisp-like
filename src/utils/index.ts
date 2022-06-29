type Flavoring<FlavorT> = { _type?: FlavorT; };
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

type Branding<BrandT> = { _type: BrandT; };
export type Brand<T, BrandT> = T & Branding<BrandT>;