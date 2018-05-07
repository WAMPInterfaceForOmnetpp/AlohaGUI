

var GetParameterTopic = "com.examples.functions.getParameter";
var SetParameterTopic = "com.examples.functions.setParameter";
var RealmName = "opplive";

function setParameter(uri, mod, param, value) {
    var that = this;
    
    var connection = new autobahn.Connection({
        url: uri,
        realm: RealmName,
    });

    connection.onopen = function (session, details) {
        session.call(SetParameterTopic, [mod, param, value]).then(
            function showParameter(res) {
                console.info("new " + param + " in module " + mod + " is " + value.toString());
                connection.close();
            },
            function error (error) {
                console.info("An error occurred", error);
                connection.close();
            }
        );
    }

    connection.onclose = function (reason, details) {
        console.info("Closed setParameter caller connection");
    }
    
    connection.open();
}

        
function getParameter(uri, mod, param, func, args) {
    var that = this;
    
    var connection = new autobahn.Connection({
        url: uri,
        realm: RealmName,
    });

    connection.onopen = function (session, details) {
        session.call(GetParameterTopic, [mod, param]).then(
            function showInterval(res) {
                console.info( param + " in " + mod + " is " + res.toString());
                args.push(res);
                func.call(that, args);
                connection.close();
            },
            function error (error) {
                console.info("An error occured", error);
                connection.close();
            }
        );
    }
     
    connection.onclose = function (reason, details) {
        console.info("Closed getParameter caller connection");
    }
    
    connection.open();
}


function subscribe(uri, event_name, func, param) {
    var that = this
    
    function onEvent(args) {
        func.call(that, [param, args]);
    }

            
    var connection = new autobahn.Connection({
        url: uri,
        realm: RealmName
    });

    connection.onopen = function (session, details) {
        if (window.DEBUG) {
            console.log("Connected to " + uri);
        }
        session.subscribe(event_name, onEvent).then(
            function (subscription) {
                console.info("subscribed for " + RealmName + " " + event_name);
            },
            function (error) {
                console.info("subscription failed");
            }
        )
    };
     
     
    connection.onclose = function (reason, details) {
        if (window.DEBUG) {
            console.error("Connection lost (" + reason + ")");
        }
    }
    
    connection.open();
}
