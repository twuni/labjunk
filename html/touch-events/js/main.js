( function() {

  var events = "touchstart,touchmove,touchend".split(",");

  for( var i = 0; i < events.length; i++ ) {
    var section = document.createElement("section");
    section.id = events[i];
    document.getElementById("console").appendChild( section );
  }

  var stringify = function( object, chain ) {

    if( !chain ) { chain = []; }

    for( var i = 0; i < chain.length; i++ ) {
      if( object === chain[i] ) {
        return object;
      }
    }

    chain.push( object );

    var type = typeof(object);

    if( /(string|number)/.test(type) ) {
      chain.pop();
      return object;
    }

    if( /(undefined|function)/.test(type) ) {
      chain.pop();
      return undefined;
    }

    if( /(DOM|HTML).+/.test(type) ) {
      chain.pop();
      return object;
    }

    if( object ) {
      chain.pop();
      return Object.prototype.toString.call( object );
    }

    if( /(object)/.test(type) ) {
      var values = [];
      if( Object.prototype.toString.call(object) === "[object Array]" ) {
        for( var i = 0; i < object.length; i++ ) {
          values.push( arguments.callee(object[i],chain) );
        }
      } else {
        for( var key in object ) {
          values.push( key + "=" + arguments.callee(object[key],chain) );
        }
      }
      chain.pop();
      return values.join(",");
    }

    chain.pop();
    return object;

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
