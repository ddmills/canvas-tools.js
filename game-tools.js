function Game() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    this.paused = false; // pauses the game when true
    this.hooks = []; // a list of objects to update each frame
    this.started = false; // true when game has started
    this.time = 0; // current game time
    this.time_started = 0; // time started
    
    /* MANAGERS */
    this.constants = {
        MIP_MAPPING : false, // disable or enable mip mapping
        
        GAME_SPEED : 1,  // game speed mulitplier
        
        TILE_HEIGHT : 32,
        TILE_WIDTH : 32,
        
        PAN_MARGIN : 32, // margin for panning
        PAN_SPEED : 25, // speed for panning
    };
    this.resources = {
        init: function() {
            this.ready = false;
            this.images = {}
            this.sprites = {};
            this.sounds = {};
            this.images_to_load = {};
            //window.log('resources initialized');
        },
        
        /* add an image to be loaded */
        add_image: function(image_name, source) {
            this.images_to_load[image_name] = source;
        },
        
        /* add a sprite to be loaded */
        add_sprite: function(image_name, source, clip_x, clip_y) {
            this.images_to_load[image_name] = source;
            this.sprites[image_name] = new Sprite(image_name, clip_x, clip_y);
        },
        
        /* call when you're ready to load all images */
        load: function(callback) {   
            var loaded = 0;
            var total = 0;
            if (total == 0) {
                if (callback) {
                    callback();
                }
                return;
            }
            for (var key in this.images_to_load) {
                total++;
            }
            for (var key in this.images_to_load) {
                this.images[key] = new Image();
                this.images[key].onload = function() {
                    if(++loaded >= total) {
                        callback();
                    }
                };
                this.images[key].src = this.images_to_load[key];
            }
        }
    };
    this.logger = {
        init: function() {
            this.log = []; /* keeps track of all log entries */
            this.enabled = true; /* when enabled, keeps track of entries */
            
            this.show_caller = true; /* display the script where the log is being called from */
            this.show_time = true; /* display the time the log was called */
            this.show_loc = true; /* display the line number where the log was called */
            //window.log('logger initialized');
        },
        
        /* adds an entry to the log */
        add_entry: function(entry) {
            this.log.push(entry);
            entry.print();
        },
        
        /* dumps what has been logged so far */
        dump_log: function() {
            this.log = [];
        },
        
        /* displays the whole log at once */
        display_log: function() {
            for (entry in this.log) {
                if (this.log[entry].type != 'console') {
                    this.log[entry].print();
                }
            }   
        },
        
        /* display the history of console commands */
        display_console_history: function() {
            for (entry in this.log) {
                if (this.log[entry].type == 'console') {
                    this.log[entry].print();
                }
            }
        },
        
        /* enable the tracking of non-console logs */
        enable: function(show_caller, show_time, show_loc) {
            this.show_caller = show_caller;
            this.show_time = show_time;
            this.show_loc = show_loc;
            this.enabled = true;
        },
        
        /* disable the tracking of non-console logs */
        disable: function(dump) {
            this.enabled = false;
            if (dump) {
                this.dump_log();
            }
        }
    };
    this.events = {
        init: function() {
            this.hooks = [];
            this.tile_under_mouse = [0, 0];
            
            $(window).mousedown(function(e) {
                window.events.mouse_down(e);
            });
            $(window).mousemove(function(e) {
                window.events.mouse_move(e);
            });
            $(window).mouseup(function(e) {
                window.events.mouse_up(e);
            });
            $(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e) {
                window.events.mouse_wheel(e);
            });
            $('#game_overlay').mouseleave(function(e) {
                window.events.mouse_move(e);
            });
            $(window).keydown(function(e) {
                window.events.key_down(e);
            });
            $(window).keyup(function(e) {
                window.events.key_up(e);
            });
            $(window).resize(function() {
                window.events.resize();
            });
            
            //window.log('events initialized');
        },
        
        mouse_down: function(e) {
        
        }, 
        
        mouse_up: function(e) {
            
        },
        
        mouse_move: function(e) {
            //e.preventDefault();
            this.mouse_to_tile(e.clientX, e.clientY);
            this.event_fired('mouse_move', e);
        },
        
        mouse_wheel: function(e) {
            e.preventDefault();
        },
        
        mouse_leave: function(e) {
            
        }, 
        
        key_down: function(e) {
            this.event_fired('key_down', e);
        },
        
        key_up: function(e) {
            this.event_fired('key_up', e);
        },
        
        resize: function() {
            window.log('window resized');
            this.event_fired('resize');
        },
        
        add_hook: function(object) {
            this.hooks.push(object);
        },
        
        event_fired: function(event_name, e) {
            for (var i = 0; i < this.hooks.length; i++) {
                ob = this.hooks[i];
                if (typeof ob !== "undefined" && ob !== null) {
                    if (typeof ob[event_name] !== "undefined" && ob[event_name] !== null) {
                        ob[event_name](e);
                    }
                }
            }
        },
        
        /* convert x, y mouse coordinates to tile coordinates */
        mouse_to_tile: function(x, y) {
            var x_tile = -1 * parseInt((window.draw.pan_x - x) / window.constants.TILE_WIDTH);
            var y_tile = -1 * parseInt((window.draw.pan_y - y) / window.constants.TILE_HEIGHT);
            this.tile_under_mouse = [x_tile, y_tile];   
        }
    };
    this.draw = {
        init: function() {
            this.layers = {};
            this.animations = [];
            window.game.add_hook(this);
            window.events.add_hook(this);

            $('#game_area').css('left', 0);
            $('#game_area').css('top', 0);
            $('#game_area').css('position', 'fixed');
            
            $('#game_overlay').css('left', 0);
            $('#game_overlay').css('top', 0);
            $('#game_overlay').css('position', 'fixed');
            
            window.log('draw initialized');
        },
        
        /* create a new canvas layer */
        add_layer: function(name, overlay, persistant) {
            var canvas = $('<canvas id="can_' + name + '" class="game_canvas">');
             var ctx = canvas[0].getContext('2d'); 

            if (persistant) {
                canvas.data('persistant', true);
            } else {
                canvas.data('persistant', false);
                canvas.data('cleared', false);
            }
            
            // set canvas size and add it to the document
            if (overlay) {
                canvas.attr('width', window.viewport.screen_width);
                canvas.attr('height', window.viewport.screen_height);
                
                $('#game_overlay').append(canvas);
                canvas.data('view', 'overlay');
            } else {
                canvas.attr('width', window.map.width);
                canvas.attr('height', window.map.height);
                
                $('#game_area').append(canvas);
                canvas.data('view', 'background');
            }
            
            // set the mip-maping
            this.set_mip_mapping(window.constants.MIP_MAPPING);
            
            
            return this.layers[name] = canvas;
        },
        
        /* draw an image to a layer */
        image: function(image_name, layer_name, x, y, w, h, r) {
            var img = window.resources.images[image_name];
            var lay = this.layers[layer_name];
            if (img && lay) {
                if (x == null) {
                    x = 0;
                }
                if (y == null) {
                    y = 0;
                }
                if (r == null && h == null && w) {
                    r = w;
                    w = window.resources.images[image_name].width;
                    h = window.resources.images[image_name].height;
                }
                if (w == null) {
                    w = window.resources.images[image_name].width;
                }
                if (h == null) {
                    h = window.resources.images[image_name].height;
                }
                if (r == null) {
                    r = 0;
                }
                
                var ctx = lay[0].getContext('2d');
                if (r == 0) {
                    if (this.layers[layer_name].data('persistant') == false) {
                        this.layers[layer_name].data('cleared', false);
                    }
                    return ctx.drawImage(img, x, y, w, h);
                } else {
                    ctx.save();
                    ctx.translate(x + (w/2), y+(h/2));
                    ctx.rotate(r);
                    ctx.drawImage(img, -(w/2), -(h/2), w, h);
                    ctx.restore();
                    if (this.layers[layer_name].data('persistant') == false) {
                        this.layers[layer_name].data('cleared', false);
                    }
                    return true;
                }
            }
            return false;
        },
        
        /* draw just a part of an image */
        sub_image: function(img_name, layer_name, x, y, w, h, offset_x, offset_y, offset_w, offset_h, r) {
            var img = window.resources.images[img_name];
            var lay = this.layers[layer_name];
            if (r == null) {
                r = 0;
            }
            if (img && lay) {
                var ctx = this.layers[layer_name][0].getContext('2d');
                
                if (r == 0) {
                    ctx.drawImage(img, offset_x, offset_y, offset_w, offset_h, x, y, w, h);
                    return true;
                } else {
                    ctx.save();
                    ctx.translate(x + (w/2), y+(h/2));
                    ctx.rotate(r);
                    ctx.drawImage(img, offset_x, offset_y, offset_w, offset_h, -(w/2), -(h/2), w, h);
                    ctx.restore();
                    return true;
                }

            }
            return false;
        },
        
        /* draw a sub frame of a sprite */    
        sub_sprite: function(sprite_name, layer_name, sub_sprite, x, y, w, h, r) {
            var sprite = window.resources.sprites[sprite_name];
            var img = window.resources.images[sprite_name];
            var lay = this.layers[layer_name];
            if (w == null) {
                w = window.constants.TILE_WIDTH;
            }
            if (h == null) {
                h = window.constants.TILE_HEIGHT;
            }
            if (r == null) {
                r = 0;
            }
            if (sprite && img && lay) {
                var ctx = this.layers[layer_name][0].getContext('2d');
                var off_h = img.width/sprite.clips_y;
                var off_w = img.width/sprite.clips_x;
                var off_x = (sub_sprite % sprite.clips_x) * off_w;
                var off_y = Math.floor(sub_sprite / (sprite.clips_y)) * off_h;
                if (r == 0) {
                    ctx.drawImage(img, off_x, off_y, off_w, off_h, x, y, w, h);
                    return true;
                } else {
                    ctx.save();
                    ctx.translate(x + (w/2), y+(h/2));
                    ctx.rotate(r);
                    ctx.drawImage(img, off_x, off_y, off_w, off_h, -(w/2), -(h/2), w, h);
                    ctx.restore();
                    return true;
                }
            }
            return false;
        },
        
        /* draw a rectangle on the map */
        rectangle: function(layer, x, y, w, h, color, fill, fill_alpha) {
            var ctx = this.layers[layer][0].getContext('2d');
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            if (fill) {
                ctx.fillStyle = fill;
                if (fill_alpha) {
                    ctx.globalAlpha = fill_alpha;
                }
                ctx.fillRect(x, y, w, h);
            }
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.restore();
            if (this.layers[layer].data('persistant') == false) {
                this.layers[layer].data('cleared', false);
            }
        },
        
        /* clear a rectangle on a layer */
        clear_rectangle: function(layer, x, y, w, h, r) {
            var ctx = this.layers[layer][0].getContext('2d');
            if (r == null || r == 0) {
                return ctx.clearRect(x, y, w, h);
            }
            ctx.save();
            ctx.translate(x + (w/2), y+(h/2));
            ctx.rotate(r);
            ctx.clearRect(-(w/2), -(h/2), w, h);
            ctx.restore();
        },
        
        /* clear a whole layer */
        clear_layer: function(layer) {
            var ctx = this.layers[layer][0].getContext('2d');
            ctx.clearRect(0, 0, this.screen_width, this.screen_height);
            this.layers[layer].data('cleared', true);
        },
        
        /* draw a sprite to a layer */
        animation: function(sprite_name, layer, type, speed, x, y, w, h, r) {
            if (window.resources.images[sprite_name]) {
                if (window.resources.sprites[sprite_name]) {
                    if (type == null) {
                        type = 'loop';
                    }
                     if (x == null) {
                        x = 0;
                    }
                    if (y == null) {
                        y = 0;
                    }
                    if (w == null) {
                        w = window.resources.images[sprite_name].width/window.resources.sprites[sprite_name].clips_x;
                    }
                    if (h == null) {
                        h = window.resources.images[sprite_name].height/window.resources.sprites[sprite_name].clips_y;
                    }
                    if (speed == null) {
                        speed = 100;
                    }
                    if (r == null) {
                        r = 0;
                    }
                    var anim = new Animation(sprite_name, layer, x, y, w, h, speed, r, type);
                    this.animations.push(anim);
                    return anim;
                } else {
                    return false;
                }
            }
            return false
        },
        
        /* called when the window gets resized */
        resize: function() {
            $('.gui_container').css('height', $(window).height());
            $('.gui_container').css('width', $(window).width());
            for (layer in this.layers) {
                if (this.layers[layer].data('view') == 'overlay') {
                    this.layers[layer].attr('width', window.viewport.screen_width);
                    this.layers[layer].attr('height', window.viewport.screen_height);
                }
            }
            this.set_mip_mapping(window.constants.MIP_MAPPING);
        },
        
        /* called when the map changes size */
        background_resize: function() {
            $('.gui_container').css('height', $(window).height());
            $('.gui_container').css('width', $(window).width());
            for (layer in this.layers) {
                if (this.layers[layer].data('view') == 'background') {
                    var canvas = $('#can_' + layer);
                    canvas.attr('width', window.map.width * window.constants.TILE_WIDTH);
                    canvas.attr('height', window.map.height * window.constants.TILE_HEIGHT);
                }
            }
            this.set_mip_mapping(window.constants.MIP_MAPPING);
        },
        
        set_mip_mapping: function(mip) {
            for (layer in this.layers) {
                var canvas = $('#can_' + layer);
                var ctx = canvas[0].getContext('2d'); 
                ctx.imageSmoothingEnabled = mip;
                ctx.mozImageSmoothingEnabled = mip;
                ctx.webkitImageSmoothingEnabled = mip;
            }
        },
        
        /* called by window.viewport when the game_area needs to be moved to x, y */
        move_view: function(x, y) {
            $('#game_area').css('left', x);
            $('#game_area').css('top', y);
        },
        
        /* this is called every frame from window.game.update()*/
        update: function(delta) {
            /* update all of the animations */
            for (var i = 0; i < this.animations.length; i++) {
                var anim = this.animations[i];
                anim.frame_update(delta);
                anim.rotate(delta/700);
                anim.move(delta/50, 0);
                anim.draw();
            }
            
            /* clear all non-persistant layers (if necessary) */
            for (layer in this.layers) {
                if (this.layers[layer].data('persistant') == false) {
                    if (this.layers[layer].data('cleared') == false) {
                        this.clear_layer(layer);
                    }
                }
            }
        }
    };
  
    this.resources.init();
    this.logger.init();
    this.events.init();
    this.draw.init();
}

