var CONFIG = Parameters.fromQueryString();

var cursor = {
  x: -1,
  y: -1,
  active: false,
  color: new Color( 0xFFFFFF ),
  track: function( event ) {
    var size = CONFIG.size;
    cursor.x = parseInt( ( event.pageX / innerWidth ) * environment.width / size );
    cursor.y = parseInt( ( event.pageY / innerHeight ) * environment.height / size );
    if( cursor.active ) {
      grid[cursor.y][cursor.x].alive = true;
      grid[cursor.y][cursor.x].color = new Color( cursor.color.value );
    }
    var context = environment.getContext("2d");
    context.fillStyle = "#fff";
    context.globalAlpha = 0.25;
    context.fillRect( cursor.x * size, cursor.y * size, size, size );
  }
};

var paused = false;

( function( delayedStart ) {

  addEventListener( "mousemove", cursor.track );

  addEventListener( "mousedown", function( event ) {
    cursor.active = true;
    cursor.color = Color.random();
    paused = true;
    clearTimeout(delayedStart);
    cursor.track(event);
  } );

  addEventListener( "mouseup", function() {
    cursor.active = false;
    delayedStart = setTimeout( function() { paused = false; }, 1000 );
  } );

} )();

var survives = [];
for( var i = 0; i < CONFIG.s.length; i++ ) {
  survives[parseInt(CONFIG.s[i])] = true;
}

var born = [];
for( var i = 0; i < CONFIG.b.length; i++ ) {
  born[parseInt(CONFIG.b[i])] = true;
}

function generate( width, height, density ) {
  var grid = [];
  for( var y = 0; y < height; y++ ) {
    grid[y] = [];
    for( var x = 0; x < width; x++ ) {
      grid[y][x] = new Cell( Math.random() <= density, Color.random() );
    }
  }
  return grid;
}

function update(grid) {
  for( var y = 0; y < grid.length; y++ ) {
    for( var x = 0; x < grid[y].length; x++ ) {

      var support = [],
          _y = y > 0 ? y - 1 : grid.length - 1,
          y_ = y + 1 < grid.length ? y + 1 : 0,
          _x = x > 0 ? x - 1 : grid[y].length - 1,
          x_ = x + 1 < grid[y].length ? x + 1 : 0;

      if( grid[_y][_x].alive ) { support.push(grid[_y][_x]); }
      if( grid[_y][x].alive ) { support.push(grid[_y][x]); }
      if( grid[_y][x_].alive ) { support.push(grid[_y][x_]); }
      if( grid[y][_x].alive ) { support.push(grid[y][_x]); }
      if( grid[y][x_].alive ) { support.push(grid[y][x_]); }
      if( grid[y_][_x].alive ) { support.push(grid[y_][_x]); }
      if( grid[y_][x].alive ) { support.push(grid[y_][x]); }
      if( grid[y_][x_].alive ) { support.push(grid[y_][x_]); }

      if( grid[y][x].alive && !survives[support.length] ) {
        grid[y][x].fate.alive = false;
      } else if( !grid[y][x].alive && born[support.length] ) {
        grid[y][x].fate.alive = true;
      } else {
        grid[y][x].fate.alive = grid[y][x].alive;
      }

      if( grid[y][x].fate.alive ) {
        grid[y][x].fate.color = new Color( support[0].color.value );
        for( var i = 1; i < support.length; i++ ) {
          grid[y][x].fate.color = grid[y][x].fate.color[CONFIG.blending]( support[i].color );
        }
      }

    }

  }

  for( var y = 0; y < grid.length; y++ ) {
    for( var x = 0; x < grid[y].length; x++ ) {
      grid[y][x].alive = grid[y][x].fate.alive;
      grid[y][x].color = grid[y][x].fate.color;
    }
  }

}

function draw( canvas, size ) {

  if( !size ) { size = 1; }

  var context = canvas.getContext("2d");

  context.fillStyle = "#010";
  context.globalAlpha = 1 / ( CONFIG.decay + 1 );
  context.fillRect( 0, 0, canvas.width, canvas.height );

  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.shadowColor = "#000";

  for( var y = 0; y < grid.length; y++ ) {
    for( var x = 0; x < grid[y].length; x++ ) {
      if( !grid[y][x].alive ) {
        continue;
      }
      context.fillStyle = grid[y][x].color.toString();
      context.globalAlpha = 1;
      context.fillRect( x * size, y * size, size, size );
    }
  }

  for( var y = 0; y < grid.length; y++ ) {
    context.fillStyle = "#555";
    context.globalAlpha = 0.2;
    context.fillRect( 0, y * size, canvas.width, 1 );
  }

  for( var x = 0; x < grid[0].length; x++ ) {
    context.fillStyle = "#555";
    context.globalAlpha = 0.2;
    context.fillRect( x * size, 0, 1, canvas.height );
  }

  context.fillStyle = "#fff";
  context.globalAlpha = 0.25;
  context.fillRect( cursor.x * size, cursor.y * size, size, size );

}

var debug = ( function( then ) {
  return function( canvas ) {
    var context = canvas.getContext("2d");
    var now = new Date().getTime();
    var fps = 1000 / ( now - then );
    context.fillStyle = "#ff0";
    context.fillText( parseInt(fps) + " fps", 16, 16 );
    then = now;
  };
} )( new Date().getTime() );

var environment = document.getElementById("environment");
environment.width = window.innerWidth;
environment.height = window.innerHeight;
var grid = generate( environment.width / CONFIG.size, environment.height / CONFIG.size, CONFIG.density );

requestAnimationFrame( function() {
  requestAnimationFrame( arguments.callee );
  draw( environment, CONFIG.size );
} );

setInterval( function() {
  if( !paused ) {
    update( grid );
  }
}, CONFIG.speed );
