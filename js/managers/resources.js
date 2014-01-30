function Sprite(name, clip_size_x, clip_size_y) {
    this.name = name;
    this.clips_x = clip_size_x;
    this.clips_y = clip_size_y;
}

window.resources = {
    init: function() {
        this.ready = false;
        this.images = {}
        this.sprites = {};
        this.sounds = {};
        this.images_to_load = {};
        
        window.log('resources initialized');
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
}