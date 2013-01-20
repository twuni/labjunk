require( [
  "jquery",
  "i18n"
], function( $, T ) {

  var $form = $( "<form>" );

  $( "color,date,datetime,datetime-local,email,month,number,range,search,tel,time,url,week,password".split(",") ).each( function( i, type ) {

    var $input = $( "<input>" ).attr( {
      id: type,
      type: type,
      name: type,
      placeholder: T.input + " " + type + "..."
    } );

    var $label = $( "<label>" ).attr( {
      "for": type
    } ).text( type );

    var $fieldset = $( "<fieldset>" );

    $fieldset.append( $label ).append( $input );

    $form.append( $fieldset );

  } );

  var $submit = $( "<button>" ).attr( "type", "submit" ).text( T.button );

  $form.append( $submit );

  $( "header" ).after( $form );

} );
