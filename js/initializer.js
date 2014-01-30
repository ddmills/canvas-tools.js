$(window).ready(function() {
    var time_start = new Date().getTime();
    /* initialize all managers in the correct order */
    window.constants.init();
    window.resources.init();
    window.game.init();
    window.logger.init();
    window.events.init();
	window.draw.init();
    window.map.init();
    window.gui.init();
    window.viewport.init();
    window.entities.init();
    window.scenario.init();
    window.game_console.init();
    
    /* load the resources and begin the scenario */
    window.resources.load(function() {
        var time_done = new Date().getTime();
        var delta = (time_done - time_start);
        window.log('load time: ' + delta + '(ms)');
        window.scenario.begin();
        //window.game.start();
    });
});