/**
* Window functions using jQuery
*
* create a limiting area for your windows by creating an area with the .gui_container class
* create a 'window' element by giving it the .gui_window class
* -- make it moveable by adding a sub element and giving it the .gui_handle class
* -- make it resizable by adding a sub element and giving it the .gui_resize class
* -- make it closeable by adding a sub element and giving it the .gui_closer class
*
* written by Dalton Mills
*/
$(window).ready(function() {
    var curr_element = null; // current element that is selected
    var container = $('.gui_container');
    
    var handle_down = false; // if mouse is pressed on handle
    var resize_down = false; // if mouse is pressed on resize
    
    var last_mouse_x; // position of mouse when it was pressed
    var last_mouse_y; // position of mouse when it was pressed
    
    var last_ele_x; // X position of element before moving
    var last_ele_y; // Y position of element before moving
    
    var last_ele_width; // width of element before resizing
    var last_ele_height; // height of element before resizing
    
    var update_position = function(e) {
        var new_x = e.clientX-(last_mouse_x - last_ele_x);
        var new_y = e.clientY-(last_mouse_y - last_ele_y);

        
        if ($('.gui_container') != null) {
            if (new_x + last_ele_w > $('.gui_container').width()) {
                new_x = $('.gui_container').width() - last_ele_w;
            } else if (new_x < 0) {
                new_x = 0;
            }

            if (new_y + last_ele_h > $('.gui_container').height()) {
                new_y = $('.gui_container').height() - last_ele_h;
            }  else if (new_y < 0) {
                new_y = 0;
            }
        }

        $(curr_element).css('top', new_y);
        $(curr_element).css('left', new_x); 
    };
    
    var update_scale = function(e) {
        var new_w = last_ele_w + (e.clientX - last_mouse_x);
        var new_h = last_ele_h + (e.clientY - last_mouse_y);
        $(curr_element).css('width', new_w);
        $(curr_element).css('height', new_h); 
    };
    
    $(document).on('mousedown', '.gui_handle', function(e) {
        e.preventDefault()
        var wind = $(this).parents('.gui_window')[0];
        var last_pos = $(wind).position();
        
        last_ele_x = last_pos.left;
        last_ele_y = last_pos.top;
        
        last_ele_h =  $(wind).height();
        last_ele_w =  $(wind).width();
        
        last_mouse_x = e.clientX;
        last_mouse_y = e.clientY;
        
        handle_down = true;
        curr_element = wind; 
    });
    
    $(document).on('mousedown', '.gui_resize', function(e) {
        e.preventDefault()
        var wind = $(this).parents('.gui_window')[0];

        last_ele_h =  $(wind).height();
        last_ele_w =  $(wind).width();
        
        last_mouse_x = e.clientX;
        last_mouse_y = e.clientY;
        
        resize_down = true;
        curr_element = wind;
    });
    
    $(document).on('mouseup', function(e) {
        e.preventDefault()
        handle_down = false;
        resize_down = false;
        curr_element = null;
    });
    
    $(document).on('mousemove', function(e) {
        if (handle_down) {
            e.preventDefault()
            update_position(e);
        } else if (resize_down) {
            e.preventDefault()
            update_scale(e);
        }
    });
    
    $(document).on('click', '.closer', function() {
        $(this).parents('.gui_window').fadeOut();
    });
    
});