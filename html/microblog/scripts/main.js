require( [
  "jquery",
  "prettyDate"
], function( $ ) {

  var authorPattern = /^.*[&\?]author=([^=&]+)(?:[&\?].*)?$/gi;
  var authorName = decodeURIComponent( authorPattern.test(location.search) && location.search.replace( authorPattern, "$1" ) || "twuni" );

  var $timeline = $("#timeline");
  var $author = $("<a>").attr( {
    "rel": "author",
    "href": "index.html?author=" + encodeURIComponent( authorName )
  } ).append( $("<img>").attr( {
    alt: authorName,
    title: authorName
  } ) );

  $.getJSON( "users/" + authorName + ".json", function( author ) {
    $author.find("img").attr( {
      src: "http://gravatar.com/avatar/" + author.email + "?s=32&d=identicon",
      title: author.name
    } );
  } );

  $.getJSON( "users/" + authorName + "/posts.json", function( timeline ) {
    for( var key in timeline ) {
      var $post = $("<section>");
      $post.append( $author.clone() );
      $post.append( $("<time>").attr( "datetime", key ).text( prettyDate( key ) ) );
      $post.append( $("<p>").text( timeline[key] ) );
      $post.hide();
      $timeline.append( $post );
      $post.fadeIn();
    }
  } ).error( function() {
    $timeline.text( "Sorry, " + authorName + " has no posts." );
  } );

} );