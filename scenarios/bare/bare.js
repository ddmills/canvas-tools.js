$(window).ready(function() {
    /* create a game object */
    var my_game = new Game('my_game_area');

    /* add different types of resources */
    my_game.resources.add_image('fluffy cloud', 'images/cloud.png');
    my_game.resources.add_image('dirt', 'images/ground.png');
    my_game.resources.add_sprite('dog jumping', 'images/dog.png', 3, 2);

    /* create different types of draw layers */
    my_game.draw.add_layer('sky', false, true);
    my_game.draw.add_layer('ground', false, true);
    my_game.draw.add_layer('animations', false, true);

    /* set various game constants */
    my_game.constants.FULLSCREEN = true;
    my_game.constants.TILE_HEIGHT = 32;
    my_game.constants.TILE_WIDTH = 16;

    /* start the game */
    my_game.start(function() {
        console.log('the game has started');
        //my_game.draw.image('fluffy cloud', 'sky', 200, 100);
        //my_game.draw.image('dirt', 'ground');
        //my_game.draw.animation('dog jumping', 'animations', 'loop');
    });
});