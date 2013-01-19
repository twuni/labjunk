define( [
  "life/model",
  "color",
  "movement"
], function( Life, Color, Movement ) {

  var LifeController = function( parameters ) {

    var canvas = parameters.canvas;
    var life = parameters.model || Life.generate();
    var pause = parameters.pause === undefined ? 1000 : parameters.pause;
    var cursor = parameters.cursor || { x: -1, y: -1, decay: 100 };
    var touching = false;

    var bounds = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    var color = new Color( 0 );

    Movement.subscribe( "start", function() {
      touching = true;
      color = Color.random();
      life.pause();
    } );

    Movement.subscribe( "move", function( movement ) {

      cursor.decay = 100;
      cursor.x = Math.floor( ( movement.position.x - bounds.left ) / bounds.width * life.width );
      cursor.y = Math.floor( ( movement.position.y - bounds.top ) / bounds.height * life.height );

      if( touching ) {
        life.touch( cursor.x, cursor.y, color );
      }

    } );

    Movement.subscribe( "stop", function() {
      touching = false;
      life.resume( { delay: pause } );
    } );

  };

  return LifeController;

} );
