require( [
  "parameters",
  "life/model",
  "life/view",
  "life/controller"
], function( Parameters, Life, LifeView, LifeController ) {

  var parameters = Parameters.fromQueryString();

  var createTruthTable = function( truths ) {
    var table = [];
    for( var i = 0; i < truths.length; i++ ) {
      table[parseInt(truths[i])] = true;
    }
    return function( n ) {
      return !!table[n];
    };
  };

  var cursor = { x: -1, y: -1, decay: 100 };
  var canvas = document.getElementById("environment");

  ( function() {
    var bounds = this.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;
  } ).call( canvas );

  var model = Life.generate( {
    density: parameters.density,
    width: canvas.width / parameters.size,
    height: canvas.height / parameters.size,
    blending: parameters.blending,
    survival: createTruthTable( parameters.s.split("") ),
    birth: createTruthTable( parameters.b.split("") )
  } );

  var view = new LifeView( {
    model: model,
    cursor: cursor,
    gridlines: parameters.grid === "yes",
    shadows: parameters.shadows === "yes",
    decay: parameters.decay
  } );

  var controller = new LifeController( {
    canvas: canvas,
    model: model,
    pause: parameters.pause,
    cursor: cursor
  } );

  view.start( canvas );
  model.resume( {
    speed: parameters.speed
  } );

} );
