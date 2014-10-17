//
//  cell.js
//  SudokuJS 2014
//
//  Created by Neil Opet on 10/15/2014.
//  (c) 2014 Neil Opet.  MIT open-source license.
//
//  Class for creating virtual Cells within a virtual Matrix.
//  Uses the Observer Design Pattern to create a
//  Subject <- Subscriber relationship.

function Cell( parent, x, y, initialValue ) {
	var public = {

		//////////////////////////////////////
		//
		//  Fields
		//

		coords      : Point(x, y),
		value       : initialValue,
		prospects   : [1, 2, 3, 4, 5, 6, 7, 8, 9],
		subscribers : [],
		parent      : parent,
		fnCallback  : function() {},
		states      : [],

		//////////////////////////////////////
		//
		//  Getters
		//

		getValue : function() {
			if (this.value == '') {
				return this.prospects;
			}
			return this.value;
		},

		getRealValue : function() {
			return this.value;
		},

		getProspects : function() {
			return this.prospects;
		},

		getBuddies : function() {
			return {
				x: this.getRowBuddies(),
				y: this.getColumnBuddies(),
				block: this.getBlockBuddies()
			};
		},

		getBuddyBivalueIntersects : function() {
			if (isInt(this.getValue())
				|| this.getValue().length != 2) {
				return [];
			}
			var parent = this.getParent();
			var myValue = this.getValue();
			var buddiesObj = this.getBuddies();
			var buddies = buddiesObj.x.concat(buddiesObj.y, buddiesObj.block);
			var ret = [];
			var ourCoords = this.coords;
			buddies.forEach(function(coords) {
				if (coords.x == ourCoords.x 
					&& coords.y == ourCoords.y) {
					return;
				}
				var cell = parent.getCell( coords.x, coords.y );
				var cellValue = cell.getValue();

				if (cellValue.length != 2) {
					return;
				}

				var diffValues = cellValue.diff( myValue );
				if (diffValues.length < 2) {
					var found = false;
					for (var i = 0; i < ret.length; i++) {
						if (ret[i].equals(coords)) {
							found = true;
							break;
						}
					}
					if (!found) {
						ret.push(coords);
					}
				}
			});
			return ret;
		},

		getParent : function() {
			return this.parent;
		},

		getRowBuddies : function() {
			var ret = [];
			for (var x = 0; x < 9; x++) {
				ret.push( Point( x, this.coords.y ) )
			}
			return ret;
		},

		getColumnBuddies : function() {
			var ret = [];
			for (var y = 0; y < 9; y++) {
				ret.push( Point( this.coords.x, y ) );
			}
			return ret;
		},

		getBlockBuddies : function() {
			var coord = this.getNBlockPoint( Point( this.coords.x, this.coords.y ) );
			var ret = [];
			for (var i = coord.y, ilim = (coord.y + 3); i < ilim; i++) {
				for (var j = coord.x, jlim = (coord.x + 3); j < jlim; j++) {
					ret.push( Point(j, i) );
				}
			}
			return ret;
		},

		getNBlockPoint : function( point ) {
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
		},

		//////////////////////////////////////
		//
		//  Setters
		//

		setValue : function( value ) {
			if (typeof value == 'undefined') {
				return;
			}
			this.save();
			this.value = value;
			this.sendNotification( value );
			this.fnCallback( this );
			//this.prospects = [];
		},

		setCallback : function( fnCallback ) {
			this.fnCallback = fnCallback;
		},

		setParent : function( sudoku ) {
			this.parent = matrix;
		},

		//////////////////////////////////////
		//
		//  Methods
		//

		save : function() {
			this.states.push({
				value     : this.value,
				prospects : this.prospects
			});
		},

		restore : function() {
			var state = this.states.pop();
			this.value = state.value;
			this.prospects = state.prospects;
		},

		sendNotification : function( message ) {
			for (var i = 0; i < this.subscribers.length; i++) {
				var subscriberCoords = this.subscribers[i];
				this.getParent()
						.getCell(subscriberCoords.x, subscriberCoords.y)
						.notify( message );
			}
		},

		notify : function( message ) {
			var idx = this.prospects.indexOf( message );
			if (idx > -1) {
				this.prospects.splice( idx, 1 );
				var newProspects = quickSort( this.prospects );
				this.prospects = newProspects;
			}
		},

		subscribe : function( object ) {
			this.subscribers.push( object );
		}

	};

	return public;
}
