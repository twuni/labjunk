require( [
  "jquery",
  "prettyDate"
], function( $ ) {

  var authorPattern = /^.*[&\?]author=([^=&]+)(?:[&\?].*)?$/gi;
  var authorName = decodeURIComponent( authorPattern.test(location.search) && location.search.replace( authorPattern, "$1" ) || "twuni" );

  $( "header h1" ).text( authorName );

  var format = function( input ) {
    var output = "";
    for( var i = 0; i < input.length; i++ ) {
      var k = input[i];
      if( /[#@]/.test(k) ) {
        var buffer = "";
        for( i = i + 1; i < input.length && /\w/.test(input[i]); i++ ) {
          buffer += input[i];
        }
        var key = /#/.test(k) ? "topic" : "author";
        output += '<a rel="' + key + '" href="index.html?' + key + '=' + buffer + '">' + k + buffer + '</a>';
        i--;
      } else if( /`/.test(k) ) {
        output += '<code>';
        for( i = i + 1; i < input.length && input[i] !== '`'; i++ ) {
          output += input[i];
        }
        output += '</code>';
      } else {
        output += k;
      }
    }
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