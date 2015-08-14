Apply multiple and async validations to Ember Object propeties.

Install
---

    $ component install kelonye/ember-validate

Example
---

```javascript

  var Person = Em.Object.extend( require('ember-validate'), {

    validations: {

      email: [

        // built-in presence validation
        'presence',

        // built-in validation with custom error message
        ['email', 'Invalid email format'],

        // custom async validation
        [
          function(obj, attr, options, done){
            var email = obj.get(attr);
            function success(res){
              done();
            }
            function error(error){
              done(error)
            }
            Em.ajax({
              url: '/validate-email/' + email
              type: 'GET',
              success: success,
              error: error
            });
          },
        ],

      ],

  });

  // create person and validate
  var person = Person.create();
  person.validate(function(){
    var errors  = person.get('_errors');
    var isValid = person.get('_isValid');
    console.log(errors.get('email'));
  });

```

See [kelonye/ember-error-support](https://github.com/kelonye/ember-error-support) on use with text fields.

Test
---
  
    $ make test

License
---

MIT