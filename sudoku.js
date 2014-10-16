//
//  sudoku.js
//  SudokuJS 2014
//
//  Created by Neil Opet on 10/15/2014.
//  (c) 2014 Neil Opet.  MIT open-source license.
//
//  A light Sudoku framework with virtual Matrices.

function Sudoku( inmatrix ) {
	var public = {
		matrix       : inmatrix.slice(0),
		cellCallback : function() {},

		//////////////////////////////////////
		//
		//  Constructors
		//
		init : function() {
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					var val = inmatrix[i][j];
					this.matrix[i][j] = new Cell(this, j, i, val);
					this.matrix[i][j].setCallback( this.cellCallback );
				}
			}

			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					var cell = this.getCell( j, i );
					var buddiesObj = cell.getBuddies();
					var buddies = buddiesObj.x.concat(buddiesObj.y, buddiesObj.block);
					buddies.forEach(function(obj, index) {
						cell.subscribe( obj );
					});
				}
			}
		},

		//////////////////////////////////////
		//
		//  Getters
		//

		getCell : function( x, y ) {
			return this.matrix[y][x];
		},

		getMatrix : function() {
			return this.matrix;
		},

		//////////////////////////////////////
		//
		//  Setters
		//

		setCellCallback : function( fnCallback ) {
			this.cellCallback = fnCallback;
		},

		//////////////////////////////////////
		//
		//  Methods
		//

		solveSingles : function( cmp ) {
			var updated = false;
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					var cell = this.getCell( j, i );
					if (typeof cell.getValue().length == 'undefined') {
						continue;
					}
					var buddiesObj = cell.getBuddies();
					var buddies = buddiesObj.x.concat(buddiesObj.y, buddiesObj.block);
					var buddyValues = [];
					buddies.forEach(function(coords, index) {
						var val = public.getCell( coords.x, coords.y ).getValue();
						if (typeof val.length == 'undefined') {
							buddyValues.push( val );
						}
					});
					buddyValues = quickSort(buddyValues);
					buddyValues = unique(buddyValues);
					var result = cmp.diff(buddyValues);

					if (result.length == 1) {
						cell.setValue( result[0] );
						updated = true;
					}
				}
			}
			if (updated) {
				return this.solveSingles( cmp );
			}
			return this.matrix;
		},

		//////////////////////////////////////
		//
		//  Views
		//

		render : function() {
			var matrix = this.matrix;
			var table = document.getElementById('sudoku');
			if (table == null) {
				table = document.createElement('table');
				table.setAttribute('id', 'sudoku');
				for (var i = 0; i < matrix.length; i++) {
					var tr = document.createElement('tr');
					tr.setAttribute('id', 'row_' + i);
					for (var j = 0; j < matrix[i].length; j++) {
						var td = document.createElement('td');
						td.setAttribute('id', 'cell_' + j + 'x' + i);
						var val = this.getCell(j, i).getValue();
						if (typeof val.length != 'undefined') {
							td.innerHTML = '<span class="prospects">' + val + '</span>';
						}
						else {
							td.innerHTML = val;
						}
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}
				document.body.appendChild(table);
			}
			else {
				for (var i = 0; i < matrix.length; i++) {
					for (var j = 0; j < matrix[i].length; j++) {
						var td = document.getElementById( 'cell_' + i + 'x' + j );
						if (td != null) {
							var cell = this.getCell(i, j);
							var val = cell.getValue();
							if (typeof val.length != 'undefined') {
								td.innerHTML = '<span class="prospects">' + val + '</span>';
							}
							else {
								td.innerHTML = val;
							}
						}
					}
				}					
			}
		}
	};

	return public;
}
