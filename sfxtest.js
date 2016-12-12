var Player = require('player');
 
// create player instance 
var player = new Player();


player.on('error', function(err){
  // when error occurs 
  console.log(err);
});

player.add('public/sfx/sfx6.mp3');

player.play();
player.on('playend',function(item){
	delete player;
});
