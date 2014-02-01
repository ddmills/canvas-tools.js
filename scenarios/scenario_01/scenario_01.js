Tree = function(x, y) {
    g.draw.image('tree', 'trees', x * g.constants.TILE_WIDTH,  y * g.constants.TILE_HEIGHT, g.constants.TILE_WIDTH*2, g.constants.TILE_HEIGHT*3);
    g.draw.image('tree_shadow', 'shadows',  x * g.constants.TILE_WIDTH, y*g.constants.TILE_HEIGHT+g.constants.TILE_HEIGHT, g.constants.TILE_WIDTH*3, g.constants.TILE_HEIGHT*2);
}

$(window).ready(function() {

    //var d1 = new Derpy();
    
    // the id of the HTML element where you want the game
    window.g = new Game('my_game');
    window.g2 = new Game('my_game2');
    
    g2.resources.add_sprite('dirt', 'img/sprites/dirt.png', 2, 2);
    g2.draw.add_layer('background', false, true);
    
    
     /* add some images */
    g.resources.add_image('tree', 'img/tree.png');
    g.resources.add_image('tree_shadow', 'img/tree_shadow.png');
    
    /* add some sprites */
    g.resources.add_sprite('ground', 'img/sprites/ground.png', 2, 2);
    g.resources.add_sprite('dirt', 'img/sprites/dirt.png', 2, 2);

    g.constants.TILE_HEIGHT = 64;
    g.constants.TILE_WIDTH = 64;
    
    g.constants.FULLSCREEN = true;
    
    /* add some layers */
    g.draw.add_layer('background', false, true);
    g.draw.add_layer('shadows', false, true);
    g.draw.add_layer('trees', false, true);
    g.draw.add_layer('refreshed', true, false);
    
    var rand_map = [];
    var rand_x = 100;
    var rand_y = 100;

    for (var i = 0; i < rand_y; i++) {
         rand_map[i] = [];
        for (var j = 0; j < rand_x; j++) {
            var p=  Math.floor((Math.random()*100));
            if (p < 3) {
                rand_map[i][j] = 2;
            } else if (p < 15) {
                rand_map[i][j] = 1;
            } else if (p < 60) {
                rand_map[i][j] = 3;
            } else {
                rand_map[i][j] = 0;
            }
        }
    } 
    
    g2.start(function() {
        g2.map.load_sprite_map('background', 'dirt', rand_map);
    });
    
    g.start(function() {
        new Tree(3, 5);
        new Tree(1, 1);
        new Tree(5, 2);
        new Tree(7, 2);
        new Tree(6, 3);

        g.map.load_sprite_map('background', 'ground', rand_map); 
        
        /* hide the loading div */
        $('#loading').hide();
    });
});