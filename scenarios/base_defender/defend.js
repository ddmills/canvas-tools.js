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
        g.entities.init();
    });
}
Wall = function(x, y, style) {
    this.x = x;
    this.y = y;
    this.style = style;
    this.type = this.determine_type();
    this.draw();
}
Wall.prototype.draw = function() {
    g.draw.sub_sprite('walls', 'buildings', this.type, this.x * 32, this.y *32, 32, 32);
}
Wall.prototype.determine_type = function() {
    if (this.style == 'stonewall') {
        var bin = g.map.get_bin_sum(this.x, this.y);
        var bin_style = g.map.styles[bin];
        if (bin_style == undefined) {
            return 0;
        } else {
            return bin_style;
        }
    }
    
    if (this.style == 'poison') {
        return 12;
    }
    
    if (this.style == 'fire') {
        return 13;
    }
    
    if (this.style == 'frost') {
        return 14;
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
Wall.prototype.set_style = function(style) {
    this.style = style;
    this.recalculate();
}
Wall.prototype.remove = function() {
    g.draw.clear_rectangle('buildings', this.x * 32, this.y *32, 32, 32);
}

Monster = function(type) {
    this.type = type;
    this.x = g.entities.spawn_x * 32;
    this.y = g.entities.spawn_y * 32;
    this.speed = -.25;
    console.log(this.x + ' ' + this.y);
    this.anim = g.draw.animation(this.type, 'monsters', 'loop', 125, this.x, this.y, 32, 32, 0);
}
Monster.prototype.move = function() {
    this.x += this.speed;
    this.y = this.y;
    console.log(this.x + ' ' + this.y);
    this.anim.move(this.speed, 0);
    this.anim.draw();
}
Monster.prototype.update = function() {
    this.move();
}

set_build_type = function(style) {
    g.cursor.style = style;
    console.log(this);
}
spawn = function(type) {
    console.log('spawnin ' + type);
    g.entities.spawn(type);
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
    g.resources.add_sprite('walls', './img/sprite/walls.png', 4, 4);
    g.resources.add_sprite('crawler', './img/sprite/crawler.png', 4, 1);
    
    /* draw a square around the mouse tile */
    g.cursor = {
        init: function() {
            g.add_hook(this);
            g.events.add_hook(this);
            this.style = 'stonewall';
        },
        update: function() {
            var x = g.events.tile_x * 32;
            var y = g.events.tile_y * 32;
            var color = 'white';
            if (this.style =='stonewall') {
                color = 'grey';
            } else if (this.style == 'destroy') {
                color = 'red';
            } else if (this.style == 'fire') {
                color = 'yellow';
            } else if (this.style == 'poison') {
                color = 'green';
            } else if (this.style == 'frost') {
                color = 'blue';
            }
            
            
            
            g.draw.rectangle('particles', x, y, 32, 32, color, color, .25);
            //g.map.draw_numbs();
        },
        mouse_up: function(e) {
            if (g.events.mouse_over && e.which == 1) { 
                var x = g.events.tile_x;
                var y = g.events.tile_y;
                var tile = g.map.tiles[y][x];
                if (this.style == 'stonewall') {
                    g.map.add_wall(x, y, 'stonewall');
                    //console.log(g.map.get_bin_sum(x, y));
                } else if (this.style == 'destroy') {
                    g.map.remove_wall(x, y);
                } else if (tile != 0) {
                    tile.set_style(this.style);
                }
            }
        }
    };
    
    /* overwrite Game.map */
    g.map = {
        init: function() {
            this.img_name = 'walls';
            this.width = 25;
            this.height = 18;
            this.tiles = [];
            for (var i = 0; i < this.height; i++) {
                this.tiles[i] = [];
                for (var j = 0; j < this.width; j++) {
                        this.tiles[i][j] = 0;
                }
            }
        },
        add_wall: function(x, y, type) {
            if (this.tiles[y][x] == 0) {
                this.tiles[y][x] = new Wall(x, y, type);
                this.recalc_neighbors(x, y);
            }
        },
        remove_wall: function(x, y) {
            if (this.tiles[y][x] != 0) {
                this.tiles[y][x].remove();
                this.tiles[y][x] = 0
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
                    if (this.tiles[y + i] == undefined) {
                        neighbs[n] = 0;
                    } else {
                        if (this.tiles[y + i][x + j] == undefined) {
                            neighbs[n] = 0;
                        } else {
                            neighbs[n] = this.tiles[y + i][x + j];
                        }
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
        draw_numbs : function() {
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    if (this.tiles[i][j] == 0) {
                        g.draw.text('0', 'particles', j * 32, i * 32, 'white');
                    } else {
                        g.draw.text(this.tiles[i][j].type + 1, 'particles', j*32, i*32, 'red');
                    }
                }
            }
        },
        recalc_neighbors: function(x, y) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) {

                    } else {
                        if (this.tiles[y + i] != undefined) {
                            if (this.tiles[y + i][x + j] != 0 && this.tiles[y+i][x+j] != undefined) {
                                this.tiles[y + i][x + j].recalculate();
                            }
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
            396 : 2,
            // 4
            160 : 4,
            168 : 4,
            232 : 4,
            224 : 4,
            144 : 5,
            400 : 5,
            402 : 5,
            146 : 5,
            36 : 8,
            38 : 8,
            294 : 8,
            292 : 8,
            20 : 9,
            84 : 9,
            92 : 9,
            28 : 9
        }
    };
    
    g.entities = {
        init : function() {
            this.monsters = [];
            this.spawn_y = 8;
            this.spawn_x = 24;
            g.add_hook(this);
        },
        spawn : function(type) {
            this.monsters.push (new Monster(type));
        },
        update : function(delta) {
            for (var monster in this.monsters) {
                this.monsters[monster].update();
            }
        }
    }
});