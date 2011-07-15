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

var horaa = require('horaa');

exports.testReplace = function(test) {
	
	var os = require('os');
	var realValue = os.type();

	var osHoraa = horaa('os');
	osHoraa.hijack('type', function() {
		return 'pissek';
	});

	test.ok(os.type() == 'pissek');

	osHoraa.restore('type');

	test.ok(os.type() == realValue);

	test.done();
};

exports.testReplaceTwice = function(test) {
	
	var os = require('os');
	var realValue = os.type();

	var osHoraa = horaa('os');
	osHoraa.hijack('type', function() {
		return 'pissek';
	});
	test.ok(os.type() == 'pissek');

	osHoraa.hijack('type', function() {
		return 'modayek';
	});
	test.ok(os.type() == 'modayek');

	osHoraa.restore('type');

	test.ok(os.type() == realValue);

	test.done();
};

exports.testHijackNotExistingMethod = function(test) {
	
	var os = require('os');
	var realValue = os.type();

	var osHoraa = horaa('os');
	test.throws(function() {
		osHoraa.hijack('dsds', function() {});
	});

	test.done();
};

exports.testRestoreNotHijackedMethod = function(test) {
	
	var os = require('os');
	var realValue = os.type();

	var osHoraa = horaa('os');
	test.throws(function() {
		osHoraa.restore('dsds');
	});

	test.done();
};

exports.testWithoutObjectCreation = function(test) {
	
	var os = require('os');
	var realValue = os.type();

	var osHoraa = horaa('os');
	horaa('os').hijack('type', function() {
		return 'pissek';
	});

	test.ok(os.type() == 'pissek');

	horaa('os').restore('type');

	test.ok(os.type() == realValue);

	test.done();
};