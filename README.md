##Save a Stray - Android

Hello! I am the Android version of the Save a Stray app, written in React Natve.  Behold my vast
differences from the iOS version, namely the completely different
implementation of the navigation, due to the usage of `Navigator IOS` in the
original, iOS build. 

What is this all about?  Visit http://saveastrayapp.com



//past solution to an Android compatibility issue with the uri-js module:

to get oauthsignature working again properly with uri-js, add the line 

`    URI.SCHEMES = {};  `

in the file uri-js/build/schemes/http.js
