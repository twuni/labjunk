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
  for( var y = 0; y < grid.length; y++ ) {
    for( var x = 0; x < grid[y].length; x++ ) {
      context.fillStyle = grid[y][x] == 1 ? "#050" : "#010";
      context.fillRect( x * size, y * size, size, size );
    }
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
var canvas = document.getElementsByTagName("canvas")[0];
var grid = generate( canvas.width / blockSize, canvas.height / blockSize, 0.5 );

setInterval( function() {
  update(grid);
  draw( canvas, blockSize );
}, 1000 / 10 );
