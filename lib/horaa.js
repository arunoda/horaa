/**

 The MIT License

 Copyright (c) 2011 Arunoda Susiripala

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */

/**
 * @class
 */
function Horaa(moduleName) {

    var mod = require(moduleName);
    var originalMethods = {};
    var hijackMethods = {};

    this.isHijacked = function(method) {
        return originalMethods[method] ? true : false;
    };

    this.methodExists = function(method) {
        return mod[method] ? true : false;
    };

    /**
     * Hijack the @method and replace it with @replacement
     *
     * @param {string} method - existing method in the module we need to replace
     * @param {string} replacement - replacement for the above method
     * @throws {Error} if no such method exists
     */
    this.hijack = function(method, replacement) {

        if (this.methodExists(method)) {
            if (!this.isHijacked(method)) {
                originalMethods[method] = mod[method];
            }

            mod[method] = replacement;
        } else {
            throw new Error('Method: ' + method + ' does not exist in module: ' + moduleName);
        }
    };

    /**
     * Restore previously hijacked methods
     *
     * @param {string} method - name of the method we need to restore
     * @throws {Error} if @method was not hijacked earlier
     */
    this.restore = function(method) {

        if(this.isHijacked([method])) {
            mod[method] = originalMethods[method];
            delete originalMethods[method];
        } else {
            throw new Error('Method: ' + method + ' is not hijacked to restore');
        }
    };
}

var cache = {};

/**
 * Create a new Horaa instance for @moduleName and return.
 */
var horaa = function(moduleName) {
    if(!cache[moduleName]) {
        cache[moduleName] = new Horaa(moduleName);
    }
    return cache[moduleName];
};

module.exports = horaa;
