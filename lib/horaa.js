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
  create a new Horaa for the @moduleName and return
*/
var cache = {};
module.exports = function(moduleName) {

  if(!cache[moduleName]) {
    cache[moduleName] = new Horaa(moduleName);
  }

  return cache[moduleName];
};

function Horaa(moduleName) {

  var mod = require(moduleName);
  var originalMethods = {};
  var hijackMethods = {};

  /**
    Hijack the @method and replace it with @replacement

    @param method - existing method in the module we need to replace
    @param replacement - replacement for the above method
    @throws Error if there is no such method exits
  */
  this.hijack = function(method, replacement) {

    if(mod[method]) {
      //if method exists

      if(!originalMethods[method]) {
        //if not in hijacked mode
        originalMethods[method] = mod[method];
      }

      mod[method] = replacement;
    } else {
      //if method not exists

      throw new Error('Method: ' + method + ' is not exists in the module: ' + moduleName);
    }
  };

  /**
    Restore previously hijacked methods

    @param method - name of the method we need to restore
    @throws Error if @method was not hijacked earlier
  */
  this.restore = function(method) {

    if(originalMethods[method]) {
      //if it's hijacked method
      mod[method] = originalMethods[method];
      delete originalMethods[method];
    } else {
      //if this was not hijacked
      throw new Error('Method: ' + method + ' is not hijacked to restore');
    }
  };
}
