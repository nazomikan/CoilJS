// thx tj & sencha lab's member

var _slice = Array.prototype.slice
  ;

function Coil() {
  this.stack = [];
}

/**
 * stack any task
 *
 * @param {Function} task1, task2...
 */
Coil.prototype.use = function (/*task1, task2...*/) {
  var tasks = _slice.call(arguments)
    ;

  this.stack.push(tasks);
};

/**
 * handle coil
 *
 * @param {Mixed}    arg1...arg[x-1]
 * @param {Function} callback
 */
Coil.prototype.handle = function (/*arg1, arg2...arg[x-1], callback*/) {
  var stack = this.stack
    , preset = _slice.call(arguments)
    , callback = preset.pop()
    , iterate
    ;

  iterate = function (index) {
    var tasks
      , i = 0
      , iz
      , callCount = 0
      , isResolved = false
      , next
      ;

    index = index || 0;
    tasks = stack[index];

    if (!tasks) {
      return callback.apply(null, [null].concat(preset));
    }

    iz = tasks.length;
    next = function (err) {
      if (err && !isResolved) {
        isResolved = true;
        return callback.apply(null, [err].concat(preset));
      }
      if (++callCount === iz && !isResolved) {
        isResolved = true;
        iterate(++index);
      }
    };

    for (; i < iz; i++) {
      tasks[i].apply(null, preset.concat([next]));
    }
  };

  iterate();
};

/**
 * create Coil instance
 *
 * @return {Coil}
 */
module.exports.create = function () {
  return new Coil();
};

module.exports.Coil = Coil;
