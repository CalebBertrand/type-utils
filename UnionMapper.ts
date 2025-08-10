/**
 * Intended use is to make each key a subtype of the discriminator type,
 * and each value a specific mapping for that subtype
 * {
 *   "circle": {
 *     "radius": number;
 *   },
 *   "square": {
 *    "area": number;
 *   }
 * }
 */
type UnionMapper<TDiscriminator> = TDiscriminator extends number | string ? Record<TDiscriminator, Record<string, any>> : never;
type MaybeApplyUnionMapper<
  Subtype,
  DiscriminatorValue,
  M extends UnionMapper<any>
> = DiscriminatorValue extends keyof M ? Mapped<Subtype, M[DiscriminatorValue]> : Subtype;

// applies a mapper to a specific type
type Mapped<T, M extends Record<string, any>> = {
  [K in keyof T]: K extends keyof M ? M[K] : T[K];
};


/**
    * Maps a union of types to a new union of types.
    * @param TUnion - The union
    * @param DiscriminatingKey - A key which is required to be common across all the subtypes in the union, and unique among them   
    * @param TMapper - A mapper, which defines optional key mappings for any specified sub-types
    *
    * Example use:
    * type IrNode = MapUnion<
    *   ParseNode,
    *   'type',
    *   {
    *       [ParseNodeType.Text]: {
    *           type: IrNodeType.Text;
    *           body: string;
    *   };
    *   [ParseNodeType.Element]: {
            * type: IrNodeType.Element;
            * body: Array<IrNode>;
    *   };
    * }
    *
    * This results in a type with the same items, but those specific keys for the subtypes are mapped and any other unspecified keys 
    *  are copied from the original union types.
>;*/
export type MapUnion<
  TUnion,
  DiscriminatingKey extends keyof TUnion,
  TMapper extends UnionMapper<TUnion[DiscriminatingKey]>
> = TUnion[DiscriminatingKey] extends string | number
  ? {
      [Discriminator in TUnion[DiscriminatingKey]]: MaybeApplyUnionMapper<
        TUnion & { [K in DiscriminatingKey]: Discriminator },
        Discriminator,
        TMapper
      >;
    }[TUnion[DiscriminatingKey]]
  : never;
