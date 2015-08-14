Install
---

    $ component install kelonye/ember-validate

Example
---

```javascript

  var Person = Em.Object.extend( require('ember-validate'), {

    validations: {

      age: [

        // client side validation
        [
          function(obj, attr, options, done){
            var age = obj.get(attr); // obj.get('age')
            if ((20 <= age) || (age <= 30)){
              return done('Age should be between 20 and 30');
            }
            done();
          }
        ],

        // server side validation
        [
          function(obj, attr, options, done){
            var age = obj.get(attr);
            function success(res){
              done();
            }
            function error(error){
              done(error)
            }
            Em.ajax({
              url: '/validate-age/' + age
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
    console.log(errors.get('age'));
  });

```

See [kelonye/ember-error-support](https://github.com/kelonye/ember-error-support) on use with text fields.

Test
---
  
    $ make test

License
---

MIT