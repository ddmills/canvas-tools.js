function SpriteLayer(layer) {

}
window.map = {
    init: function() {
        this.tiles = {};
        this.collision_layers = {};
        this.loaded = false;
        this.map = [];
        
        this.layer = 'background';
        this.sprite = 'colors';
        
        this.width = 0;
        this.height = 0;
        
        window.log('map initialized');
    },
    
    /* load a map which corresponds to given sprite */   
    load_sprite_map: function(layer, sprite_name, map) {
        this.sprite = sprite_name;
        this.map = map;
        
        this.width = map.length;
        this.height = map[0].length;

        window.draw.background_resize();
        window.viewport.background_resize();
        
        for (var i = 0; i < map.length; i++) {
            for(var j = 0; j < map[i].length; j++) {
                window.draw.sub_sprite(this.sprite, layer, map[i][j], j * window.constants.TILE_WIDTH, i * window.constants.TILE_HEIGHT);
            }
        }
        
        window.log('map: ' + sprite_name + ' (' + this.width + ', ' + this.height + ')');
    },
    
    /* load a collision map */
    load_collision_map: function(collision_layer, map) {
        //this.collision_layers[collision_layer] = [][];
        for (var i = 0; i < map.length; i++) {
            for(var j = 0; j < map[i].length; j++) {
                if (map[i][j] == 0) {
                    this.collision_layers[collision_layer][i][j] = false;
                } else {
                    this.collision_layers[collision_layer][i][j] = true;
                }
            }
        }
    },
    
    /* check if  there is a collision at (x, y) in the collision_layer */
    check_collision: function(collision_layer, x, y) {
        return collision_layer[x][y];
    },
    
    /* set the (x, y) in the collision layer to be true or false */
    set_collision: function(collision_layer, x, y, collision) {
        this.collision_layers[collision_layer][x][y] = collision;
    },
    
    /* show the content editor */
    show_editor: function() {
        window.gui.show_window('window_editor', true);
    }
}