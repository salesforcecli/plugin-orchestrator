/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Global primitive type declarations for schema generation
declare global {
  export type StringType = string;
  export type NumberType = number;
  export type BooleanType = boolean;
  export type ObjectType = Record<string, unknown>;
  export type ArrayType = unknown[];
}

// These exports are for the schema generator
export type StringType = string;
export type NumberType = number;
export type BooleanType = boolean;
export type ObjectType = Record<string, unknown>;
export type ArrayType = unknown[];
