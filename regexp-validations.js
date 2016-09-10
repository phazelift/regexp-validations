// validations - RegExpValidations class, register validation types with regexp's and validate values against them.
//
// Copyright (c) 2016 Dennis Raymondo van der Sluis
//
// This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>

"use strict";

var types= require( 'types.js' );



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
		this.validations[ key ]= types.forceRegExp( regexp );
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

		if ( types.notStringOrNumber(value) ){
			this.errorHandler( 'invalid value, must be of type String or Number!' );
			return null;
		}

		var
			 regexp			= this.validations[ key ]
			,displayValue	= ( types.isString(value) ) ? '"'+ value+ '"' : value
		;

		if ( regexp.test(value) ) return true;

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