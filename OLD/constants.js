window.constants = {
    init: function() {
        this.MIP_MAPPING = false; // disable or enable mip mapping
        
        this.GAME_SPEED = 1;  // game speed mulitplier
        
        this.TILE_HEIGHT = 32;
        this.TILE_WIDTH = 32;
        
        this.PAN_MARGIN = 32; // margin for panning
        this.PAN_SPEED = 25; // speed for panning
        
        window.log('constants initialized');
    }
}