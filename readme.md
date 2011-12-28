Horaa - Testing NodeJS Modules
==============================

With the recent development of NodeJS many developers who has worked with other languages starting to love NodeJS. But when they do testing It'll be quite hard for them because of NodeJS's module system.

Specifically, mocking existing( whether core or contributed ) modules will be very tricky. But with *horaa* it's fun to do that.

## Install

  npm install horaa

## Example

### Your Code

    //stored in abc.js
    exports.welcome = function() {
        var os = require('os');

        if(os.type() == 'linux') {
            return 'this is a linux box';
        } else {
            return 'meka nam linux nemei :)';
        }
    };


### Your Test Code (with horaa)

    //stored in test.js
    var horaa = require('horaa');
    var lib = require('./abc'); // your code
    var assert = require('assert');

    //do the hijacking
    var osHoraa = horaa('os');
    osHoraa.hijack('type', function() {
        return 'linux';
    });

    assert.equal(lib.welcome(), 'this is a linux box');

    //restore the method
    osHoraa.restore('type');

## Running Horaa's tests

    npm install .

    make test

## Linting

    make lint

## Docs

    make doc

## License

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