/* starts the game */
Game.prototype.start = function(callback) {
    this.started = true;
    var d = new Date(); 
    this.time = d.getTime();
    this.time_started = this.time;
    var me = this;
    var cb = callback;
    this.resources.load(function() { 
        me.update(me);
        if (cb) {
            cb();
        }
    });
},

/* pause the game */
Game.prototype.pause = function() {
    if (!this.paused && this.started) {
        this.paused = true;
    }
},

/* unpause the game */
Game.prototype.unpause = function() {
    if (this.paused && this.started) {
        var d = new Date();
        this.time = d.getTime();
        this.paused = false;
        this.update(this);
    }
},

/* change the game speed */
Game.prototype.set_speed = function() {
    this.constants.GAME_SPEED = speed;
},

/* add a hook to the main game loop */
Game.prototype.add_hook = function(hook) {
    if (typeof hook.update === 'function') {
        
        this.hooks.push(hook);
        return true;
    }
    return false;
},

/* the main game loop */
Game.prototype.update = function(me) {
    if (!me.paused && me.started) {
        
        var now = new Date().getTime();
        var delta = (now - (me.time || now)) * me.constants.GAME_SPEED;
        me.time = now;
        
        if (me.hooks) {
            for (var i = 0; i < me.hooks.length; i++) {
                me.hooks[i].update(delta);
            }
        }
        requestAnimationFrame(function() { me.update(me); });
    }
}
