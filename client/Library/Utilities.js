meta = {
    "class": "Utilities",
    "public": ["object", "array", "test"]
}
init = function() {
    
}

o.object = {};
o.object.each = function(object, fn, scope) {
/**
* Iterates through an object and invokes the given callback function for each iteration.
* The iteration can be stopped by returning `false` in the callback function. For example:
*
*     var person = {
*         name: 'Jacky'
*         hairColor: 'black'
*         loves: ['food', 'sleeping', 'wife']
*     };
*
*     Ext.Object.each(person, function(key, value, myself) {
*         console.log(key + ":" + value);
*
*         if (key === 'hairColor') {
*             return false; // stop the iteration
*         }
*     });
*
* @param {Object} object The object to iterate
* @param {Function} fn The callback function.
* @param {String} fn.key
* @param {Object} fn.value
* @param {Object} fn.object The object itself
* @param {Object} [scope] The execution scope (`this`) of the callback function
*/
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            if (fn.call(scope || object, property, object[property], object) === false) {
                return;
            }
        }
    }
};
o.object.clone = function(item) {
/**
 * Clone almost any type of variable including array, object, DOM nodes and Date without keeping the old reference
 * @param {Object} item The variable to clone
 * @return {Object} clone
 */

    if (item === null || item === undefined) {
        return item;
    }

    // DOM nodes
    // TODO proxy this to Ext.Element.clone to handle automatic id attribute changing
    // recursively
    if (item.nodeType && item.cloneNode) {
        return item.cloneNode(true);
    }

    var type = toString.call(item);

    // Date
    if (type === '[object Date]') {
        return new Date(item.getTime());
    }

    var i, j, k, clone, key;

    // Array
    if (type === '[object Array]') {
        i = item.length;

        clone = [];

        while (i--) {
            clone[i] = o.object.clone(item[i]);
        }
    }
    // Object
    else if (type === '[object Object]' && item.constructor === Object) {
        clone = {};

        for (key in item) {
            clone[key] = o.object.clone(item[key]);
        }

        if (enumerables) {
            for (j = enumerables.length; j--;) {
                k = enumerables[j];
                clone[k] = item[k];
            }
        }
    }

    return clone || item;
};
o.object.apply = function(object, config, defaults) {
/**
 * Copies all the properties of config to the specified object.
 * Note that if recursive merging and cloning without referencing the original objects / arrays is needed, use
 * {@link Ext.Object#merge} instead.
 * @param {Object} object The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 */
    if (defaults) {
        o.object.apply(object, defaults);
    }

    if (object && config && typeof config === 'object') {
        var i, j, k;

        for (i in config) {
            object[i] = config[i];
        }

        if (enumerables) {
            for (j = enumerables.length; j--;) {
                k = enumerables[j];
                if (config.hasOwnProperty(k)) {
                    object[k] = config[k];
                }
            }
        }
    }

    return object;
}
o.object.applyIf = function(object, config) {
/**
 * Copies all the properties of config to object if they don't already exist.
 * @param {Object} object The receiver of the properties
 * @param {Object} config The source of the properties
 * @return {Object} returns obj
 */
    var property;

    if (object) {
        for (property in config) {
            if (object[property] === undefined) {
                object[property] = config[property];
            }
        }
    }

    return object;
};
o.object.merge = function(source, key, value) {
/**
 * Merges any number of objects recursively without referencing them or their children.
 *
 *     var extjs = {
 *         companyName: 'Ext JS',
 *         products: ['Ext JS', 'Ext GWT', 'Ext Designer'],
 *         isSuperCool: true
 *         office: {
 *             size: 2000,
 *             location: 'Palo Alto',
 *             isFun: true
 *         }
 *     };
 *
 *     var newStuff = {
 *         companyName: 'Sencha Inc.',
 *         products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
 *         office: {
 *             size: 40000,
 *             location: 'Redwood City'
 *         }
 *     };
 *
 *     var sencha = Ext.Object.merge(extjs, newStuff);
 *
 *     // extjs and sencha then equals to
 *     {
 *         companyName: 'Sencha Inc.',
 *         products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
 *         isSuperCool: true
 *         office: {
 *             size: 30000,
 *             location: 'Redwood City'
 *             isFun: true
 *         }
 *     }
 *
 * @param {Object...} object Any number of objects to merge.
 * @return {Object} merged The object that is created as a result of merging all the objects passed in.
 */
    if (typeof key === 'string') {
        if (value && value.constructor === Object) {
            if (source[key] && source[key].constructor === Object) {
                o.object.merge(source[key], value);
            }
            else {
                source[key] = o.object.clone(value);
            }
        }
        else {
            source[key] = value;
        }

        return source;
    }

    var i = 1,
        ln = arguments.length,
        object, property;

    for (; i < ln; i++) {
        object = arguments[i];

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                o.object.merge(source, property, object[property]);
            }
        }
    }

    return source;
}

