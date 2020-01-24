/**
 * Helpers (Identity).
 * Function returns the identity of the input value.
 *
 * @param T   a
 * @return T   A variable of the type T.
 */
function identity(a) { return a; };

/**
 * Helpers (objectKeys).
 * Function returns the keys of a object.
 *
 * @param Object   object
 * @return [String]   An array of strings that represent all the enumerable properties of the given object..
 */
function objectKeys(object) { Object.keys(object) };

/**
 * Helpers (head).
 * Function returns first item in the list.
 * P.S.: this method should not be used in an empty list.
 *
 * @param [T]   Array of T
 * @return T   the first item in the array.
 */
function head(list) { return clone(list).slice(0, 1).shift(); };

/**
 * Helpers (tail).
 * Function returns tail of a given list.
 *
 * @param [T] list Array of T
 * @return [T]   all items before the first item.
 */
function tail(list) { return clone(list).slice(1); };

/**
 * Helpers (clone).
 * Function returns a new object "cloned" from informed.
 *
 * @param T item   Object of type T
 * @return T   as a new instance.
 */
function clone(item) { return JSON.parse(JSON.stringify(item)); };