var Person;
var person;

describe('multiple:', function() {
  beforeEach(function() {
    Person = Em.Object.extend(ValidateMixin, {
      validations: {
        name: ['presence'],
        tel: [
          function(obj, attr, options, done) {
            if (!obj.get(attr)) {
              return done(' ');
            }
            done();
          }, [/^(?:0|\+?254)7\d{8}$/, 'cell no. is invalid']
        ]
      }
    });
    person = Person.create();
  });
  afterEach(function() {
    person = null;
  });
  it('name absent', function(done) {
    person.validate(function(){
      assert.equal(person.get('_errors.name'), ' ');
      assert.equal(person.get('_errors.tel'), undefined);
      assert.equal(person.get('_isValid'), false);
      done();
    });
  });
  it('tel absent', function() {
    person.set('name', 'TJ');
    person.validate(function(done){
      assert.equal(person.get('_errors.name'), undefined);
      assert.equal(person.get('_errors.tel'), ' ');
      assert.equal(person.get('_isValid'), false);
      done();
    });
  });
  it('tel format is wrong', function() {
    person.set('name', 'TJ');
    person.set('tel', '254000111222');
    person.validate(function(done){
      assert.equal(person.get('_errors.name'), undefined);
      assert.equal(person.get('_errors.tel'), 'cell no. is invalid');
      assert.equal(person.get('_isValid'), false);
      done();
    });
  });
  it('name and tel are ok', function() {
    person.set('tel', '254700111222');
    person.set('name', 'TJ');
    person.validate(function(done){
      assert.equal(person.get('_errors.name'), undefined);
      assert.equal(person.get('_errors.tel'), undefined);
      assert.equal(person.get('_isValid'), true);
      done();
    });
  });
});
