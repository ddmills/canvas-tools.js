window.viewport = {
    init: function() {
        window.game.add_hook(this);
        window.events.add_hook(this);
        
        /* how much the viewport has panned */
        this.pan_x = 0;
        this.pan_y = 0;
        
        /* how much the viewport should pan on next update */
        this.panning_x = 0;
        this.panning_y = 0;
        
        /* the width and height of the screen */
        this.screen_width = $(window).width();
        this.screen_height = $(window).height();
        
        /* the maximum distance the camera can pan */
        this.max_pan_x = this.screen_width - (window.constants.TILE_WIDTH * window.map.width);
        this.max_pan_y = this.screen_height - (window.constants.TILE_HEIGHT * window.map.height);
  
        window.log('viewport initialized');
    },
    
    /* called when the window gets resized, by window.events*/
    resize: function() {
        this.screen_width = $(window).width();
        this.screen_height = $(window).height();
        this.max_pan_x = this.screen_width - (window.constants.TILE_WIDTH * window.map.width);
        this.max_pan_y = this.screen_height - (window.constants.TILE_HEIGHT * window.map.height);
    },
    
    background_resize: function() {
        this.max_pan_x = this.screen_width - (window.constants.TILE_WIDTH * window.map.width);
        this.max_pan_y = this.screen_height - (window.constants.TILE_HEIGHT * window.map.height);
    },

    /* this is called every time the mouse moves */
    mouse_move: function(e) {
        mouse_x = e.clientX;
        mouse_y = e.clientY;
        
        var margin = window.constants.PAN_MARGIN;
        var s_speed = window.constants.PAN_SPEED;
        if (mouse_x <= margin) {
            var diff = parseInt(((margin - mouse_x) / margin) * s_speed);
            if (diff > s_speed) {
                diff = s_speed;
            }
            this.panning_x = diff;

        } else if (mouse_x >= this.screen_width - margin) {
            var diff = s_speed - parseInt(((this.screen_width - mouse_x)/margin) * s_speed);
            if (diff > s_speed) {
                diff = s_speed;
            }
            
            this.panning_x = -1 * diff;

        } else {
            this.panning_x = 0;
        }
        
        if (mouse_y <= margin) {
            var diff = parseInt(((margin - mouse_y) / margin) * s_speed);
            if (diff > s_speed) {
                diff = s_speed;
            }
            this.panning_y = diff;
        } else if (mouse_y >= this.screen_height - margin) {
            var diff = s_speed - parseInt(((this.screen_height - mouse_y)/margin) * s_speed)
            
            if (diff > s_speed) {
                diff = s_speed;
            }
            
            this.panning_y = -1 * diff;

        } else {
            this.panning_y = 0;
        }
    },
    
    /* this is called whenever the screen needs to pan */
    pan: function() {
        this.pan_x += this.panning_x;
        this.pan_y += this.panning_y;
       
       if (this.pan_x > 0) {
            this.pan_x = 0;
        } else if (this.pan_x < this.max_pan_x) {
            this.pan_x = this.max_pan_x;
        }

        if (this.pan_y > 0) {
            this.pan_y = 0;
        } else if (this.pan_y < this.max_pan_y) {
            this.pan_y = this.max_pan_y;
        }
        
        //window.log('max pan ' + this.max_pan_x + ' ' + this.max_pan_y);
        //window.log('panned ' + this.pan_x + ' ' + this.pan_y);
        window.draw.move_view(this.pan_x, this.pan_y);
        
    },
    
    /* this is called every frame from window.game.update()*/
	update: function(delta) {
        /* check if we need to pan */
        if (this.panning_x != 0 || this.panning_y != 0) {
            this.pan();
        }
        
        /* draw highlighter at cursor */
        var x_loc = window.events.tile_under_mouse[0] * window.constants.TILE_WIDTH +  this.pan_x;
        var y_loc = window.events.tile_under_mouse[1] * window.constants.TILE_HEIGHT + this.pan_y;
        //this.image('highlighter', 'refreshed', x_loc, y_loc, window.constants.TILE_WIDTH, window.constants.TILE_HEIGHT);
        window.draw.rectangle('refreshed', x_loc, y_loc, window.constants.TILE_WIDTH, window.constants.TILE_HEIGHT, '#0A2933', '#0033CC', .25);
	}

}