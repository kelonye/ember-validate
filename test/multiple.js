// Generated by CoffeeScript 1.4.0
var Person, get, person, set;

get = Em.get;

set = Em.set;

Person = window.Person;

person = window.person;

describe("multiple:", function() {
  beforeEach(function() {
    Person = Em.Object.extend(ValidateMixin, {
      validations: {
        name: ["presence"],
        tel: [
          function(obj, attr, options) {
            if (!get(obj, "" + attr)) {
              return false;
            }
          }, [/^(?:0|\+?254)7\d{8}$/, 'cell no. is invalid']
        ]
      }
    });
    return person = Person.create();
  });
  afterEach(function() {
    return person = null;
  });
  it("name absent", function() {
    person.validate();
    assert.equal(get(person, "_errors.name"), "");
    assert.equal(get(person, "_errors.tel"), void 0);
    return assert.equal(get(person, "_isValid"), false);
  });
  it("tel absent", function() {
    set(person, "name", "TJ");
    person.validate();
    assert.equal(get(person, "_errors.name"), void 0);
    assert.equal(get(person, "_errors.tel"), '');
    return assert.equal(get(person, "_isValid"), false);
  });
  it("tel format is wrong", function() {
    set(person, "name", "TJ");
    set(person, "tel", "254000111222");
    person.validate();
    assert.equal(get(person, "_errors.name"), void 0);
    assert.equal(get(person, "_errors.tel"), "cell no. is invalid");
    return assert.equal(get(person, "_isValid"), false);
  });
  return it("name and tel are ok", function() {
    set(person, "tel", "254700111222");
    set(person, "name", "TJ");
    person.validate();
    assert.equal(get(person, "_errors.name"), void 0);
    assert.equal(get(person, "_errors.tel"), void 0);
    return assert.equal(get(person, "_isValid"), true);
  });
});
