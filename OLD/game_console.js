window.game_console  = {
    init: function() {
        var content_console = "<table style='width: 100%; height: 100%; padding-left: 10px; padding-right: 15px; padding-top: 30px; padding-bottom: 10px; '><tr><td><textarea id='console_output' readonly style='width: 100%; height: 100%; resize: none; background:black; font-family: Lucida Console; font-size: 12px; color: white; border: none;'></textarea></td></tr><tr style='height:25px;'><td><input type='text' id='console_input' style='width: 100%;  z-index: -100; resize: none; color: white; background: black;' rows=1></input></td></tr></table>"

        this.cmds_entered = [];
        this.hist_count = 0;
        
        this.commands = {
            'start' : 'window.game.start',
            'set_speed' : 'window.game.set_speed',
            'pause' : 'window.game.pause',
            'unpause' : 'window.game.unpause',
            'refresh' : 'location.reload',
            
            'hist' : 'window.game_console.history',
            'help' : 'window.game_console.help',
            'hide' : 'window.game_console.hide',
            'clear' : 'window.game_console.clear',
            'docs' : 'window.game_console.documentation',
            
            'log_dump' : 'window.logger.dump_log',
            'log_disp' : 'window.logger.display_log',
            'log_enable' : 'window.logger.enable',
            'log_disable' : 'window.logger.disable',
            
            'map_edit' : 'window.map.show_editor',
            
            'gui_wind' : 'window.gui.show_window'
        };
        
        window.gui.add_window('Game Console', 'window_console', content_console, true, true, true, 10, 10, 512, 256, 400, 200);
        // window.gui.hide_window('window_console');
        
        window.events.add_hook(this);
        
        window.logger.display_log();
        
        window.log('game_console initialized');
    },
    
    /* makes the console visible */
    show: function() {
        window.gui.show_window('window_console');
    },
    
    /* hides the console */
    hide: function() {
        window.gui.hide_window('window_console');
    },
    
    /* adds an entry to the console */
    append_text: function(text) {
        $('#console_output').append(text + '\n');
        if ($('#console_output')[0]) {
            $('#console_output')[0].scrollTop = $('#console_output')[0].scrollHeight;
        }
    },
    
    /* sets the input text */
    set_text: function(text) {
        $('#console_input').val(text);
    },
    
    /* called from window.events */
    key_down: function(e) {
        if (e.keyCode == 192) {
            if (this.visible) {
                this.hide();
                this.visible = false;
            } else {
                this.show();
                this.visible = true;
            }
        }
        
        if ($('#console_input').is(':focus') && window.gui.active_win == 'window_console') {
            if (e.keyCode == 13)  {
                var args = String($('#console_input').val()).split(' '); 
                var cmd = args.shift();
                this.set_text('');
                this.hist_count = 0;
                this.enter_command(cmd, args);
            } else if (e.keyCode == 38)  {
                if (this.hist_count < (this.cmds_entered.length)) {
                    this.hist_count++;
                    this.set_text(this.cmds_entered[this.cmds_entered.length - this.hist_count]);
                }
            } else if (e.keyCode == 40)  {
                if (this.hist_count > 0) {
                    this.hist_count--;
                    this.set_text(this.cmds_entered[this.cmds_entered.length - this.hist_count]);
                }
            }
        }

        //window.log('key pressed ' + e.keyCode);
    },
    
    /* enter a command plus arguments */
    enter_command: function(cmd, args) {
        window.log('>' + cmd + ' ' + args, 'console');
        if (this.commands[cmd]) {
            cmd_final = this.commands[cmd] +  '(';

            for (arg in args) {
                cmd_final += '"' + args[arg] + '", ';
            }
            
            if (args.length > 0) {
                cmd_final = cmd_final.substring(0, cmd_final.length - 2);
            }
            
            cmd_final += ')';
            eval(cmd_final);
            
        } else {
            window.log('\"' + cmd + '\(' + args+ ')" is not a valid command', 'console');
        }
        this.cmds_entered.push(cmd);
    },
   
    /* display the console help */
    help: function(cmd) {
        if (cmd) {
            args_names = eval(this.commands[cmd]).toString()
                .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
                .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                .split(/,/);
        
            var output = '  command: "' + cmd + '"\n' 
            output += '  calls: ' + this.commands[cmd] + '\n';
            
            if (args_names.length > 0) {
                if (args_names.length == 1 && args_names[0] == '') {
                    output += '  There are no parameters for this function.';
                } else {
                    output += '  parameters: ' + args_names.length + ' \n';
                    for (arg in args_names) {
                        output += '  ...[' + args_names[arg] + ']\n';
                    }
                }
            } else {
                output += '  There are no parameters for this function.';
            }
            
            window.log(output, 'console'); 
        } else {
            window.log(' Type "help command_name" for help with a specific command.', 'console');
            for (cmd in this.commands) {
                var output = '  ' + cmd + ' ..... ' + this.commands[cmd];
                window.log(output, 'console'); 
            }
        }
    },
    
    /* display the console history */
    history: function() {
        for (cmd in this.cmds_entered) {
            window.log('>>' + this.cmds_entered[cmd], 'console');
        }
    },
    
    /* brings up the documentation window */
    documentation: function() {
        window.gui.show_window('window_documentation', true);
    },
    
    /* clears the console */
    clear: function() {
        $('#console_output').html('');
    }
    
}

$(document).on('click', '#console_input', function() {
    $('#console_input').select();
});