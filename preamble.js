// Fix Error prototype for PhantomJS
if (typeof phantom !== "undefined") {
    // Fix Error prototype
    var OriginalErrorPrototype = Error.prototype;
    var OriginalError = Error;
    Error = function(m) {
        try {
            throw new OriginalError(m);
        } catch (e) {
            return e;
        }
    };
    Error.prototype = OriginalErrorPrototype;
    
}

// Capture console
(function(){
    var OldConsole = console;
    var divlog = function(m) {
        div = document.getElementById('console');
        if ( typeof(div) !== 'undefined' ) {
            div.innerHTML = div.innerHTML + m + "\n";
        }
    };
    console = {
        assert: function(c,m) {
            if ( c ) {
                divlog(m);
                OldConsole.log(m);
            }
        },
        log: function(m) {
            divlog(m);
            OldConsole.log(m);
        },
        error: function(m) {
            divlog('<span style="color:red">' + m + '</span>');
            OldConsole.error(m);
        },
        clear: function(m) {
            div = document.GetElementById('console');
            if ( typeof(div) !== 'undefined' ) {
                div.innerHTML = '';
            }
            OldConsole.clear();
        }
    };
})();

// Load the test file
(function(){
    var id = window.frameElement.id;
    id = id.slice(0,-6); // remove '-frame' from id
    document.write('<script src="' + id + '.js"></script>');
})();
