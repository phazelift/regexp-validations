#regexp-validations
A basic validation class, featuring:

- register validation types with regexp's and validate values against them
- can install an error handler that will receive a detailed error message and the related data
- can validate multiple values at once
- very type safe

<br/>


###A complete example you can run
```javascript

var Validator= require( 'regexp-validations' );

// can pass console.log as error handler, or any custom you prefer
var validator= new Validator( console.log );

// add a single one
validator.add( 'number': /^[0-9]+$/ );

// or add multiple at once
validator.add({
	 hex		: /^[0-9A-Fa-f]+$/
	,name		: /^[A-Za-z]{1,7}$/
});

// use a registered key to validate a value
var validated= validator.validate( 'number', 33 );
console.log( validated );
// true

// validate multiple values of different types at once
// passing true as second argument to continue validating all values after
// on or more values didn't pass
validated= validator.validate([
	 { number	: 33 }
	,{ number	: 42 }
	,{ name		: 'hey!' }
	,{ hex		: 0 }
], true );
// value: "hey!" did not pass name! { key: 'name', value: 'hey!', regexp: /^[A-Za-z]{1,7}$/ }
console.log( validated );
// false

```

<br/>

###usage details

All examples use the context created below.

```javascript
var
	 Validator	= require( 'regexp-validations' )
	 // can pass console.log as error handler, or any custom you prefer
	,validator	= new Validator( console.log )
;
```

---

<br/>

#####setErrorHandler
>`<this> setErrorHandler( <function> callback )`

The callback set with setErrorHandler will be called on any error that occurs.
```javascript
// let console.log be the error handler
validator.setErrorHandler( (err, obj) => {
	console.log( 'error:', err );	
	console.log( obj );	
});
```

---

<br/>

#####hasKey
>`<boolean>hasKey( <string> key )`

Returns true if the key is added to the context object, or false if not.

---

<br/>

#####add
>`<boolean> add( <object>/<string> obj, <regexp> regexp )`

Adds a single validation object or multiple at once

```javascript
// add a single one
validator.add({ number: /^[0-9]+$/ });

// or add multiple at once
validator.add({
	 number		: /^[0-9]+$/
	,hex		: /^[0-9A-Fa-f]+$/
	,name		: /^[A-Za-z]{1,7}$/
});
```

---

<br/>

#####validate
>`<boolean>/<null> validate( <array>/<string> validations, <string>/<number> value )`

Validate one or multiple values at once. If validations is a collection of validations the second argument can be set to true to continue validating al remaining validations after one or more validations didn't pass.

validate returns true or false for regexp pass or fail, but will return null if a type error occurs or a key has not been registered with add.

```javascript
// single
var validated= validator.validate( 'number', 0 );

// multiple
var validated= validator.validate([
	 { number	: 33 }
	,{ number	: 42 }
	,{ name		: 'hey!' }
	,{ hex		: 0 }
]);
```

---

<br/>

#####validations
>`<object> validations`

Context property holding all validation key's

---