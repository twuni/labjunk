/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 *
 * Modified for formatting and readability.
 */
function prettyDate( time ) {

	var date = new Date( ( time || "" ).replace( /-/g, "/" ).replace( /[TZ]/g, " " ) );
  var secondsAgo = ( new Date().getTime() - date.getTime() ) / 1000;
  var daysAgo = Math.floor( secondsAgo / 86400 );

  if( isNaN( daysAgo ) || 0 > daysAgo || daysAgo >= 31 ) {
    return time;
  }

  return daysAgo == 0 && (
    secondsAgo < 60 && "just now"
    || secondsAgo < 120 && "1 minute ago"
    || secondsAgo < 3600 && Math.floor( secondsAgo / 60 ) + " minutes ago"
    || secondsAgo < 7200 && "1 hour ago"
    || secondsAgo < 86400 && Math.floor( secondsAgo / 3600 ) + " hours ago" 
  )
  || daysAgo == 1 && "Yesterday" 
  || daysAgo < 7 && daysAgo + " days ago"
  || daysAgo < 31 && Math.ceil( daysAgo / 7 ) + " weeks ago";

}
