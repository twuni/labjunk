define( [
  "color",
  "life/model",
  "polyfills/requestAnimationFrame"
], function( Color, Life ) {

  var LifeRenderer = function( parameters ) {

    var life = parameters.model || Life.generate();
    var backgroundColor = parameters.backgroundColor || new Color( 0x001000 );
    var foregroundColor = parameters.foregroundColor || backgroundColor.invert();
    var shadows = !!parameters.shadows;
    var decay = parameters.decay === undefined ? 3 : parameters.decay;
    var gridlines = !!parameters.gridlines;
    var cursor = parameters.cursor || { x: -1, y: -1, decay: 0 };

    this.draw = function( canvas ) {

      var context = canvas.getContext("2d");

      context.fillStyle = backgroundColor.toString();
      context.globalAlpha = 1 / ( decay + 1 );
      context.fillRect( 0, 0, canvas.width, canvas.height );

      if( shadows ) {
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowBlur = 1;
        context.shadowColor = backgroundColor.toString();
      }

      var width = canvas.width / life.width;
      var height = canvas.height / life.height;

      life.onEachCell( function() {

        if( !this.alive ) {
          return;
        }

        context.fillStyle = this.colorBlending === "monotone" ? foregroundColor.toString() : this.color.toString();
        context.globalAlpha = 1;
        context.fillRect( this.position.x * width, this.position.y * height, width, height );

      } );

      if( gridlines ) {

        var gridColor = backgroundColor.average( foregroundColor );

        for( var y = 0; y < life.height; y++ ) {
          context.fillStyle = gridColor.toString();
          context.globalAlpha = 0.2;
          context.fillRect( 0, y * height, canvas.width, 1 );
        }

        for( var x = 0; x < life.width; x++ ) {
          context.fillStyle = gridColor.toString();
          context.globalAlpha = 0.2;
          context.fillRect( x * width, 0, 1, canvas.height );
        }

      }

      if( cursor.decay > 0 ) {
        context.fillStyle = foregroundColor.toString();
        context.globalAlpha = 0.25;
        context.fillRect( cursor.x * width, cursor.y * height, width, height );
        cursor.decay--;
      }

    };

    ( function( paused ) {

      var renderer = this;

      renderer.start = function( canvas ) {
        paused = false;
        requestAnimationFrame( function() {
          if( !paused ) { requestAnimationFrame( arguments.callee ); }
          renderer.draw( canvas );
        } );
      };

      renderer.stop = function() {
        paused = true;
      };

    } ).call( this );

  };

  return LifeRenderer;

} );
