// regexp-validations, register validation types with regexp's and validate values against them.
//
// MIT License
//
// Copyright (c) 2016 Dennis Raymondo van der Sluis
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

"use strict";

var
	 types		= require( 'types.js' )
	,regEscape	= require( 'reg-escape' )
;



// constructor
var RegExpValidations= function( errorHandler ){
	this.setErrorHandler( errorHandler );
	this.validations= {};
};




// allow for overriding default error handler
RegExpValidations.prototype.setErrorHandler= function( callback ){
	this.errorHandler= types.forceFunction( callback );
	return this;
};



RegExpValidations.prototype.hasKey= function( key ){
	return this.validations.hasOwnProperty( key );
};



RegExpValidations.prototype.addOne= function( key, regexp ){
	if ( types.notString(key) ){
		this.errorHandler( 'key: ', key, 'is not of type string, cannot add validation!' );
		return false;
	} else if ( this.hasKey(key) ){
		this.errorHandler( 'key: ', key, 'already exists with regexp:', this.validations[key], 'cannot add!' );
		return false
	} else {
		this.validations[ key ]= ( types.notRegExp(regexp) )
			// ?	new RegExp( '^'+ regEscape(regexp)+ '$' )
			?	regexp
			:	types.forceRegExp( regexp );
		return true
	}
};



RegExpValidations.prototype.add= function( obj, regexp ){
	var hasFail= false;
	if ( types.isObject(obj) ){
		for ( var key in obj ){
			if ( ! this.addOne(key, obj[key]) ) hasFail= true;
		}
		return ! hasFail;
	} else return this.addOne( obj, regexp );
};



RegExpValidations.prototype.validateOne= function( key, value ){

		if ( ! this.hasKey(key) ){
			this.errorHandler( 'cannot validate non-existing key:', key );
			return null;
		}

		var
			 regexp			= this.validations[ key ]
			,displayValue	= ( types.isString(value) ) ? '"'+ value+ '"' : value
		;

		if ( types.notRegExp(regexp) ){
 			if ( regexp === value ) return true;
		} else if ( regexp.test(value) ) return true;

		this.errorHandler( 'value: '+ displayValue+ ' did not pass '+ key+ '!', {
			 key		: key
			,value	: value
			,regexp	: this.validations[ key ]
		});
		return false;
};



RegExpValidations.prototype.validate= function( validations, value ){

	if ( types.notArray(validations) ){
		return this.validateOne( validations, value );
	}

	var validated= true;

	for ( var index in validations ){

		var validation= validations[ index ];

		if ( types.notObject(validation) ){
			this.errorHandler( 'invalid or non-object type encountered in validations!' );
			return null;
		}

		var key= Object.keys( validation )[0];

		if ( ! this.validateOne(key, validation[ key ]) ){
			validated= false;
			if ( ! value )	break;
		}
	}

	return validated;
};


module.exports= RegExpValidations;