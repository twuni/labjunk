var Color = function() {
  switch( arguments.length ) {
    case 1:
      this.value = arguments[0];
      break;
    case 3:
      var r = arguments[0], g = arguments[1], b = arguments[2];
      this.value = ( r << 16 ) | ( g << 8 ) | b;
      break;
    default:
      throw "IllegalArgumentException: Valid arguments are (int) and (int,int,int).";
  }
};

Color.random = function() {
  return new Color( Math.floor( Math.random() * 0xFFFFFF ) );
};

( function() {

  function mask( color, offset ) {
    return 0xFF & ( color >> ( 8 * offset ) );
  }

  Color.prototype = {

    r: function() { return mask( this.value, 2 ); },
    g: function() { return mask( this.value, 1 ); },
    b: function() { return mask( this.value, 0 ); },

    /**
     * @return a new color that is the per-channel average of this color and another color.
     */
    average: function( another ) {
      return new Color( ( this.r() + another.r() ) / 2, ( this.g() + another.g() ) / 2, ( this.b() + another.b() ) / 2 );
    },

    /**
     * @return a new color that is the per-channel product of this color and another color.
     */
    multiply: function( another ) {
      return new Color( this.r() * another.r(), this.g() * another.g(), this.b() * another.b() );
    },

    /**
     * @return a new color that is the per-channel sum of this color and another color.
     */
    add: function( another ) {
      return new Color( this.r() + another.r(), this.g() + another.g(), this.b() + another.b() );
    },

    /**
     * @return a new color that multiplies, then adds this color and another color.
     */
    sumproduct: function( another ) {
      return this.multiply( another ).add( another );
    },

    /**
     * @return this color as a hexadecimal formatted color string (e.g: "#335599")
     */
    toString: ( function( format ) {
      return function() {
        var result = ( this.value || 0 ).toString( 16 );
        return format.slice( 0, format.length - result.length ) + result;
      };
    } )( "#000000" )

  };

} )();
