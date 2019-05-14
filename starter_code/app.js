const express = require('express');
const exphbs  = require('express-handlebars');
const helpers = require('./public/lib/helpers');
// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.engine(
    ".hbs",
    exphbs({
      extname: ".hbs",
      defaultLayout: "mainLayout",    
      partialsDir: __dirname + "/views/partials/",
      helpers: helpers
    })
  );

  app.set("view engine", ".hbs");
  app.use("/public", express.static("public"));




// setting the spotify-api goes here:
var spotifyApi = new SpotifyWebApi({
    clientId: '',
    clientSecret: ''
  });

  // Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
   
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );




// the routes go here:
app.get("/",(req,res)=>{

    res.render("index")

})

app.get('/artists', (req, res) =>{   
    spotifyApi.searchArtists(req.query.artist).then(
        function (data) {
            res.render('artists', { artists: data.body.artists.items, title: "Artists List", layout: 'artistsLayout'} );
        },
        function (err) {
            console.error(err);
        }
    ); 
  });

  app.get('/albums', (req, res) =>{   
    spotifyApi.getArtistAlbums(req.query.id).then(
        function (data) {
            
            res.render('albums', { albums: data.body.items, title: "Albums List", layout: 'artistsLayout'} );

        },
        function (err) {
            console.error(err);
        }
    ); 
  });

  app.get('/tracks', (req, res) =>{  

    spotifyApi.getAlbumTracks(req.query.id, { limit : 5, offset : 1 })
    .then(
        function (data) {
            console.log('tracks list', data.body.items);
            
            res.render('tracks', { tracks: data.body.items, title: "Tracks Preview", layout: 'artistsLayout'} );

        },
        function (err) {
            console.error(err);
        }
    ); 
  });



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
