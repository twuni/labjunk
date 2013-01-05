var graph = {

  backgroundColor: "#000",
  axisColor: "#fff",
  guideColor: "#555",
  refreshInterval: 100,
  dataSources: [],

  addDataSource: function( parameters ) {
    parameters.stroke = parameters.stroke || "transparent";
    parameters.fill = parameters.fill || "transparent";
    parameters.next = parameters.next || function() {
      return 0;
    };
    parameters.limit = parameters.limit || 20;
    parameters.data = parameters.data || [];
    graph.dataSources.push( parameters );
  },

  renderTo: function( canvas ) {

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
    for( var i = 0; i < graph.dataSources.length; i++ ) {

      var dataSource = graph.dataSources[i];

      dataSource.data.push( dataSource.next() );
      if( dataSource.data.length >= dataSource.limit ) {
        dataSource.data.shift();
      }

      context.strokeStyle = dataSource.stroke;
      context.fillStyle = dataSource.fill;

      context.beginPath();
      context.moveTo( 0, canvas.height );
      var sectionWidth = canvas.width / ( dataSource.limit - 2 );
      for( var x = 0; x < dataSource.data.length; x++ ) {
        context.lineTo( sectionWidth * x, canvas.height - ( dataSource.data[x] * canvas.height ) );
      }
      context.stroke();

      // Fill in the area below the data.

      context.lineTo( Math.min( ( x - 1 ) * sectionWidth, canvas.width ), canvas.height );
      context.lineTo( 0, canvas.height );
      context.closePath();
      context.globalAlpha = 0.5;
      context.fill();
      context.globalAlpha = 1.0;

    }

    // Draw axes.

    context.lineWidth = 1.0;
    context.strokeStyle = graph.axisColor;

    context.strokeRect( 0, 0, canvas.width, canvas.height );

  }

};

( function( parameters ) {

  graph.renderTo( parameters.canvas );

  var RandomData = function( stroke, fill ) {
    this.stroke = stroke || "transparent";
    this.fill = fill || "transparent";
    this.currentValue = Math.random();// Initial value.
  };

  RandomData.prototype = {
    next: function() {
      var dy = -0.1 + Math.random() * 0.2;
      this.currentValue = Math.min( Math.max( 0, this.currentValue + dy ), 1 );
      return this.currentValue;
    }
  };

  graph.addDataSource( new RandomData( "#0f0", "#050" ) );
  graph.addDataSource( new RandomData( "#f00", "#500" ) );
  graph.addDataSource( new RandomData( "#ff0", "#550" ) );

  var interval = setInterval( function() {
    graph.renderTo( parameters.canvas );
  }, graph.refreshInterval );

} )( {
  canvas: document.getElementsByTagName("canvas")[0],
} );

// TODO: Show mean, median, mode, standard deviation, maximum, and minimum for the data set.
// TODO: Map the unit values on the x-y axes to ranges for coverage. For example, the x-axis may represent 20 units of time at 100ms each, and the y-axis may represent a percentage of RAM allocated.
