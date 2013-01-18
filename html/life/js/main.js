var createTruthTable = function( truths ) {
  var table = [];
  for( var i = 0; i < truths.length; i++ ) {
    table[parseInt(truths[i])] = true;
  }
  return function( n ) {
    return !!table[n];
  };
};

( function( parameters ) {

  console.log( "[initialize]:", parameters );

  var cursor = { x: -1, y: -1, decay: 100 };
  var canvas = document.getElementById("environment");

  canvas.matchBounds();

  console.log( "-", canvas.width, canvas.height );

  var life = Life.generate( {
    density: parameters.density,
    width: canvas.width / parameters.size,
    height: canvas.height / parameters.size,
    blending: parameters.blending,
    survival: createTruthTable( parameters.s.split("") ),
    birth: createTruthTable( parameters.b.split("") )
  } );

  var renderer = new LifeRenderer( {
    life: life,
    cursor: cursor,
    gridlines: parameters.grid === "yes",
    shadows: parameters.shadows === "yes",
    decay: parameters.decay
  } );

  var controller = new LifeController( {
    canvas: canvas,
    life: life,
    pause: parameters.pause,
    cursor: cursor
  } );

  renderer.start( canvas );
  life.resume( {
    speed: parameters.speed
  } );

} )( Parameters.fromQueryString() );
