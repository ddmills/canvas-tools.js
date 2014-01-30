Derpy = function() {
    this.count = 1;
}

Derpy.prototype.update = function(delta) {
    this.count++;
    console.log('hey i\'m updating!');
    if (this.count > 100) {
        g.pause();
    }
    
}

$(window).ready(function() {

    var d1 = new Derpy();
    
    window.g = new Game();
    g.start(function() {
        console.log('i know you started!!');
        var added = g.add_hook(d1);
        console.log(added);
    });
});