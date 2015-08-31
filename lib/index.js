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
    var self = this;
    var fn = this.get('fn');
    var options = this.get('options');
    var attr = this.get('attr');
    fn(obj, attr, options, function(error){
      self.onvalidate(obj, error, done);
    });
  },
  onvalidate: function(obj, error, done){
    var attr = this.get('attr');
    if (error){
      if (this.get('error')){ // use custom error message
        error = this.get('error');
      }
    }

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

  _isNotValid: function(){
    return !this.get('_isValid');
  }.property('_isValid'),

  init: function(){

    var self = this;
    var validations = [];

    for (var attr in self.get('validations')) {

      var validators = [];

      self.get('validations')[attr].forEach(function(validation){
        validators.push(Validator.create({
          attr: attr,
          validation: validation
        }));
      });

      var validation = {};
      validation.attr = attr;
      validation.validators = validators;
      validations.push(validation);

    }

    self.set('_validations', validations);

    self._super();

  },

  validate: function(done){

    var self = this;

    var batch = new Batch();
    
    if (!this.get('_validateParallel')) batch.concurrency(1); // serial

    self.get('_validations').forEach(function(validation){
      batch.push(function(fn){
        var batch2 = new Batch();
        batch2.concurrency(1);
        var validators = validation.validators;
        validators.forEach(function(validator){
          batch2.push(function(fn2){
            validator.validate(self, fn2);
          });
        });
        batch2.end(fn);
      });
    });

    batch.end(function(err){

      self.set('_isValid', !!!err);

      if (done) done();
    });

  },

});
