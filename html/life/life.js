var cursor = {
  x: -1,
  y: -1,
  active: false,
  track: function(event) {
    cursor.x = parseInt( ( event.pageX / innerWidth ) * environment.width / blockSize );
    cursor.y = parseInt( ( event.pageY / innerHeight ) * environment.height / blockSize );
    if( cursor.active ) {
      grid[cursor.y][cursor.x] = 1;
    }
    var context = environment.getContext("2d");
    context.fillStyle = "#fff";
    context.globalAlpha = 0.1;
    context.fillRect( cursor.x * blockSize, cursor.y * blockSize, blockSize, blockSize );
  }
};

var paused = false;
var delayedStart = undefined;
addEventListener( "mousemove", cursor.track );
addEventListener( "mousedown", function() { cursor.active = true; paused = true; clearTimeout(delayedStart); } );
addEventListener( "mouseup", function() { cursor.active = false; delayedStart = setTimeout( function() { paused = false; }, 1000 ); } );

function generate( width, height, density ) {
  var grid = [];
  for( var y = 0; y < height; y++ ) {
    grid[y] = [];
    for( var x = 0; x < width; x++ ) {
      grid[y][x] = Math.random() <= density ? 1 : 0;
    }
  }
  return grid;
}

function update(grid) {
  var copy = [];
  for( var y = 0; y < grid.length; y++ ) {
    copy[y] = [];
    for( var x = 0; x < grid[y].length; x++ ) {
      var  a = grid[y][x],
           n = 0,
          _y = y > 0 ? y - 1 : grid.length - 1,
          y_ = y + 1 < grid.length ? y + 1 : 0,
          _x = x > 0 ? x - 1 : grid[y].length - 1,
          x_ = x + 1 < grid[y].length ? x + 1 : 0;
      n += grid[_y][_x] + grid[_y][x] + grid[_y][x_];
      n += grid[y_][_x] + grid[y_][x] + grid[y_][x_];
      n += grid[y][_x] + grid[y][x_];
      if( a > 0 && ( n < 2 || n > 3 ) ) {
        copy[y][x] = 0;
      } else if( a < 1 && n == 3 ) {
        copy[y][x] = 1;
      } else {
        copy[y][x] = a;
      }
    }
  }
  for( var y = 0; y < grid.length; y++ ) {
    for( var x = 0; x < grid[y].length; x++ ) {
      grid[y][x] = copy[y][x];
    }
  }
}

function draw( canvas, size ) {
  if( !size ) { size = 1; }
  var context = canvas.getContext("2d");
  context.fillStyle = "#010";
  context.globalAlpha = 1;
  context.fillRect( 0, 0, canvas.width, canvas.height );
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.shadowColor = "#000";
  for( var y = 0; y < grid.length; y++ ) {
    for( var x = 0; x < grid[y].length; x++ ) {
      if( grid[y][x] == 0 ) {
        continue;
      }
      context.fillStyle = "#050";
      context.globalAlpha = 1;
      context.fillRect( x * size, y * size, size, size );
    }
  }
  context.fillStyle = "#555";
  for( var y = 0; y < grid.length; y++ ) {
    context.globalAlpha = 0.2;
    context.fillRect( 0, y * blockSize, canvas.width, 1 );
  }
  for( var x = 0; x < grid[0].length; x++ ) {
    context.globalAlpha = 0.2;
    context.fillRect( x * blockSize, 0, 1, canvas.height );
  }
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

var blockSize = 8;
var environment = document.getElementById("environment");
environment.width = window.innerWidth;
environment.height = window.innerHeight;
var grid = generate( environment.width / blockSize, environment.height / blockSize, 0.1 );

setInterval( function() {
  if( !paused ) {
    update( grid );
  }
  draw( environment, blockSize );
}, 1000 / 10 );

