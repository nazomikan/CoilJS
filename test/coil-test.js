var assert = require('assert')
  , coil = require('../coil')
  ;

describe('CoilJS', function () {
  describe('#create', function () {
    it('return an instance of Coil', function () {
      var myCoil = coil.create()
        ;

      assert.ok(myCoil instanceof coil.Coil);
    });
  });

  describe('#use', function () {
    describe('if it is set the task of single', function () {
      it('should be added to the stack the task in array format', function () {
        var myCoil = coil.create()
         , task1 = function () {}
         , task2 = function () {}
         ;

         myCoil.use(task1);
         myCoil.use(task2);

         assert.ok(myCoil.stack[0] instanceof Array);
         assert.strictEqual(myCoil.stack[0].length, 1);
         assert.strictEqual(myCoil.stack[0][0], task1);
         assert.ok(myCoil.stack[1] instanceof Array);
         assert.strictEqual(myCoil.stack[1].length, 1);
         assert.strictEqual(myCoil.stack[1][0], task2);
      });
    });

    describe('if it is set parallel tasks', function () {
      it('should be added to the stack the task in array format', function () {
        var myCoil = coil.create()
         , task1 = function () {}
         , task2 = function () {}
         ;

         myCoil.use(task1, task2);

         assert.ok(myCoil.stack[0] instanceof Array);
         assert.strictEqual(myCoil.stack[0].length, 2);
         assert.strictEqual(myCoil.stack[0][0], task1);
         assert.strictEqual(myCoil.stack[0][1], task2);
      });
    });
  });

  describe('#handle', function () {
    describe('if a single task that success is set in the series', function () {
      it('should be performed a series of processes waiting for the completion of each task', function (done) {
        var myCoil = coil.create()
          , task1
          , task2
          , task3
          ;

        task1 = function (data, next) { setTimeout(function () { data.a = 1; next(); }, 5); };
        task2 = function (data, next) { setTimeout(function () { data.b = 2; next(); }, 5); };
        task3 = function (data, next) { setTimeout(function () { data.c = 3; next(); }, 5); };

        myCoil.use(task1);
        myCoil.use(task2);
        myCoil.use(task3);

        myCoil.handle({}, function (err, data) {
          assert.equal(err, null);
          assert.strictEqual(data.a, 1);
          assert.strictEqual(data.b, 2);
          assert.strictEqual(data.c, 3);
          done();
        });
      });
    });

    describe('if the task, including the parallel task of success is set in the series', function () {
      it('should be migrated to the next step after waiting the completion of the processing of all the parallel task', function (done) {
        var myCoil = coil.create()
          , task1
          , task2
          , task3
          , task4
          ;

        task1 = function (data, next) { setTimeout(function () { data.a = 1; next(); }, 5); };
        task2 = function (data, next) { setTimeout(function () { data.b = 2; next(); }, 5); };
        task3 = function (data, next) { setTimeout(function () { data.c = 3; next(); }, 30); };
        task4 = function (data, next) { setTimeout(function () { data.d = 4; next(); }, 5); };

        myCoil.use(task1);
        myCoil.use(task2, task3);
        myCoil.use(task4);

        myCoil.handle({}, function (err, data) {
          assert.equal(err, null);
          assert.strictEqual(data.a, 1);
          assert.strictEqual(data.b, 2);
          assert.strictEqual(data.c, 3);
          assert.strictEqual(data.d, 4);
          done();
        });
      });
    });

    describe('if the task that contains the single task of failure is set in the series', function () {
      it('should be run by setting callback to the Error', function (done) {
        var myCoil = coil.create()
          , task1
          , task2 // will be fail
          , task3
          ;

        task1 = function (data, next) { setTimeout(function () { data.a = 1; next(); }, 5); };
        task2 = function (data, next) { setTimeout(function () { var err = new Error('sorry');  next(err); }, 5); };
        task3 = function (data, next) { setTimeout(function () { data.c = 3; next(); }, 5); };

        myCoil.use(task1);
        myCoil.use(task2);
        myCoil.use(task3);

        myCoil.handle({}, function (err, data) {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, 'sorry');
          assert.strictEqual(data.a, 1);
          assert.strictEqual(data.c, undefined);
          done();
        });
      });
    });

    describe('if the task that contains the parallel task of failure is set in the series', function () {
      it('should be run by setting callback to the failure of the Error', function (done) {
        var myCoil = coil.create()
          , task1
          , task2 // will be fail
          , task3 // will be fail
          , task4
          ;

        task1 = function (data, next) { setTimeout(function () { data.a = 1; next(); }, 5); };
        task2 = function (data, next) { setTimeout(function () { var err = new Error('1st'); data.b = 2;  next(err); }, 5); };
        task3 = function (data, next) { setTimeout(function () { var err = new Error('2nd'); data.c = 3; next(err); }, 30); };
        task4 = function (data, next) { setTimeout(function () { data.d = 4; next(); }, 5); };

        myCoil.use(task1);
        myCoil.use(task2, task3);
        myCoil.use(task3);

        myCoil.handle({}, function (err, data) {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, '1st');
          assert.strictEqual(data.a, 1);
          assert.strictEqual(data.b, 2);
          assert.strictEqual(data.c, undefined);
          assert.strictEqual(data.d, undefined);
          done();
        });
      });
    });
  });
});
