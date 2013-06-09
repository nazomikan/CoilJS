Coil
===

[![build status](https://secure.travis-ci.org/nazomikan/CoilJS.png)](http://travis-ci.org/nazomikan/CoilJS)

## Description

Coil is a simple library to control the flow.


## Usage

On server install Coil via npm first

    npm install tube

and then include it in your project with:

    var myCoil = require('coil').create();


## api

### coil#use(task1, task2..)
function to make it processing in pipeline can be registered.

task to make it processing in parallel is realizable by passing more than one as an argument at once.


### coil#handle(arg1, arg2,…arg[x-1], callback);
The argument from arg1 to arg[x-1] is set to the registered tasks.

callback has the argument from arg1 to arg[x-1] and error which were passed to handle set, and is called after an end of task.


## Example
The following codes are the examples of the module which changes the parameter in pipeline.

    var paramConverter = require('coil').create()
      , model = require('some/data/access/object')
      ;

    paramConverter.use(convertA);
    paramConverter.use(convertB);
    paramConverter.use(convertC);
    paramConverter.use(convertD);

    exports.handle = function (param, callback) {
      paramConverter.handle(param. callback);
    };

    function convertA(param, next) {
      model.get('A', function (err, data) {
        param.a = data;
        next(err);
      });
    }

    function convertB(param, next) {
      model.get('B', function (err, data) {
        param.b = data;
        next(err);
      });
    }

    // …


Registration of processing can also be performed in parallel.

    var paramConverter = require('coil').create()
      , model = require('some/data/access/object')
      ;

    paramConverter.use(convertA);
    paramConverter.use(convertB, convertC); // parallel call
    paramConverter.use(convertD);

    exports.handle = function (param, callback) {
      paramConverter.handle(param. callback);
    };

    function convertA(param, next) {
      model.get('A', function (err, data) {
        param.a = data;
        next(err);
      });
    }

    function convertB(param, next) {
      model.get('B', function (err, data) {
        param.b = data;
        next(err);
      });
    }

    // …


