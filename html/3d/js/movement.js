var Movement = function( x, y, from ) {

  this.timestamp = Date.now ? Date.now() : new Date().getTime();
  this.position = { x: x, y: y };
  this.velocity = { x: 0, y: 0 };
  this.acceleration = { x: 0, y: 0 };

  if( from instanceof Movement ) {

    var time = this.timestamp - from.timestamp;

    this.velocity.x = ( this.position.x - from.position.x ) / time;
    this.velocity.y = ( this.position.y - from.position.y ) / time;

    this.acceleration.x = ( this.velocity.x - from.velocity.x ) / time;
    this.acceleration.y = ( this.velocity.y - from.velocity.y ) / time;

  }

  if( this.report ) { this.report(); }

};

Movement.prototype.to = function( x, y ) { return new Movement( x, y, this ); };

( function( movement ) {

  function on( events, f ) {
    if( typeof(events) === "string" ) {
      events = [ events ];
    }
    for( var i = 0; i < events.length; i++ ) {
      document.addEventListener( events[i], f, false );
    }
  };

  on( [ "touchmove", "mousemove"], function(event) {
    var to = event.touches ? event.touches[0] : event;
    movement = movement && movement.to( to.pageX, to.pageY );
  }, false );

  on( [ "mousedown", "touchstart" ], function(event) {
    var to = event.touches ? event.touches[0] : event;
    movement = new Movement( to.pageX, to.pageY );
  }, false );

  on( [ "mouseup", "touchend" ], function(event) {
    movement = undefined;
  }, false );

} )();
