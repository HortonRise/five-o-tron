var Player = require('player');
 var player = new Player('/sfx/sfx1.mp3');
 player.play(function(err, player){
   console.log('playend!');
 });
