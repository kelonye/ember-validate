var Person;
var person;

describe('email:', function() {
  beforeEach(function() {
    Person = Em.Object.extend(ValidateMixin, {
      validations: {
        email: ['presence', 'email']
      }
    });
    person = Person.create({
      email: 'g'
    });
  });
  afterEach(function() {
    person = null;
  });
  it('email is absent', function(done) {
    person.validate(function(){
      assert.equal(person.get('_errors.email'), '¬ wrong email format');
      assert.equal(person.get('_isValid'), false);
      done();
    });
  });
  it('email format is wrong', function(done) {
    person.set('email', 'jc.c');
    person.validate(function(){
      assert.equal(person.get('_errors.email'), '¬ wrong email format');
      assert.equal(person.get('_isValid'), false);
      done();
    });
  });
  it('email is ok', function(done) {
    person.set('email', 'j@c.c');
    person.validate(function(){
      assert.equal(person.get('_errors.email'), undefined);
      assert.equal(person.get('_isValid'), true);
      done();
    });
  });
});
