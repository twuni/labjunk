( function() {

  var events = ( window.ontouchstart === undefined ? "mousedown,mousemove,mouseup" : "touchstart,touchmove,touchend" ).split(",");

  for( var i = 0; i < events.length; i++ ) {
    var section = document.createElement("section");
    section.id = events[i];
    document.getElementById("console").appendChild( section );
  }

  Object.prototype.getType = function() { return Object.prototype.toString.call(this).replace( /^\[object (.+)\]$/, "$1" ); };

  var stringify = function( object, chain ) {

    if( !chain ) { chain = []; }

    for( var i = 0; i < chain.length; i++ ) {
      if( object === chain[i] ) {
        return object;
      }
    }

    var type = typeof(object);

    if( !object || /^(boolean|undefined|function|string|number)$/.test(type) || /^(global|HTML.+|DOM.+)$/.test(object.getType()) ) {
      return object;
    }

    var values = [];
    chain.push( object );
    if( object.getType() == "Array" ) {
      for( var i = 0; i < object.length; i++ ) {
        var value = arguments.callee( object[i], chain );
        values.push( value );
      }
    } else {
      for( var key in object ) {
        var value = arguments.callee( object[key], chain );
        values.push( key + "=" + value );
      }
    }
    chain.pop();
    return values.join(", ");

  };

  var log = function( event ) {

    var container = document.getElementById( event.type );
    if( !container ) { return; }

    var message = "<dl>";

    message += "<dt>type</dt><dd><strong>" + event.type + "</strong></dd>";

    for( var key in event ) {
      var value = event[key];
      if( key.toUpperCase() === key || typeof(value) === "function" || key === "type" ) {
        continue;
      }
      message += "<dt>" + key + "</dt><dd>" + stringify(value) + "</dd>"
    }

    message += "</dl>";
    container.innerHTML = message;

  };

  for( var i = 0; i < events.length; i++ ) {
    document.addEventListener( events[i], log, false );
  }

} )();
