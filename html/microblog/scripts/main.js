require( [
  "jquery",
  "prettyDate"
], function( $ ) {

  var authorPattern = /^.*[&\?]author=([^=&]+)(?:[&\?].*)?$/gi;
  var authorName = decodeURIComponent( authorPattern.test(location.search) && location.search.replace( authorPattern, "$1" ) || "twuni" );

  $( "header h1" ).text( authorName );

  var format = function( input ) {
    var output = input;
    output = output.replace( /`([^`]+)`/gi, '<code>$1</code>' );
    output = output.replace( /@([\w]+)/gi, '<a rel="author" href="index.html?author=$1">@$1</a>' );
    output = output.replace( /#([\w]+)/gi, '<a rel="topic" href="index.html?topic=$1">#$1</a>' );
    return output;
  };

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
    $( "header h1" ).text( author.name + " (" + authorName + ")" );
  } );

  $.getJSON( "users/" + authorName + "/posts.json", function( timeline ) {
    for( var key in timeline ) {
      var $post = $("<section>");
      $post.append( $author.clone() );
      $post.append( $("<time>").attr( "datetime", key ).text( prettyDate( key ) ) );
      var $body = $("<p>").text( timeline[key] );
      $body.html( format( $body.text() ) );
      $post.append( $body );
      $post.hide();
      $timeline.append( $post );
      $post.fadeIn();
    }
  } ).error( function() {
    $timeline.text( "Sorry, " + authorName + " has no posts." );
  } );

} );