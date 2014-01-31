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

    var d1 = new Derpy();
    
    window.g = new Game();
    
     /* add some images */
    g.resources.add_image('bkg', 'img/ground.png');
    g.resources.add_image('scare', 'img/scaretactics.jpg');
    g.resources.add_image('astro', 'img/derper.png');
    g.resources.add_image('highlighter', 'img/highlighter.png');
    
    g.resources.add_sprite('colonist', 'img/sprites/colonist_bare_walk.png', 4, 3);
    g.resources.add_sprite('colonist_suit', './img/sprites/colonist_suit_walk.png', 4, 3);
    g.resources.add_sprite('colors', './img/sprites/background_sprites.png', 2, 2);
    g.resources.add_sprite('dirt', 'img/sprites/dirt.png', 2, 2);
    g.resources.add_sprite('door', './img/sprites/door_open.png', 4, 4);
    
    
    g.start(function() {
        /* add some layers */
        g.draw.add_layer('background', false, true);
        g.draw.add_layer('sprites', false, true);
        g.draw.add_layer('overlay', true, true);
        g.draw.add_layer('refreshed', true, false);

        /* draw some animations */
        g.draw.animation('colonist', 'sprites', 'loop', 100, 50, 100, 32, 32, 125, 0);
        g.draw.animation('colonist', 'sprites', 'loop', 100, 500, 500, 100, 100, 0);
        g.draw.animation('colonist_suit', 'sprites', 'loop', 100, 50, 150, 32, 32);
        g.draw.animation('door', 'sprites', 'loop', 100, 175, 100, 64, 32);
        g.draw.animation('colonist', 'overlay', 'loop', 100, 210, 60, 32, 32, 125, 0);
        
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
        
        //g.map.load_sprite_map('background', 'dirt', rand_map);
        
         /* draw some images */
        //window.draw.image('scare', 'background', 0, 0, 800, 600);
        g.draw.image('astro', 'overlay', 25, 450, Math.PI);
        g.draw.image('astro', 'background', 50, 50, 100, 100);
        g.draw.image('colonist', 'background', 1000, 200, 400, 300);
    });
});