o.array = {};
o.array.indexOf = function(array, item, from) {
/**
 * Get the index of the provided `item` in the given `array`, a supplement for the
 * missing arrayPrototype.indexOf in Internet Explorer.
 *
 * @param {Array} array The array to check
 * @param {Object} item The item to look for
 * @param {Number} from (Optional) The index at which to begin the search
 * @return {Number} The index of item in the array (or -1 if it is not found)
 */

    if ('indexOf' in Array.prototype) {
        return array.indexOf(item, from);
    }

    var i, length = array.length;

    for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
        if (array[i] === item) {
            return i;
        }
    }

    return -1;
};
o.array.contains = function(array, item) {
/**
 * Checks whether or not the given `array` contains the specified `item`
 *
 * @param {Array} array The array to check
 * @param {Object} item The item to look for
 * @return {Boolean} True if the array contains the item, false otherwise
 */

    if ('indexOf' in Array.prototype) {
        return array.indexOf(item) !== -1;
    }

    var i, ln;

    for (i = 0, ln = array.length; i < ln; i++) {
        if (array[i] === item) {
            return true;
        }
    }

    return false;

}
o.array.clone = function(array) {
/**
 * Clone a flat array without referencing the previous one. Note that this is different
 * from Ext.clone since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
 * for Array.prototype.slice.call(array)
 *
 * @param {Array} array The array
 * @return {Array} The clone array
 */

    return slice.call(array);

};
o.array.map = function(array, fn, scope) {
/**
 * Creates a new array with the results of calling a provided function on every element in this array.
 *
 * @param {Array} array
 * @param {Function} fn Callback function for each item
 * @param {Object} scope Callback function scope
 * @return {Array} results
 */

    if ('map' in Array.prototype) {
        return array.map(fn, scope);
    }

    var results = [],
        i = 0,
        len = array.length;

    for (; i < len; i++) {
        results[i] = fn.call(scope, array[i], i, array);
    }

    return results;

};
o.array.merge = function() {
/**
 * Merge multiple arrays into one with unique items.
 *
 * {@link Ext.Array#union} is alias for {@link Ext.Array#merge}
 *
 * @param {Array} array1
 * @param {Array} array2
 * @param {Array} etc
 * @return {Array} merged
 */

    var args = slice.call(arguments),
        array = [],
        i, ln;

    for (i = 0, ln = args.length; i < ln; i++) {
        array = array.concat(args[i]);
    }

    return o.array.unique(array);
};
o.array.intersect = function() {
/**
 * Merge multiple arrays into one with unique items that exist in all of the arrays.
 *
 * @param {Array} array1
 * @param {Array} array2
 * @param {Array} etc
 * @return {Array} intersect
 */

    var intersect = [],
        arrays = slice.call(arguments),
        i, j, k, minArray, array, x, y, ln, arraysLn, arrayLn;

    if (!arrays.length) {
        return intersect;
    }

    // Find the smallest array
    for (i = x = 0,ln = arrays.length; i < ln,array = arrays[i]; i++) {
        if (!minArray || array.length < minArray.length) {
            minArray = array;
            x = i;
        }
    }

    minArray = o.array.unique(minArray);
    erase(arrays, x, 1);

    // Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
    // an item in the small array, we're likely to find it before reaching the end
    // of the inner loop and can terminate the search early.
    for (i = 0,ln = minArray.length; i < ln,x = minArray[i]; i++) {
        var count = 0;

        for (j = 0,arraysLn = arrays.length; j < arraysLn,array = arrays[j]; j++) {
            for (k = 0,arrayLn = array.length; k < arrayLn,y = array[k]; k++) {
                if (x === y) {
                    count++;
                    break;
                }
            }
        }

        if (count === arraysLn) {
            intersect.push(x);
        }
    }

    return intersect;
};
o.array.difference = function(arrayA, arrayB) {
/**
 * Perform a set difference A-B by subtracting all items in array B from array A.
 *
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @return {Array} difference
 */

    var clone = slice.call(arrayA),
        ln = clone.length,
        i, j, lnB;

    for (i = 0,lnB = arrayB.length; i < lnB; i++) {
        for (j = 0; j < ln; j++) {
            if (clone[j] === arrayB[i]) {
                erase(clone, j, 1);
                j--;
                ln--;
            }
        }
    }

    return clone;
};
o.array.min = function(array, comparisonFn) {
/**
 * Returns the minimum value in the Array.
 *
 * @param {Array/NodeList} array The Array from which to select the minimum value.
 * @param {Function} comparisonFn (optional) a function to perform the comparision which determines minimization.
 * If omitted the "<" operator will be used. Note: gt = 1; eq = 0; lt = -1
 * @return {Object} minValue The minimum value
 */

    var min = array[0],
        i, ln, item;

    for (i = 0, ln = array.length; i < ln; i++) {
        item = array[i];

        if (comparisonFn) {
            if (comparisonFn(min, item) === 1) {
                min = item;
            }
        }
        else {
            if (item < min) {
                min = item;
            }
        }
    }

    return min;
};
o.array.max = function(array, comparisonFn) {
/**
 * Returns the maximum value in the Array.
 *
 * @param {Array/NodeList} array The Array from which to select the maximum value.
 * @param {Function} comparisonFn (optional) a function to perform the comparision which determines maximization.
 * If omitted the ">" operator will be used. Note: gt = 1; eq = 0; lt = -1
 * @return {Object} maxValue The maximum value
 */

    var max = array[0],
        i, ln, item;

    for (i = 0, ln = array.length; i < ln; i++) {
        item = array[i];

        if (comparisonFn) {
            if (comparisonFn(max, item) === -1) {
                max = item;
            }
        }
        else {
            if (item > max) {
                max = item;
            }
        }
    }

    return max;
};
o.array.unique = function(array) {
/**
 * Returns a new array with unique items
 *
 * @param {Array} array
 * @return {Array} results
 */

    var clone = [],
        i = 0,
        ln = array.length,
        item;

    for (; i < ln; i++) {
        item = array[i];

        if (o.array.indexOf(clone, item) === -1) {
            clone.push(item);
        }
    }

    return clone;
};
o.array.filter = function(array, fn, scope) {
/**
 * Creates a new array with all of the elements of this array for which
 * the provided filtering function returns true.
 *
 * @param {Array} array
 * @param {Function} fn Callback function for each item
 * @param {Object} scope Callback function scope
 * @return {Array} results
 */

    if ('filter' in Array.prototype) {
        return array.filter(fn, scope);
    }

    var results = [],
        i = 0,
        ln = array.length;

    for (; i < ln; i++) {
        if (fn.call(scope, array[i], i, array)) {
            results.push(array[i]);
        }
    }

    return results;
};

