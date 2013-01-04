var graph = {

  backgroundColor: "#000",
  axisColor: "#fff",
  guideColor: "#555",
  lineColor: "#0f0",
  areaColor: "#050",
  refreshInterval: 100,

  renderTo: function( canvas, data ) {

    var context = canvas.getContext("2d");

    // Draw background.

    context.fillStyle = graph.backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    // Draw guides.

    context.globalAlpha = 0.5;
    context.fillStyle = graph.guideColor;
    var guideHeight = canvas.height / 10;
    for( var y = 1; y < 10; y += 2 ) {
      context.fillRect( 0, y * guideHeight, canvas.width, guideHeight );
    }
    context.globalAlpha = 1.0;

    // Draw data.

    context.strokeStyle = graph.lineColor;
    context.fillStyle = graph.areaColor;

    context.beginPath();
    context.moveTo( 0, canvas.height );
    var sectionWidth = canvas.width / ( data.length - 1 );
    for( var x = 0; x < data.length; x++ ) {
      context.lineTo( sectionWidth * x, canvas.height - ( data[x] * canvas.height ) );
    }
    context.stroke();

    // Fill in the area below the data.

    context.lineTo( canvas.width, canvas.height );
    context.lineTo( 0, canvas.height );
    context.closePath();
    context.globalAlpha = 0.5;
    context.fill();
    context.globalAlpha = 1.0;

    // Draw axes.

    context.lineWidth = 1.0;
    context.strokeStyle = graph.axisColor;

    context.strokeRect( 0, 0, canvas.width, canvas.height );

  }

};

( function( parameters ) {
  var data = [];
  var interval = setInterval( function() {
    graph.renderTo( parameters.canvas, data );
    data.push( parameters.nextValue() );
    if( data.length >= 20 ) {
      data.shift();
    }
  }, graph.refreshInterval );

} )( {
  canvas: document.getElementsByTagName("canvas")[0],
  nextValue: ( function() {
    var y = 0.5;
    return function() {
      var dy = -0.1 + Math.random() * 0.2;
      y = Math.min( Math.max( 0, y + dy ), 1 );
      return y;
    };
  } )()
} );

// TODO: Show mean, median, mode, standard deviation, maximum, and minimum for the data set.
// TODO: Map the unit values on the x-y axes to ranges for coverage. For example, the x-axis may represent 20 units of time at 100ms each, and the y-axis may represent a percentage of RAM allocated.
