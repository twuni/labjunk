var Life = ( function() {

  var NEIGHBORS = [
    [ -1, -1 ],
    [ -1,  0 ],
    [ -1,  1 ],
    [  0, -1 ],
    [  0,  1 ],
    [  1, -1 ],
    [  1,  0 ],
    [  1,  1 ]
  ];

  NEIGHBORS.inform = function( state ) {

    for( var y = 0; y < state.length; y++ ) {
      for( var x = 0; x < state[y].length; x++ ) {

        var cell = state[y][x];

        cell.neighbors = [];

        for( var i = 0; i < NEIGHBORS.length; i++ ) {

          var offset = NEIGHBORS[i];

          var neighbor = {};

          neighbor.y = ( y + offset[1] ) % state.length;
          if( neighbor.y < 0 ) { neighbor.y = state.length + neighbor.y; }

          neighbor.x = ( x + offset[0] ) % state[neighbor.y].length;
          if( neighbor.x < 0 ) { neighbor.x = state[neighbor.y].length + neighbor.x; }

          cell.neighbors.push( state[neighbor.y][neighbor.x] );

        }

      }
    }

  };

  var onEachCell = function( f ) {
    if( typeof(f) !== "function" ) { return; }
    for( var y = 0; y < this.length; y++ ) {
      for( var x = 0; x < this[y].length; x++ ) {
        f.call( this[y][x] );
      }
    }
  };

  var Life = function( parameters ) {

    var state = parameters.state || [[]];

    for( var y = 0; y < state.length; y++ ) {
      for( var x = 0; x < state[y].length; x++ ) {
        state[y][x].position = { x: x, y: y };
      }
    }

    state.onEachCell = onEachCell;

    NEIGHBORS.inform( state );
    
    this.transition = function() {
      state.onEachCell( Cell.prototype.prepareTransition );
      state.onEachCell( Cell.prototype.applyTransition );
    };

    this.onEachCell = function( f ) { state.onEachCell( f ); };

    this.height = state.length;
    this.width = this.height > 0 ? state[0].length : 0;

    this.touch = function( x, y, color ) {
      state[y][x].alive = true;
      state[y][x].color = color.clone();
    };

    ( function( interval, timeout ) {

      var life = this;
      var previousSpeed = 1000;

      life.pause = function() {
        if( interval ) {
          clearInterval( interval );
          interval = undefined;
        }
        if( timeout ) {
          clearTimeout( timeout );
          timeout = undefined;
        }
        life.paused = true;
      };

      life.resume = function( parameters ) {

        if( timeout || interval ) {
          return;
        }

        if( parameters && parameters.speed !== undefined ) {
          previousSpeed = parameters.speed;
        }

        var delay = !parameters || parameters.delay === undefined ? 0 : parameters.delay;
        var speed = !parameters || parameters.speed === undefined ? previousSpeed : parameters.speed;

        timeout = setTimeout( function() {
          life.paused = false;
          interval = setInterval( life.transition, speed );
        }, delay );

      };

    } ).call( this );

  };

  Life.generate = function( parameters ) {

    var density = parameters.density === undefined ? 0.1 : parameters.density;
    var width = parameters.width || 100;
    var height = parameters.height || 100;
    var blending = parameters.blending || "average";
    var survival = parameters.survival || function() { return true; };
    var birth = parameters.birth || function() { return false; };

    console.log( "Life::generate(", parameters, ")" );

    var state = [];

    for( var y = 0; y < height; y++ ) {
      state[y] = [];
      for( var x = 0; x < width; x++ ) {
        state[y][x] = new Cell( {
          alive: Math.random() <= density,
          color: Color.random(),
          colorBlending: blending,
          survival: survival,
          birth: birth
        } );
      }
    }

    return new Life( {
      state: state
    } );

  };

  return Life;

} )();
