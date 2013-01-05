var Graph = function( parameters ) {

  if( !parameters.target ) {
    throw "'target' must be specified with a valid Canvas object.";
  }

  this.target = parameters.target;
  this.backgroundColor = parameters.backgroundColor || "transparent";
  this.borderColor = parameters.borderColor || "transparent";
  this.guideColor = parameters.guideColor || "transparent";
  this.refreshInterval = parameters.refreshInterval || 100;
  this.dataSources = [];

};

Graph.prototype = {

  subscribe: function( parameters ) {
    parameters.stroke = parameters.stroke || "transparent";
    parameters.fill = parameters.fill || "transparent";
    parameters.next = parameters.next || function() {
      return 0;
    };
    parameters.limit = parameters.limit || 20;
    parameters.data = parameters.data || [];
    this.dataSources.push( parameters );
  },

  unsubscribe: function( name ) {
    for( var i = 0; i < this.dataSources.length; i++ ) {
      if( this.dataSources[i].name == name ) {
        return this.dataSources.splice( i, 1 )[0];
      }
    }
  },

  bringToFront: function( name ) {
    this.subscribe( this.unsubscribe( name ) );
  },

  renderTo: function( canvas ) {

    var context = canvas.getContext("2d");

    // Draw background.

    context.fillStyle = this.backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    // Draw guides.

    context.globalAlpha = 0.5;
    context.fillStyle = this.guideColor;
    var guideHeight = canvas.height / 10;
    for( var y = 1; y < 10; y += 2 ) {
      context.fillRect( 0, y * guideHeight, canvas.width, guideHeight );
    }
    context.globalAlpha = 1.0;

    // Draw the graph for each data source.
    for( var i = 0; i < this.dataSources.length; i++ ) {

      var dataSource = this.dataSources[i];

      // Consult the data source for its next value, shifting out the oldest value if necessary.
      dataSource.data.push( dataSource.next() );
      if( dataSource.data.length >= dataSource.limit ) {
        dataSource.data.shift();
      }

      context.beginPath();
      context.moveTo( 0, canvas.height );
      var sectionWidth = canvas.width / ( dataSource.limit - 2 );
      for( var x = 0; x < dataSource.data.length; x++ ) {
        context.lineTo( sectionWidth * x, canvas.height - ( dataSource.data[x] * canvas.height ) );
      }

      // Apply the stroke only if it's not configured to be transparent.
      if( dataSource.stroke != "transparent" ) {
        context.strokeStyle = dataSource.stroke;
        context.stroke();
      }

      if( dataSource.fill == "transparent" ) {
        // Skip shading if we're configured to do a transparent fill.
        continue;
      }

      // Apply shading below the line.
      context.lineTo( Math.min( ( x - 1 ) * sectionWidth, canvas.width ), canvas.height );
      context.lineTo( 0, canvas.height );
      context.closePath();
      context.globalAlpha = 0.5;
      context.fillStyle = dataSource.fill;
      context.fill();
      context.globalAlpha = 1.0;

    }

    // Draw axes.

    context.lineWidth = 1.0;
    context.strokeStyle = this.borderColor;

    context.strokeRect( 0, 0, canvas.width, canvas.height );

  },

  start: function() {
    if( this.interval !== undefined ) {
      return;
    }
    var graph = this;
    graph.renderTo( graph.target );
    graph.interval = setInterval( function() {
      graph.renderTo( graph.target );
    }, graph.refreshInterval );
  },

  stop: function() {
    if( this.interval !== undefined ) {
      clearInterval( this.interval );
    }
    this.interval = undefined;
  }

};

var RandomData = function( parameters ) {
  this.name = parameters.name;
  this.stroke = parameters.stroke || "transparent";
  this.fill = parameters.fill || "transparent";
  this.currentValue = Math.random();// Initial value.
};

RandomData.prototype = {
  next: function() {
    var dy = -0.1 + Math.random() * 0.2;
    this.currentValue = Math.min( Math.max( 0, this.currentValue + dy ), 1 );
    return this.currentValue;
  }
};

var graph = new Graph( {
  backgroundColor: "#000",
  guideColor: "#333",
  borderColor: "#fff",
  refreshInterval: 100,
  target: document.getElementsByTagName( "canvas" )[0]
} );

graph.subscribe( new RandomData( { name: "CPU", stroke: "#0f0", fill: "#050" } ) );
graph.subscribe( new RandomData( { name: "RAM", stroke: "#f00", fill: "#500" } ) );
graph.subscribe( new RandomData( { name: "HDD", stroke: "#ff0", fill: "#550" } ) );

graph.start();

// TODO: Show mean, median, mode, standard deviation, maximum, and minimum for the data set.
// TODO: Map the unit values on the x-y axes to ranges for coverage. For example, the x-axis may represent 20 units of time at 100ms each, and the y-axis may represent a percentage of RAM allocated.
