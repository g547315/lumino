/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  ReadonlyJSONValue
} from '@phosphor/coreutils';

import {
  IList
} from './list';

import {
  IMap
} from './map';

import {
  IText
} from './text';


/**
 * An abstract base class for framework-defined fields.
 *
 * #### Notes
 * A data store does not support user-defined fields.
 */
export
abstract class BaseField<UpdateType, RuntimeType, ChangeType> {
  /**
   * Construct a new base field.
   *
   * @param options - The options for initializing the field.
   */
  constructor(options: BaseField.IOptions = {}) { }

  /**
   * The discriminated type of the field.
   */
  abstract readonly type: 'value' | 'list' | 'map' | 'text';

  /**
   * The update type for the field.
   *
   * #### Notes
   * This is an internal property which is only used to support the
   * type system. The runtime value of this property is undefined.
   */
  readonly '@@UpdateType': UpdateType;

  /**
   * The runtime type for the field.
   *
   * #### Notes
   * This is an internal property which is only used to support the
   * type system. The runtime value of this property is undefined.
   */
  readonly '@@RuntimeType': RuntimeType;

  /**
   * The change type for the field.
   *
   * #### Notes
   * This is an internal property which is only used to support the
   * type system. The runtime value of this property is undefined.
   */
  readonly '@@ChangeType': ChangeType;
}


/**
 * The namespace for the `BaseField` class statics.
 */
export
namespace BaseField {
  /**
   * An options object for initializing a base field.
   */
  export
  interface IOptions { }
}


/**
 * A field which represents a readonly JSON value.
 */
export
class ValueField<T extends ReadonlyJSONValue = ReadonlyJSONValue> extends BaseField<T, T, ValueField.IChange<T>> {
  /**
   * Construct a new value field.
   *
   * @param options - The options for initializing the field.
   */
  constructor(options: ValueField.IOptions<T>) {
    super(options);
    this.defaultValue = options.defaultValue;
  }

  /**
   * The discriminated type of the field.
   */
  get type(): 'value' {
    return 'value';
  }

  /**
   * The default value for the field.
   */
  readonly defaultValue: T;
}


/**
 * The namespace for the `ValueField` class statics.
 */
export
namespace ValueField {
  /**
   * An options object for initializing a value field.
   */
  export
  interface IOptions<T extends ReadonlyJSONValue> extends BaseField.IOptions {
    /**
     * The default value for the field.
     */
    defaultValue: T;
  }

  /**
   * The change type for a value field.
   */
  export
  interface IChange<T extends ReadonlyJSONValue> {
    /**
     * The old value of the field.
     */
    oldValue: T;

    /**
     * The new value of the field.
     */
    newValue: T;
  }
}


/**
 * A field which represents a mutable sequence of values.
 */
export
class ListField<T extends ReadonlyJSONValue = ReadonlyJSONValue> extends BaseField<ReadonlyArray<T>, IList<T>, ListField.IChange<T>> {
  /**
   * Construct a new list field.
   *
   * @param options - The options for initializing the field.
   */
  constructor(options: ListField.IOptions<T> = {}) {
    super(options);
    this.defaultValue = options.defaultValue || [];
  }

  /**
   * The discriminated type of the field.
   */
  get type(): 'list' {
    return 'list';
  }

  /**
   * The default value for the field.
   */
  readonly defaultValue: ReadonlyArray<T>;
}


/**
 * The namespace for the `ListField` class statics.
 */
export
namespace ListField {
  /**
   * An options object for initializing a list field.
   */
  export
  interface IOptions<T extends ReadonlyJSONValue> extends BaseField.IOptions {
    /**
     * The default value for the field.
     *
     * The default is an empty array.
     */
    defaultValue?: ReadonlyArray<T>;
  }

  /**
   * The change type for a list field.
   */
  export
  interface IChange<T extends ReadonlyJSONValue> {
    /**
     * The index of the modification.
     */
    readonly index: number;

    /**
     * The value removed at the given index.
     */
    readonly removedValues: ReadonlyArray<T>;

    /**
     * The value inserted at the given index.
     */
    readonly insertedValues: ReadonlyArray<T>;
  }
}


/**
 * A field which represents a mutable map of values.
 */
export
class MapField<T extends ReadonlyJSONValue = ReadonlyJSONValue> extends BaseField<{ readonly [key: string]: T }, IMap<T>, MapField.IChange<T>> {
  /**
   * Construct a new map field.
   *
   * @param options - The options for initializing the field.
   */
  constructor(options: MapField.IOptions<T> = {}) {
    super(options);
    this.defaultValue = options.defaultValue || {};
  }

  /**
   * The discriminated type of the field.
   */
  get type(): 'map' {
    return 'map';
  }

  /**
   * The default value for the field.
   */
  readonly defaultValue: { readonly [key: string]: T };
}


/**
 * The namespace for the `MapField` class statics.
 */
export
namespace MapField {
  /**
   * An options object for initializing a map field.
   */
  export
  interface IOptions<T extends ReadonlyJSONValue> extends BaseField.IOptions {
    /**
     * The default value for the field.
     *
     * The default is an empty object.
     */
    defaultValue?: { readonly [key: string]: T };
  }

  /**
   * The change type for a map field.
   */
  export
  interface IChange<T extends ReadonlyJSONValue> {
    /**
     * The items removed from the map.
     */
    readonly removedItems: { readonly [key: string]: T };

    /**
     * The items added to the map.
     */
    readonly addedItems: { readonly [key: string]: T };
  }
}


/**
 * A field which represents a mutable text value.
 */
export
class TextField extends BaseField<string, IText, TextField.IChange> {
  /**
   * Construct a new text field.
   *
   * @param options - The options for initializing the field.
   */
  constructor(options: TextField.IOptions = {}) {
    super(options);
    this.defaultValue = options.defaultValue || '';
  }

  /**
   * The discriminated type of the field.
   */
  get type(): 'text' {
    return 'text';
  }

  /**
   * The default value for the field.
   */
  readonly defaultValue: string;
}


/**
 * The namespace for the `TextField` class statics.
 */
export
namespace TextField {
  /**
   * An options object for initializing a text field.
   */
  export
  interface IOptions extends BaseField.IOptions {
    /**
     * The default value for the field.
     *
     * The default is an empty string.
     */
    defaultValue?: string;
  }

  /**
   * The change type for a text field.
   */
  export
  interface IChange {
    /**
     * The index of the modification.
     */
    readonly index: number;

    /**
     * The text removed at the given index.
     */
    readonly removedText: string;

    /**
     * The text inserted at the given index.
     */
    readonly insertedText: string;
  }
}


/**
 * A type alias for the field types supported by a data store.
 */
export
type Field = ValueField | ListField | MapField | TextField;


/**
 * A type definition for a schema.
 *
 * #### Notes
 * The combination of schema `name` and `version` number form a unique
 * identifier for the schema.
 *
 * The datastore assumes that peers may safely collaborate on tables
 * which share the same `name` and `version`.
 *
 * The `version` number **must** be incremented whenever changes are
 * made to the fields, or undefined behavior will result.
 */
export
type Schema = {
  /**
   * The unique name for the schema.
   */
  readonly name: string;

  /**
   * The version number of the schema.
   */
  readonly version: number;

  /**
   * The field definitions for the schema.
   */
  readonly fields: { readonly [key: string]: Field };
};
