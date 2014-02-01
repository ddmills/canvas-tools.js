game-tools.js
=============

Tools for creating games in HTML 5 JavaScript canvas

The HTML:
```html
<script src='jquery.min.js'></script>
<script src='game-tools.min.js'></script>
<script src='my_game_script.js'></script>
<div id='my_game_area'></div>
```

The javascript (my_game_script.js):
```javascript
var my_game = new Game('my_game_area');

my_game.resources.add_image('fluffy cloud', 'images/cloud.png');
my_game.draw.add_layer('sky', false, true);
my_game.constants.FULLSCREEN = true;

my_game.start(function() {
    console.log('the game has started');
});
```
