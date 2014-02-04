function scenario_load_gui() {

    var content_documentation = "<div style='height:100%; overflow-y: scroll;'><div id='docs' style='padding: 20px;'></div></div>"

    var content_controls = "<div style='padding: 20px'><div id='info_area'></div></div>";
    
    var content_editor = "<table style='width: 100%; height: 100%; padding-left: 10px; padding-right: 15px; padding-top: 0px; padding-bottom: 10px; '><tr style='height: 140px;'><td><h3 style='position:relative; text-align: center;'> Tile Editor </h3><label for='editor_select' style='position: relative; bottom: 0;'> Sprite: </label><select id='editor_select'></select></td></tr><tr><td><div style='overflow: auto; height: 100%;'><table id='editor_table'></table></div></td></tr><tr style='height: 50px;'><td><button id='edtitor_fill'> Fill all with selected sprite </button><button id='edtitor_view'> View map </button></td></tr></table>";
    
    
    /* custom gui for this scenario */
    window.gui.add_window('Engine Documentation', 'window_documentation', content_documentation, true, true, true, 200, 200, 520, 315, 100, 50);
    
    window.gui.add_window('Game Stats', 'window_info', content_controls, true, true, true, 250, 400, 256, 256, 256, 256);
    
    window.gui.add_window('Map Editor', 'window_editor', content_editor, true, true, true, 250, 400, 400, 300, 400, 300);
    
    window.gui.hide_window('window_documentation');
    //window.gui.hide_window('window_info');
    window.gui.hide_window('window_editor');
    
    for (sprite in window.resources.sprites) {
        $('#editor_select').append('<option value="' + sprite + '">' + sprite +'</option>');
    }
    
    $('#docs').html($('#documentation').html());   
}

function populate_editor_table(sprite) {
    console.log(sprite);
    var img = window.resources.images[sprite.name];
    var w = img.width/sprite.clips_x;
    var h = img.height/sprite.clips_y;
    
    var offset_x = 0
    var offset_y = 0
    
    
    var html = '';
    var clip = 0;
    for (var y = 0; y < sprite.clips_y; y++) {
        offset_y = -1 * y * h;
        html += '<tr>';
        for (var x = 0; x < sprite.clips_x; x++) {
            offset_x = -1 * x * w;
            html += '<td><span class="editor_clip" id="editor_clip_' + clip  + '" style="width: ' + w + 'px; height: ' + h + 'px; background-position: ' + offset_x + 'px ' + offset_y + 'px; display: block; border: 1px solid black; background-repeat: no-repeat; background-image: url(' + img.src +')">' + '</span></td>';
            clip++;
        }
        html += '</tr>';
    }
    
    //var html = '<tr><td></td></td>'
    $('#editor_table').html(html);
}

$(document).on('change', '#editor_select', function() {
    populate_editor_table(window.resources.sprites[this.value]);
});

$(document).on('click', '.editor_clip', function() {
    window.log('selected clip ' + $(this).attr('id'));
});

update = function(delta) {
    var new_html = 
        'speed: ' + window.constants.GAME_SPEED + '<br>' +
        'time: ' + window.game.time + ' (ms)<br>' +
        'delta: ' + delta + ' (ms)<br>' +
        'number of hooks: ' + window.game.hooks.length + '<br>' +
        'time since start: ' + ((window.game.time - window.game.time_started) / 1000) + '(s)<br>' +
        'FPS: ' +  parseInt(1000/delta) + '<br>';
    //$('#info_area').html(new_html);
}

