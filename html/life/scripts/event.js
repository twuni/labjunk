define( function() {

  var Event = function() {

    var subscribers = [];

    this.subscribe = function( subscriber ) {
      if( typeof(subscriber) === "function" ) {
        subscribers.push( subscriber );
      }
    };

    this.unsubscribe = function( subscriber ) {
      for( var i = 0; i < subscribers.length; i++ ) {
        if( subscribers[i] === subscriber ) {
          subscribers.splice( i, 1 );
          i--;
        }
      }
    };

    this.publish = function( object ) {
      for( var i = 0; i < subscribers.length; i++ ) {
        subscribers[i]( object );
      }
    };

    this.each = function( f ) {
      for( var i = 0; i < subscribers.length; i++ ) {
        var proceed = f.call( subscribers[i], subscribers[i], i );
        if( proceed === false ) {
          break;
        }
      }
    };

  };

  return Event;

} );
