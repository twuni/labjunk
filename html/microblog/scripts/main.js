require( [
  "jquery"
], function( $ ) {

  var author = decodeURIComponent( location.search.replace( /^.*[&\?]author=([^=&]+)(?:[&\?].*)?$/gi, "$1" ) || "twuni" );

  var $timeline = $("#timeline");
  var $author = $("<a>").attr( {
    "rel": "author",
    "href": "index.html?author=" + encodeURIComponent( author )
  } ).text( author );

  $.getJSON( "posts/" + author + ".json", function( timeline ) {
    for( var key in timeline ) {
      var $post = $("<section>");
      $post.append( $author.clone() );
      $post.append( $("<time>").attr( "datetime", key ).text( key ) );
      $post.append( $("<p>").text( timeline[key] ) );
      $timeline.append( $post );
    }
  } ).error( function() {
    $timeline.text( "Sorry, " + author + " has no posts." );
  } );

} );