//
//  misc.js
//  SudokuJS 2014
//
//  Created by Neil Opet on 10/15/2014.
//  (c) 2014 Neil Opet.  MIT open-source license.
//
//  A collection of miscellaneous helper methods

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function Point( x, y ) {
	return {
		x: x, 
		y: y
	};
}

function unique( array ) {
	var ret = [];
	for (var i = 0, j = -1; i < array.length; i++) {
		if (ret[j] != array[i]) {
			ret.push(array[i]);
			j++;
		}
	}
	return ret;	
}

function quickSort( array ) {
	if (array.length < 1) {
		return array;
	}
	var left = [], right = [], pivot = array[0];
	for (var i = 1; i < array.length; i++) {
		if (array[i] < pivot) {
			left.push(array[i]);
		}
		else {
			right.push(array[i]);
		}
	}
	return quickSort(left).concat(pivot, quickSort(right));
}


function transpose( array ) {
	return array[0].map(function(col, i) { 
		return array.map(function(row) { 
			return row[i];
		})
	});
}

function clone( array ) {
	return JSON.parse(
		JSON.stringify( array )
	);
}

function isInt( n ){
    return (typeof n == "number" 
    			&& isFinite(n) 
    			&& (n % 1) === 0);
}
