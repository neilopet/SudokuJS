/*
 * 1) Get empty cells
 * 2) Iterate each empty cell
 * 2a) Get cell buddies
 * 2b) Evaluate possibilities
 * 3) Solve single solution cells
 * 4) Iterate each bivalue cell (pivot: XY)
 * 4a) Identify pincers (cells XZ, YZ that share common X or common Y)
 * 4b) Eliminate all pincer intersect values from box containing XZ or YZ
 */

var validMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/*
var matrix = [
	['', 1, 5, '', 6, 3, '', 4, ''],
	['', '', '', '', '', '' ,'', '', ''],
	[4, '', '', 1, '', 8, 5, '', ''],
	['', 6, '', 8, '', '', '', 2, 3],
	[2, '', '', 4, 3, 9, '', '', 8],
	[1, 3, '', '', '', 6, '', 5, ''],
	['', '', 9, 3, '', 1, '', '', 7],
	['', '', '', '', '', '', '', '', ''],
	['', 4, '', 7, 5, '', 1, 8, '']
];
*/

var matrix = [
	['', '', 3, 5, '', 9, '', '', ''],
	['', 6, '', '', '', '', '', 2, 7],
	['', '', 8, '', '', 2, 4, 9, ''],
	[3, '', '', '', 2, '', 7, '', 5],
	['', '', 9, '', '', '', 8, '', ''],
	[5, '', 2, '', 8, '', '', '', 9],
	['', 9, 1, 4, '', '', 2, '', ''],
	[4, 3, '', '', '', '', '', 7, ''],
	['', '', '', 6, '', 5, 1, '', '']
];

function solve( matrix ) {
	var newSolution = false;
	for (var i = 0; i < matrix.length; i++) {
		for(var j = 0; j < matrix[i].length; j++) {
			if (get(Point(j, i)) != '') {
				continue;
			}
			var diversity = getCellDiversity(Point(j, i));
			var possibleValues = diff(validMoves, diversity);
			if (possibleValues.length == 1) {
				newSolution = true;
				matrix[i][j] = possibleValues[0];
			}
		}
	}
	if (newSolution) {
		return solve(matrix);
	}
	else {
		return matrix;
	}
}

console.table(solve(matrix));

//////////////////////////////////////////
// helper methods
//

function Point(x, y) { return { x: x, y: y }; }

function get( point ) {
	return matrix[point.y][point.x];
}

function diff( array1, array2 ) {
	var ret = [];
	for(var i = 0; i < array1.length; i++) {
		var found = false;
		for(var j = 0; j < array2.length; j++) {
			if (array1[i] == array2[j]) {
				found = true;
				break;
			}
		}
		if (!found) {
			ret.push( array1[i] );
		}
	}
	return ret;
}

function checkSolution( matrix ) {
	return (check(matrix) 
		&& check(transpose(matrix)));
}

function check( matrix ) {
	var rowSum = sigmaN( matrix[0].length );
	for (var i = 0; i < matrix[0].length; i++) {
		var sum = 0;
		for (var j = 0; j < matrix[i].length; j++) {
			sum += matrix[i][j];
		}
		if (sum != rowSum) {
			return false;
		}
	}
	return true;
}

function sigmaN( num ) {
	var ret = 0;
	for( var i = 1; i <= num; ret += i, i++)
		;
	return ret;
}

function getCellDiversity( point ) {
	/* get X, Y givens */
	var givensX = [], givensY = [];
	for (var i = 0; i < matrix[0].length; i++) {
		if (matrix[point.y][i] != '') {
			givensX.push( matrix[point.y][i] );
		}
		if (matrix[i][point.x] != '') {
			givensY.push( matrix[i][point.x] );
		}
	}
	/* get Block */
	var givensBlock = getNBlock( point );
	//console.log({ x: givensX, y: givensY, z: givensBlock });
	var res = quickSort(givensX.concat(givensY, givensBlock));
	var ret = [];
	for (var i = 0, j = -1; i < res.length; i++) {
		if (ret[j] != res[i]) {
			ret.push(res[i]);
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

function getNBlock( point ) {
	var coord = getNBlockPoint( point );
	var ret = [];
	for (var i = coord.y, ilim = (coord.y + 3); i < ilim; i++) {
		for (var j = coord.x, jlim = (coord.x + 3); j < jlim; j++) {
			if (matrix[i][j] != '') {
				ret.push(matrix[i][j]);
			}
		}
	}
	return ret;
}

function getNBlockPoint( point ) {
	if (point.x < 3) {
		if (point.y < 3) {
			return Point(0, 0);
		}
		else if (point.y < 6) {
			return Point(0, 3);
		}
		else {
			return Point(0, 6);
		}
	}
	else if (point.x < 6) {
		if (point.y < 3) {
			return Point(3, 0);
		}
		else if (point.y < 6) {
			return Point(3, 3);
		}
		else {
			return Point(3, 6);
		}	
	}
	else {
		if (point.y < 3) {
			return Point(6, 0);
		}
		else if (point.y < 6) {
			return Point(6, 3);
		}
		else {
			return Point(6, 6);
		}
	}
}

function transpose( array ) {
	return array[0].map(function(col, i) { 
		return array.map(function(row) { 
			return row[i];
		})
	});
}
