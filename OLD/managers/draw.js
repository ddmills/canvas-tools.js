function Animation(sprite_name, layer, x, y, w, h, speed, rotation, type) {
    this.sprite = window.resources.sprites[sprite_name];
    this.layer = layer;
    
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.rotation = rotation;
    
    this.offset_height = window.resources.images[sprite_name].height/this.sprite.clips_y;
    this.offset_width = window.resources.images[sprite_name].width/this.sprite.clips_x;
    
    this.clips = [this.sprite.clips_x,  this.sprite.clips_y];
    this.clip = [0, 0];
    
    this.total_frames = this.clips[0] * this.clips[1];
    
    this.paused = false;
    this.flip = true;
    this.speed = speed;
    
    this.type = type;
    this.frame = 0;
    this.time = 0;
    this.needs_draw = true;
    this.drawn = false;
}
Animation.prototype.clear = function() {
    window.draw.clear_rectangle(this.layer, this.x, this.y, this.width, this.height, this.rotation);
    this.drawn = false;
    this.needs_draw = true;
}
Animation.prototype.clip_increment = function(amount) {
    if (this.type == 'loop') {
        this.frame = ((this.frame + amount) % this.total_frames);
        var x = (this.frame % this.clips[0]);
        var y = Math.floor(this.frame / this.clips[0]);
        this.clip = [x, y];
        this.needs_draw = true;
    } else if (this.type == 'flip') {
        if (this.flip) {
            this.frame = this.frame + amount;
            if (this.frame >= this.total_frames) {
                this.frame = this.total_frames - 1;
            } else {
                this.needs_draw = true;
            }
            var x = (this.frame % this.clips[0]);
            if (this.clips[1] != 1) {
            var y = Math.floor(this.frame / this.clips[1]);
        } else {
            var y = 0;
        }
            this.clip = [x, y];
        } else {
            this.frame = this.frame - amount;
            if (this.frame <= 0) {
                this.frame = 0;
            } else {
                this.needs_draw = true;
        }
        var x = (this.frame % this.clips[0]);
        if (this.clips[1] != 1) {
            var y = Math.floor(this.frame / this.clips[1]);
        } else {
            var y = 0;
        }
        this.clip = [x, y];
        }
    } else if (this.type == 'property') {
        if (this.frame != this.prop['prop']) {
            this.frame = this.prop['prop'];
            if (this.frame >= this.total_frames) {
                this.frame = this.total_frames - 1;
            } else {
                this.needs_draw = true;
            }
            var x = (this.frame % this.clips[0]);
            if (this.clips[1] != 1) {
                var y = Math.floor(this.frame / this.clips[1]);
            } else {
                var y = 0;
            }
            this.clip = [x, y];
        } else {
            this.needs_draw = false;
        }
    }
    return this.frame;
}
Animation.prototype.frame_update = function(delta) {
    this.time += delta;
    var lapse = Math.floor(this.time / this.speed);
    
    if (lapse > 0) {
        this.clip_increment(lapse);
        this.time %= this.speed;
        //console.log(this.frame + ": " + this.clips[0] + ", " + this.clips[1]);
        //console.log(this.frame + ": " + this.clip[0] + ", " + this.clip[1]);
    }
}
Animation.prototype.draw = function() {
    if (this.needs_draw) {
        var offset_x = this.clip[0] * this.offset_width; //anim.clip_x;
        var offset_y = this.clip[1] * this.offset_height; //anim.clip_y;
        if (this.drawn) {
            this.clear();
        }
        this.drawn = window.draw.sub_image(this.sprite.name, this.layer, this.x, this.y, this.width, this.height, offset_x, offset_y, this.offset_width, this.offset_height, this.rotation);
        this.needs_draw = !this.drawn;
    }
    return this.needs_draw;
}
Animation.prototype.rotate = function(rotation) {
    if (this.drawn) {
        this.clear();
    }
    this.rotation += rotation;
}
Animation.prototype.move = function(new_x, new_y) {
    if (this.drawn) {
        this.clear();
    }
    this.x += new_x;
    this.y += new_y;
}

window.draw = {
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
}