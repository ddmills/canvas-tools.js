start = function() {
    $('#gui_start').hide();
    $('#gui_loading').show();
    
    
    g.start(function() {
        console.log('game started');
        $('#gui_loading').hide();
        $('#game-shelf').show();
        $('#game-shelf').css('width', '100%');
        $('#cell-game').css('width', 800);
        
        
        g.draw.image('bkg', 'background');
        g.cursor.init();
        g.map.init();
        
    });
}

Wall = function(x, y) {
    this.x = x;
    this.y = y;
    this.type = this.determine_type();
    this.draw();
}

Wall.prototype.draw = function() {
    g.draw.sub_sprite('walls', 'buildings', this.type, this.x * 32, this.y *32, 32, 32);
}

Wall.prototype.determine_type = function() {
    var bin = g.map.get_bin_sum(this.x, this.y);
    var style = g.map.styles[bin];
    console.log(bin);
    if (style == undefined) {
        return 0;
    } else {
        return style;
    }
}

Wall.prototype.recalculate = function() {
    var new_type = this.determine_type();
    if (new_type != this.type) {
        this.type = new_type;
        this.remove();
        this.draw();
    }
}

Wall.prototype.remove = function() {
    g.draw.clear_rectangle('buildings', this.x * 32, this.y *32, 32, 32);
}

$(window).ready(function() {
    /* create the game, attach it to the window */
    window.g = new Game('game-div');
    
    /* set constants */
    g.constants.PAN = false;
    g.constants.FULLSCREEN = false;
    g.constants.TILE_HEIGHT = 32;
    g.constants.TILE_WIDTH = 32;
    g.constants.VIEW_WIDTH = 800;
    g.constants.VIEW_HEIGHT = 576;
    g.constants.GAME_AREA_WIDTH = 800;
    g.constants.GAME_AREA_HEIGHT = 576;
    g.constants.MIP_MAPPING = true;
    
    /* add draw layers */
    g.draw.add_layer('background', false, true);
    g.draw.add_layer('buildings', false, true);
    g.draw.add_layer('monsters', false, true);
    g.draw.add_layer('particles', true, false);
    
    /* add resources */
    g.resources.add_image('bkg', './img/bkg.png');
    g.resources.add_sprite('walls', './img/sprite/walls.png', 2, 2);
    
    /* draw a square around the mouse tile */
    g.cursor = {
        init: function() {
            g.add_hook(this);
            g.events.add_hook(this);
            this.fill_color = '#FF9900';
            this.line_color = '#FF3300'
        },
        update: function() {
            var x = g.events.tile_x * 32;
            var y = g.events.tile_y * 32;
            g.draw.rectangle('particles', x, y, 32, 32, this.line_color, this.fill_color, .25);
        },
        mouse_up: function(e) {
            if (e.which == 1) {
                g.map.add_wall(g.events.tile_x, g.events.tile_y);
            } else if (e.which == 3) {
                g.map.remove_wall(g.events.tile_x, g.events.tile_y);
            }
        }
    };
    
    /* overwrite Game.map */
    g.map = {
        init: function() {
            this.img_name = 'walls';
            this.width = 25;
            this.height = 18;
            this.walls = [];
            for (var i = 0; i < this.height; i++) {
                this.walls[i] = [];
                for (var j = 0; j < this.width; j++) {
                        this.walls[i][j] = 0;
                }
            }
        },
        add_wall: function(x, y) {
            if (this.walls[y][x] == 0) {
                this.walls[y][x] = new Wall(x, y);
                this.recalc_neighbors(x, y);
            }
        },
        remove_wall: function(x, y) {
            if (this.walls[y][x] != 0) {
                this.walls[y][x].remove();
                this.walls[y][x] = 0
                this.recalc_neighbors(x, y);
            }
        },
        get_bin_sum: function(x, y) {
            var sum = 0;
            var neighbs = [];
            var n = 0;
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) {
                        j++;
                    }
                    if (this.walls[y + i] == undefined) {
                        neighbs[n] = 0;
                    } else {
                        neighbs[n] = this.walls[y + i][x + j];
                    }
                    n++;
                }
            }
            for (var i = 0; i < neighbs.length; i++) {
                if (neighbs[i] != 0) {
                    sum += Math.pow(2, i + 1);
                }
            }
            return sum; 
        },
        recalc_neighbors: function(x, y) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) {

                    } else {
                        if (this.walls[y + i][x + j] != 0) {
                            this.walls[y + i][x + j].recalculate();
                        }
                    }
                }
            }
        },
        styles : {
            // 1's
            48 : 1,
            112 : 1,
            50 : 1,
            56 : 1,
            304 : 1,
            306 : 1,
            120 : 1,
            312 : 1,
            58 : 1,
            368 : 1,
            378 : 1,
            314 : 1,
            122 : 1,
            370 : 1,
            376 : 1,
            114 : 1,
            // 2's
            214 : 2,
            388 : 2,
            132 : 2,
            140 : 2,
            452 : 2,
            134 : 2,
            142 : 2,
            196 : 2,
            204 : 2,
            390 : 2,
            198 : 2,
            460 : 2,
            454 : 2,
            398 : 2,
            206 : 2,
            462 : 2,
            396 : 2
        }
    };
    
});