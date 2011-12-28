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

var assert = require('assert');
var horaa = require('../lib/horaa');
var os = require('os');
var fs = require('fs');
var path = require('path');
var fooPath = path.join(__dirname, 'support/foo.js');
var buzzPath = path.join(__dirname, 'support/buzz.js');
var foo = require(fooPath);

describe('horaa', function() {
    var realValue = os.type();
    var osHoraa;

    describe('methods without callbacks', function(done) {
        beforeEach(function() {
            osHoraa = horaa('os');
            osHoraa.hijack('type', function() {
                return 'fake_os';
            });
        });

        describe('hijack()', function() {
            it('hijacked method returns replacement value', function() {
                assert.ok(os.type() == 'fake_os');
                osHoraa.restore('type');
            });

            describe("when method is hijacked twice", function() {
                it('returns correct value each time', function() {
                    assert.ok(os.type() == 'fake_os');

                    osHoraa.hijack('type', function() {
                        return 'fake_os2';
                    });

                    assert.ok(os.type() == 'fake_os2');

                    osHoraa.restore('type');
                    assert.ok(os.type() == realValue);
                });
            });

            describe("when method doesn't exist", function() {
                it('throws error', function() {
                    assert.throws(function() {
                        osHoraa.hijack('dsds', function() {});
                    });
                });
            });

            it('works without creating objects', function() {
                horaa('os').hijack('type', function() {
                    return 'fake_os';
                });

                assert.ok(os.type() == 'fake_os');

                horaa('os').restore('type');
                assert.ok(os.type() == realValue);
            });
        });

        describe('restore()', function() {
            it('restored method returns original value', function() {
                osHoraa.restore('type');
                assert.ok(os.type() == realValue);
            });

            describe('when restored method not hijacked', function() {
                it('throws error', function() {
                    assert.throws(function() {
                        osHoraa.restore('dsds');
                    });
                });
            });
        });
    });

    describe('methods with callbacks', function(done) {
        var realFileSize;
        var fakeFileSize = 99;
        var fsHoraa;

        describe('hijack()', function(done) {
            beforeEach(function(done) {
                fsHoraa = horaa('fs');
                fs.stat(fooPath, function(err, file_stat) {
                    realFileSize = file_stat.size;

                    fsHoraa.hijack('stat', function(path, cb) {
                        cb(null, {size: fakeFileSize});
                    });

                    done();
                });
            });

            it('hijacked method returns replacement value', function(done) {
                fs.stat(fooPath, function(err, result) {
                    assert.equal(result.size, fakeFileSize);
                    fsHoraa.restore('stat');
                    done();
                });
            });

            describe('restore()', function() {
                it('restored method returns original value', function(done) {
                    fsHoraa.restore('stat');
                    fs.stat(fooPath, function(err, result) {
                        assert.ok(result.size == realFileSize);
                        done();
                    });
                });
            });
        });
    });

    describe('requiring local module', function(done) {
        var fooHoraa;

        describe('hijack()', function(done) {
            beforeEach(function() {
                fooHoraa = horaa(fooPath);
                fooHoraa.hijack('bar', function(cb) {
                    cb(null, 'fake bar');
                });
            });

            it('hijacked method returns replacement value', function(done) {
                foo.bar(function(err, result) {
                    assert.equal(result, 'fake bar');
                    fooHoraa.restore('bar');
                    done();
                });
            });

            describe('restore()', function() {
                it('restored method returns original value', function(done) {
                    fooHoraa.restore('bar');
                    foo.bar(function(err, result) {
                        assert.equal(result, 'real bar');
                        done();
                    });
                });
            });
        });
    });

    // The support/foo.js file requires the support/buzz.js file.
    describe('mocking local dependency', function(done) {
        var buzzHoraa;

        describe('hijack()', function(done) {
            beforeEach(function() {
                buzzHoraa = horaa(buzzPath);
                buzzHoraa.hijack('get', function(cb) {
                    cb(null, 'fake buzz');
                });
            });

            it('hijacked method returns replacement value', function(done) {
                foo.getBuzz(function(err, result) {
                    assert.equal(result, 'fake buzz');
                    buzzHoraa.restore('get');
                    done();
                });
            });

            describe('restore()', function() {
                it('restored method returns original value', function(done) {
                    buzzHoraa.restore('get');
                    foo.getBuzz(function(err, result) {
                        assert.equal(result, 'real buzz');
                        done();
                    });
                });
            });
        });
    });
});
