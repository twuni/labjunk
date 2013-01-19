var requestAnimationLoop = function( f ) {
  requestAnimationFrame( function() {
    requestAnimationFrame( arguments.callee );
    f();
  } );
};
