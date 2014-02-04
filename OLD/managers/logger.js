function LogEntry(caller, loc, time, msg, type) {
    this.caller = caller;
    this.time = time;
    this.msg = msg;
    this.loc = loc;
    this.type = type;
    /* print the log entry to the game console */
    this.print = function() {
        var str = '';
        if (this.type == 'console') {
            console.log(msg);
            window.game_console.append_text(msg);
            // handle different messages in different ways..
        } else {
            if (window.logger.show_time) {
                str += '[' + time + ']';
            }
            if (window.logger.show_caller) {
                str += '[' + caller + ']';
            }
            if (window.logger.show_loc) {
                str += '[' + loc + ']';
            }
            console.log(str + ' ' + msg);
            window.game_console.append_text(str + ' ' + msg);
        }
    }
}

window.logger = {
    init: function() {
        this.log = []; /* keeps track of all log entries */
        this.enabled = true; /* when enabled, keeps track of entries */
        
        this.show_caller = true; /* display the script where the log is being called from */
        this.show_time = true; /* display the time the log was called */
        this.show_loc = true; /* display the line number where the log was called */
        window.log('logger initialized');
    },
    
    /* adds an entry to the log */
    add_entry: function(entry) {
        this.log.push(entry);
        entry.print();
    },
    
    /* dumps what has been logged so far */
    dump_log: function() {
        this.log = [];
    },
    
    /* displays the whole log at once */
    display_log: function() {
        for (entry in this.log) {
            if (this.log[entry].type != 'console') {
                this.log[entry].print();
            }
        }   
    },
    
    /* display the history of console commands */
    display_console_history: function() {
        for (entry in this.log) {
            if (this.log[entry].type == 'console') {
                this.log[entry].print();
            }
        }
    },
    
    /* enable the tracking of non-console logs */
    enable: function(show_caller, show_time, show_loc) {
        this.show_caller = show_caller;
        this.show_time = show_time;
        this.show_loc = show_loc;
        this.enabled = true;
    },
    
    /* disable the tracking of non-console logs */
    disable: function(dump) {
        this.enabled = false;
        if (dump) {
            this.dump_log();
        }
    }
    
}

/* log a message with the window.logger */
window.log = function(msg, type) {
    if (type == 'console') {
        var caller = 'game_console.js';
        var loc = '?';
        var time = window.game.time - window.game.time_started;
        var entry = new LogEntry(caller, loc, time, msg, type);
        window.logger.add_entry(entry);
    } else if (window.logger.enabled) {
        var e = new Error('dummy');
        var info = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
            .split('\n')[1]
            .split('/').pop().slice(0, -1)
            .split(':', 2);
        
        var caller = info[0];
        var loc = info[1] ;
        var time = window.game.time - window.game.time_started;
        var entry = new LogEntry(caller, loc, time, msg, type);
        window.logger.add_entry(entry);
    }
}