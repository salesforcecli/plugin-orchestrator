/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Export types for schema generation
export type StringType = string;
export type NumberType = number;
export type BooleanType = boolean;
export type ObjectType = Record<string, unknown>;
export type ArrayType<T = unknown> = T[];

// For schema generation - primitive type exports
export { StringType as string };
export { NumberType as number };
export { BooleanType as boolean };
export { ObjectType as object };
export { ArrayType as array };

export default {};
