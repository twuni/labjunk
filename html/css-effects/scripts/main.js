require( [
  "jquery"
], function( $ ) {

  var $form = $( "<form>" );

  $( "color,date,datetime,datetime-local,email,month,number,range,search,tel,time,url,week".split(",") ).each( function( type ) {

    var $input = $( "<input>" ).attr( {
      id: type,
      type: type,
      name: type,
      placeholder: "Enter " + type + "..."
    } );

    var $label = $( "<label>" ).attr( {
      "for": type
    } ).text( type );

    var $fieldset = $( "<fieldset>" );

    $fieldset.append( $label ).append( $input );

    $form.append( $fieldset );

  } ).appendTo( $form );

  var $submit = $( "<button>" ).attr( "type", "submit" ).text( "Play" );

  $form.append( $submit );

  $( "body" ).append( $form );

} );
