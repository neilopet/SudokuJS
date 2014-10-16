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

		//////////////////////////////////////
		//
		//  Fields
		//

		matrix            : inmatrix.slice(0),
		cellCallback      : function() {},
		states		      : [],
		cellClickCallback : function() {},

		//////////////////////////////////////
		//
		//  Constructors
		//

		init : function() {
			var source = clone( this.matrix );
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					var val = source[i][j];
					this.matrix[i][j] = new Cell(this, j, i, val);
					this.matrix[i][j].setCallback( this.cellCallback );
				}
			}

			this.each(function( cell ) {
				var buddiesObj = cell.getBuddies();
				var buddies = buddiesObj.x.concat(buddiesObj.y, buddiesObj.block);
				cell.subscribers = [];
				buddies.forEach(function(coords) {
					if (coords.x == j && coords.y == i) {
						
					}
					else {
						cell.subscribe( coords );
					}
				});
			});
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

		save : function() {
			var matrixValues = [];
			for (var i = 0; i < this.matrix.length; i++) {
				matrixValues.push([]);
				for (var j = 0; j < this.matrix[i].length; j++) {
					matrixValues[i].push(this.getCell(j, i).getRealValue());
				}
			}
			this.states.push( matrixValues );
		},

		restore : function() {
			if (this.states.length > 0) {
				this.matrix = this.states.pop();
				this.init();
				this.render( this.cellClickCallback );
				this.refreshValues();
			}
		},

		popState : function() {
			this.states.pop();
		},

		each : function( callback ) {
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					callback( this.matrix[i][j] );
				}
			}
		},

		bruteForce : function() {
			this.each(function( cell ) {
			});
		},

		solveSingles : function( cmp ) {
			var updated = false;
			this.each(function( cell ) {
				if (typeof cell.getValue().length == 'undefined') {
					return;
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
			});
			if (updated) {
				return this.solveSingles( cmp );
			}
			this.refreshValues();
			return this.matrix;
		},

		bruteForce1 : function() {
			//  start with two bivalue buddies sharing a common value
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					var cell = this.getCell( j, i );
					if (cell.getValue().length != 2) {
						continue;
					}
					var buddiesObj = cell.getBuddies();
					var buddies = buddiesObj.x.concat(buddiesObj.y, buddiesObj.block);
					var self = this;
					var conflicts = [];
					buddies.forEach(function(coords) {
						var buddyCell = self.getCell(coords.x, coords.y);
						var buddyCellValues = buddyCell.getValue();
						if (buddyCellValues.length == 2) {
							var diffValues = buddyCellValues.diff(cell.getValue());
							if (diffValues < 2) {
								var tryValues = cell.getValues().diff(diffValues);
								tryValues.forEach(function( v ) {
									cell.setValue( v );
									if (checkSolution()) {
										return true;
									}
								});
							}
						}
					});
				}
			}
		},

		refreshValues : function() {
			this.each(function( cell ) {
				cell.setValue( cell.getRealValue() );
			});
		},

		checkSolution : function () {
			return (this.check(this.matrix) 
				&& this.check(transpose(this.matrix)));
		},

		check : function( matrix ) {
			var rowSum = 45;
			for (var i = 0; i < matrix[0].length; i++) {
				var sum = 0;
				for (var j = 0; j < matrix[i].length; j++) {
					sum += this.getCell(j, i).getRealValue();
				}
				if (sum != rowSum) {
					return false;
				}
			}
			return true;
		},

		//////////////////////////////////////
		//
		//  Views
		//

		render : function( clickCallback ) {
			this.cellClickCallback = clickCallback;
			var matrix = this.matrix;
			var table = document.getElementById('sudoku');
			if (table == null) {
				table = document.createElement('table');
				table.setAttribute('id', 'sudoku');
				var tbody = document.createElement('tbody');
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
						td.onclick = this.cellClickCallback;
						tr.appendChild(td);
					}
					tbody.appendChild(tr);
					table.appendChild(tbody);
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
