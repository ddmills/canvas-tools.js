window.entities = {
    init: function() {
        this.entities = {};
        window.game.add_hook(this);
        window.log('entities initialized');
    },
    
    update: function(delta) {
        for (entity_name in this.entities) {
            var entity = this.entities[entity_name];
            if (entity.needs_update) {
                entity.update(delta);
            }
        }
        //window.log('updating entities');
    },
    
    spawn_entity: function(entity) {
        window.log('spawning an entity');
    }
}