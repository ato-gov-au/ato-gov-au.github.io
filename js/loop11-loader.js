/*

This configures then loads up our loop11 user experience testing library.

This needs special handling:
- it needs to be loaded as the document is loading (hence no document.ready event)
- it should be the last script loaded, or one of the last

*/

window.loop11_key = "013e096a1eca0fd401de5bc447b7cfadd53d73e2";

// This enables us to follow people engaged in a user experience test between domains.
// For information on this flag, see: https://www.loop11.com/help/62
window.l11_clientOptions = { "crossDomainSupport": true };

// This references the *actual* loop11 script. It's the exact code loop11 suggests.
// It uses document.write, which means we have to be careful to call this before the document's loaded.
document.write(unescape("%3cscript src='//cdn.loop11.com/embed.js' type='text/javascript' async=async'%3e%3c/script%3e"));