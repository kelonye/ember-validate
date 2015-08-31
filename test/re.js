var Person;
var person;

describe('regex:', function() {
  beforeEach(function() {
    Person = Em.Object.extend(ValidateMixin, {
      validations: {
        tel: [/^(?:0|\+?254)7\d{8}$/]
      }
    });
    person = Person.create({
      tel: ''
    });
  });
  afterEach(function() {
    person = null;
  });
  it('fail', function(done) {
    person.set('tel', '254000111222');
    person.validate(function(){
      assert.equal(person.get('_isValid'), false);
      done();
    });
  });
  it('pass', function(done) {
    person.set('tel', '254700111222');
    person.validate(function(){
      assert.equal(person.get('_errors.tel'), undefined);
      assert.equal(person.get('_isValid'), true);
      done();
    });
  });
});
