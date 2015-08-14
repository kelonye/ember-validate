/**
  * Module dependencies
  */
require('ember');
var Batch = require('batch');

/**
  * Regex expressions
  */
var REGEX_EXPRS = Em.Object.create({
  // presence: [/^.+$/mi, ''],
  email: [/.+@.+\..+/, '¬ wrong email format']
});


/**
  * Validator
  */

var Validator = Em.Object.extend({
  init: function(){
    this._super();
    var options = {};
    var validation = this.get('validation');
    if (validation instanceof Array) {
      var tmp = validation;
      validation = tmp[0];
      this.set('error', tmp[1]);
    }
    if (typeof validation === 'string') {
      fn = validation;
      _options = REGEX_EXPRS.get(fn);
      if (_options) {
        fn = 're';
        var tmp = _options;
        options = tmp[0];
        if (!this.get('error')){
          this.set('error', tmp[1]);
        }
      }
    } else if (validation instanceof RegExp) {
      fn = 're';
      options = validation;
    } else if (typeof validation === 'function') {
      fn = validation;
    } else {
      keys = Object.keys(validation);
      fn = keys[0];
      options = validation[fn];
    }
    if (typeof fn === 'string') {
      fn = require('./validators/' + fn);
    }
    this.set('fn', fn);
    this.set('options', options);
  },
  validate: function(obj, done){
    var that = this;
    var fn = this.get('fn');
    var options = this.get('options');
    var attr = this.get('attr');
    fn(obj, attr, options, function(error){
      that.onvalidate(obj, error, done);
    });
  },
  onvalidate: function(obj, error, done){
    var attr = this.get('attr');
    if (error){
      if (this.get('error')){ // use custom error message
        error = this.get('error');
      }
    }
    var isValid = !!!error;
    // console.log(isValid);
    // console.log(error);
    obj.set('_isValid', isValid);
    obj.set('_errors.' + attr, error);
    done(error);
  }
});

/**
  * Mixin
  */
module.exports = Em.Mixin.create({

  _isValid: true,
  _errors: {},

  /**
    * Generate 
    * [
    *   { attr: [{fn: obj, options: {}, error: '' }, ...]}, ...
    * ]
    *
    */
  init: function(){
    var that = this;
    this._super();
    var _validations = [];
    for (var attr in that.get('validations')) {
      var _validators = [];
      that.get('validations')[attr].forEach(function(validation){
        var _validator = Validator.create({
          attr: attr,
          validation: validation
        });
        _validators.push(_validator);
      });
      var _validation = {};
      _validation.attr = attr;
      _validation.validators = _validators;
      _validations.push(_validation);
    }
    this.set('_validations', _validations);
  },
  validate: function(done){
    var that = this;

    var batch = new Batch();
    
    if (!this.get('_validateParallel')) batch.concurrency(1); // serial

    var validations = that.get('_validations');
    validations.forEach(function(validation){
      batch.push(function(fn){
        var batch2 = new Batch();
        batch2.concurrency(1);
        var validators = validation.validators;
        validators.forEach(function(validator){
          batch2.push(function(fn2){
            validator.validate(that, fn2);
          });
        });
        batch2.end(fn);
      });
    });

    batch.end(done);

  }
});
