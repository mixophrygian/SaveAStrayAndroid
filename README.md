to get oauthsignature working again properly with uri-js, add the line 

`    URI.SCHEMES = {};  `

in the file uri-js/build/schemes/http.js
