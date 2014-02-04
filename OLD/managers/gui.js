window.gui = {
    init: function() {
        this.windows = [];
        this.active_win = false;
        window.log('gui initialized');
    },
    
    /* create a new window */
    add_window: function(title, id, content, move, resize, close, x, y, w, h, min_w, min_h) {
        var html = "<div id='" + id + "' class='gui_window' style='" +
            "width: " + w +
            "px; height: " + h +
            "px; top: " + y +
            "px; left: " + x +
            "px; min-width: " + min_w +
            "px; min-height: " + min_h + "px;'>" +
            "<div class='window_content'>" + content + "</div>";
        
        if (move) {
            html += "<div class='handle_graphic gui_handle'><img class='gui_handle' src='./img/gui/win_header.png' alt='>>'><b class='gui_handle' style='margin-left: 10px'>" + title + "</b></div>";
        }
        
        if (close) {
            html += "<img class='closer_graphic closer' src='./img/gui/win_close.png' alt='X'>";
        }
        
        if (resize) {
            html += "<img class='resize_graphic gui_resize' src='./img/gui/win_resize.png' alt='%'>";
        }

        html += "</div>";
        $('#windows').append(html);
        this.windows.push(id);
    },
    
    /* display a window that was already made */
    show_window: function(id, fade) {        
        if (fade) {
            $('#' + id).fadeIn();
        } else {
            $('#' + id).show();
        }
        this.active_win = id;
    },
    
    /* hides a window that was already made */
    hide_window: function(id, fade) {
        if (fade) {
            $('#' + id).fadeIn();
        } else {
            $('#' + id).hide();
        }
    },
    
    /* hide all windows */
    hide_all: function(fade) {
        if (fade) {
            for (win in this.windows) {
                this.windows[win].fadeOut();
            }
        } else {
            for (win in this.windows) {
                this.windows[win].hide();
            }
        }
    },
    
    /* make a window active */
    set_active: function(id) {
        $('#' + this.active_win).css('z-index', 200);
        this.active_win = id;
        $('#' + id).css('z-index', 220);
    }
}

$(document).on('mousedown', '.gui_window', function() {
    window.gui.set_active($(this).attr('id'));
});