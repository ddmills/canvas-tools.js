window.events = {
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
        
        window.log('events initialized');
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
    
}