window.game = {
    init: function() {
        this.paused = false; // pauses the game when true
        this.hooks = []; // a list of objects to update each frame
        this.started = false; // true when game has started
        this.time = 0; // current game time
        this.time_started = 0; // time started
        window.log('game initialized');
    },

    /* starts the game */
    start: function() {
        window.log('game started');
        this.started = true;
        var d = new Date(); 
        this.time = d.getTime();
        this.time_started = this.time;
        this.update();
    },

    /* pause the game */
    pause: function() {
        if (!this.paused && this.started) {
            window.log('game paused');
            this.paused = true;
        }
    },

    /* unpause the game */
    unpause: function() {
        if (this.paused && this.started) {
            window.log('game unpaused');
            var d = new Date();
            this.time = d.getTime();
            this.paused = false;
            this.update();
        }
    },

    /* change the game speed */
    set_speed: function(speed) {
        window.constants.GAME_SPEED = speed;
    },
    
    /* add a hook to the main game loop */
    add_hook: function(hook) {
        if (typeof hook.update === 'function') {
            this.hooks.push(hook);
            return true;
        }
        return false;
    },

    /* the main game loop */
    update: function() {
        if (!window.game.paused && window.game.started) {
            var now = new Date().getTime();
            var delta = (now - (window.game.time || now)) * window.constants.GAME_SPEED;
            window.game.time = now;
            
            if (window.game.hooks) {
                for (var i = 0; i < window.game.hooks.length; i++) {
                    window.game.hooks[i].update(delta);
                }
            }
            
           window.requestAnimationFrame(window.game.update);
        }
    }
}