o.test = {};
o.test.isEmpty = function(value, allowEmptyString) {
/**
 * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
 *
 * - `null`
 * - `undefined`
 * - a zero-length array
 * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
 *
 * @param {Object} value The value to test
 * @param {Boolean} allowEmptyString (optional) true to allow empty strings (defaults to false)
 * @return {Boolean}
 * @markdown
 */
    return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (o.test.isArray(value) && value.length === 0);
};
o.test.isArray = (function() {
/**
 * Returns true if the passed value is a JavaScript Array, false otherwise.
 *
 * @param {Object} target The target to test
 * @return {Boolean}
 * @method
 */

    return ('isArray' in Array) ? 
    Array.isArray : 
    function(value) {
        return toString.call(value) === '[object Array]';
    }

})();
o.test.isDate = function(value) {
/**
 * Returns true if the passed value is a JavaScript Date object, false otherwise.
 * @param {Object} object The object to test
 * @return {Boolean}
 */
    return toString.call(value) === '[object Date]';
};
o.test.isObject = (function() {
/**
 * Returns true if the passed value is a JavaScript Object, false otherwise.
 * @param {Object} value The value to test
 * @return {Boolean}
 * @method
 */

    return (toString.call(null) === '[object Object]') ?
    function(value) {
        // check ownerDocument here as well to exclude DOM nodes
        return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
    } :
    function(value) {
        return toString.call(value) === '[object Object]';
    };

})();
o.test.isPrimitive = function(value) {
/**
 * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
 * @param {Object} value The value to test
 * @return {Boolean}
 */

    var type = typeof value;

    return type === 'string' || type === 'number' || type === 'boolean';
};
o.test.isFunction = (function() {
/**
 * Returns true if the passed value is a JavaScript Function, false otherwise.
 * @param {Object} value The value to test
 * @return {Boolean}
 * @method
 */

    // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
    // Object.prorotype.toString (slower)
    return (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? 
    function(value) {

        return toString.call(value) === '[object Function]';
    } : 
    function(value) {
        return typeof value === 'function';
    };


})();
o.test.isNumber = function(value) {
/**
 * Returns true if the passed value is a number. Returns false for non-finite numbers.
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return typeof value === 'number' && isFinite(value);
};
o.test.isNumeric = function(value) {
/**
 * Validates that a value is numeric.
 * @param {Object} value Examples: 1, '1', '2.34'
 * @return {Boolean} True if numeric, false otherwise
 */
    return !isNaN(parseFloat(value)) && isFinite(value);
};
o.test.isString = function(value) {
/**
 * Returns true if the passed value is a string.
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return typeof value === 'string';
};
o.test.isBoolean = function(value) {
/**
 * Returns true if the passed value is a boolean.
 *
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return typeof value === 'boolean';
};
o.test.isElement = function(value) {
/**
 * Returns true if the passed value is an HTMLElement
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return value ? value.nodeType === 1 : false;
};
o.test.isTextNode = function(value) {
/**
 * Returns true if the passed value is a TextNode
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return value ? value.nodeName === "#text" : false;
};
o.test.isDefined = function(value) {
/**
 * Returns true if the passed value is defined.
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return typeof value !== 'undefined';
};
o.test.isIterable = function(value) {
/**
 * Returns true if the passed value is iterable, false otherwise
 * @param {Object} value The value to test
 * @return {Boolean}
 */
    return (value && typeof value !== 'string') ? value.length !== undefined : false;
};


