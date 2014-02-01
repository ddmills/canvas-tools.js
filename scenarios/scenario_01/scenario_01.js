Derpy = function() {
    this.count = 1;
}

Derpy.prototype.update = function(delta) {
    this.count++;
    console.log('hey i\'m updating!');
    if (this.count > 100) {
        g.pause();
    }
}

$(window).ready(function() {

    //var d1 = new Derpy();
    
    // the id of the HTML element where you want the game
    window.g = new Game('my_game');
    
     /* add some images */
    g.resources.add_image('tree', 'img/tree.png');

    /* add some sprites */
    g.resources.add_sprite('new', 'img/sprites/new.png', 2, 2);
    g.resources.add_sprite('dirt', 'img/sprites/dirt.png', 2, 2);

    g.constants.TILE_HEIGHT = 32;
    g.constants.TILE_WIDTH = 32;
    
    g.start(function() {
        /* add some layers */
        g.draw.add_layer('background', false, true);
        g.draw.add_layer('trees', false, true);
        g.draw.add_layer('overlay', true, true);
        /* draw on those layers */
        g.draw.image('tree', 'background', 0, 0);     
        
        /* hide the loading div */
        $('#loading').hide();
    });
});