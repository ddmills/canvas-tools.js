/* A custom 'Tree'  object that draws itself to the game */
Tree = function(x, y) {
    y = y - 2;
    g.draw.image('tree', 'trees', x * g.constants.TILE_WIDTH,  y * g.constants.TILE_HEIGHT, g.constants.TILE_WIDTH*2, g.constants.TILE_HEIGHT*3);
    g.draw.image('tree_shadow', 'background',  x * g.constants.TILE_WIDTH, y*g.constants.TILE_HEIGHT+g.constants.TILE_HEIGHT, g.constants.TILE_WIDTH*3, g.constants.TILE_HEIGHT*2);
    
    console.log('making a tree ' + x + ' ' + y);
}

/* request mouse lock whenever the user doesn't have it, and they click on the game. */
$(document).on('click', '#my_game', function() {
    if (!g.viewport.has_mouse) {
        window.g.viewport.request_lock();
    }
});

start = function() {
    /* request mouse lock at the start of the game */
    if (!g.viewport.has_mouse) {
        window.g.viewport.request_lock();
        g.cursor.init();
    }
    
    $('#start').hide(); // hide the start button
    $('#loading').show(); // show the loading div
   
    /* create a random map */
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
        
    /* tell the game to start, and do stuff with the callback */
    g.start(function() {

        g.map.load_sprite_map('background', 'ground', rand_map); 
        
        new Tree(3, 5);
        new Tree(1, 1);
        new Tree(5, 2);
        new Tree(7, 2);
        new Tree(6, 3);
                 
        $('#loading').hide();
        $('#my_game').show();  
    });
}

$(window).ready(function() {
    /* create a game object, from the div with id"my_game" */
    window.g = new Game('my_game');
    
    /* add some resources*/
    g.resources.add_image('tree', 'img/tree.png');
    g.resources.add_image('tree_shadow', 'img/tree_shadow.png');
    g.resources.add_image('cursor', 'img/gui/cursor.png');
    
    /* add a ground sprite */
    g.resources.add_sprite('ground', 'img/sprites/ground.png', 2, 2);

    /* change some game constants */
    g.constants.TILE_HEIGHT = 64;
    g.constants.TILE_WIDTH = 64;
    g.constants.FULLSCREEN = true;
    g.constants.PAN = true;
    
    /* add some draw layers */
    g.draw.add_layer('background', false, true); // a layer for the ground sprite and the shadows
    g.draw.add_layer('trees', false, true); // a layer for the trees. They could have been drawn to background as well.
    g.draw.add_layer('refreshed', true, false); // a layer that gets refreshed every frame, for the cursor
    
    /* create a custom cursor, attach it to the game object */
    g.cursor = {
        init : function() {
            /* the image resources for the cursor */
            this.image = 'cursor';
            /* to get pointer_lock events */
            window.g.events.add_hook(this);
            /* to get an update() event */
            window.g.add_hook(this);
            /* shows or hides the cursor depending on pointer_lock*/
            this.visible = false;
        },
        /* show the cursor when the game gets control of it */
        pointer_lock_gained: function(e) {
            this.visible = true;
        },
        /* hide the cursor when the game loses control of it */
        pointer_lock_lost: function(e) {
            this.visible = false;
        },
        /* method called when the game updates */
        update: function() {
            if (this.visible) {
                window.g.draw.image(this.image, 'refreshed', window.g.events.mouse_x - 8, window.g.events.mouse_y - 8, 16, 16);
            }
        },
        mouse_up: function() {
            console.log(window.g.events);
            new Tree(window.g.events.tile_x, window.g.events.tile_y);
        }
    };
 
});

