import type { Simplify } from '@sabinmarcu/types';

export type InputAndReadonly<T> = (
  | T
  | Readonly<T>
);

export type JSONSchemaPrimitiveTypes = {
  'string': string,
  'boolean': boolean,
  'number': number
};

export type JSONSchemaPrimitiveType = {
  type: keyof JSONSchemaPrimitiveTypes
};

export type JSONSchemaPrimitiveToType<
  Input extends JSONSchemaPrimitiveType,
> = InputAndReadonly<
  JSONSchemaPrimitiveTypes[Input['type']]
>;

export type JSONSchemaArrayType = {
  type: 'array',
  items: JSONSchemaType,
};

export type JSONSchemaArrayToType<
  Input extends JSONSchemaArrayType,
> = InputAndReadonly<
  JSONSchemaToType<Input['items']>[]
>;

export type JSONSchemaObjectType = {
  type: 'object',
  properties?: Record<string, JSONSchemaType>,
  additionalProperties?: JSONSchemaType,
};

export type JSONSchemaObjectToType<
  Input extends JSONSchemaObjectType,
> = InputAndReadonly<(
  & (Input['properties'] extends Record<string, any>
    ? { [Key in keyof Input['properties']]: JSONSchemaToType<Input['properties'][Key]> }
    : unknown
  )
  & (
    Input['additionalProperties'] extends JSONSchemaType
      ? Record<string, JSONSchemaToType<Input['additionalProperties']>>
      : unknown
  )
)>;

export type JSONSchemaType = (
  | JSONSchemaPrimitiveType
  | JSONSchemaArrayType
  | JSONSchemaObjectType
);

export type JSONSchemaToType<
  Input extends JSONSchemaType | Readonly<JSONSchemaType>,
> = Simplify<(
    Input extends JSONSchemaPrimitiveType
      ? JSONSchemaPrimitiveToType<Input>
      : Input extends JSONSchemaArrayType
        ? JSONSchemaArrayToType<Input>
        : Input extends JSONSchemaObjectType
          ? JSONSchemaObjectToType<Input>
          : never
  )>;

