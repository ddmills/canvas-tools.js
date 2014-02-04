window.scenario = {
    init: function() {
        this.load('none');
        window.log('scenario initialized')
    },
    
    /* load scenario files */
    load: function(data_file) {
        /* add some images */
        window.resources.add_image('bkg', './img/ground.png');
        window.resources.add_image('scare', './img/scaretactics.jpg');
        window.resources.add_image('astro', './img/derper.png');
        window.resources.add_image('highlighter', './img/highlighter.png');
        
        window.resources.add_sprite('colonist', './img/sprites/colonist_bare_walk.png', 4, 3);
        window.resources.add_sprite('colonist_suit', './img/sprites/colonist_suit_walk.png', 4, 3);
        window.resources.add_sprite('colors', './img/sprites/background_sprites.png', 2, 2);
        window.resources.add_sprite('dirt', './img/sprites/dirt.png', 2, 2);
        window.resources.add_sprite('door', './img/sprites/door_open.png', 4, 4);
        
        scenario_load_gui();
        
    },
    
    /* begin the scenario */
    begin: function() {
        /* add some layers */
        window.draw.add_layer('background', false, true);
        window.draw.add_layer('sprites', false, true);
        window.draw.add_layer('overlay', true, true);
        window.draw.add_layer('refreshed', true, false);

        /* draw some animations */
        window.draw.animation('colonist', 'sprites', 'loop', 100, 50, 100, 32, 32, 125, 0);
        window.draw.animation('colonist', 'sprites', 'loop', 100, 500, 500, 100, 100, 0);
        window.draw.animation('colonist_suit', 'sprites', 'loop', 100, 50, 150, 32, 32);
        window.draw.animation('door', 'sprites', 'loop', 100, 175, 100, 64, 32);
        window.draw.animation('colonist', 'overlay', 'loop', 100, 210, 60, 32, 32, 125, 0);
        
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
        
        window.map.load_sprite_map('background', 'dirt', rand_map);
        
         /* draw some images */
        //window.draw.image('scare', 'background', 0, 0, 800, 600);
        window.draw.image('astro', 'overlay', 25, 450, Math.PI);
        window.draw.image('astro', 'background', 50, 50, 100, 100);
        window.draw.image('colonist', 'background', 1000, 200, 400, 300);

    }
}