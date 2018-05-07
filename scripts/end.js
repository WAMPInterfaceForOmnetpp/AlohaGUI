var EndButtonModule = (function () {

    /***** CONSTRUCTOR *****/
    function EndButtonModule(container_id, uri, objects) {
        if (!(this instanceof arguments.callee)) {
            throw new Error("Constructor called as a function");
        }
        if (window.DEBUG) {
            console.log("Creating instance of 'end.js' at '" + container_id + "'");
        }

        _prepare_input.call(this, container_id, uri);
    }

    /***** PRIVATE METHODS *****/

    function _prepare_input(container_id, uri) {
        var that = this;

        var fieldset = document.createElement("fieldset");
        $("#" + container_id).append(fieldset);

        var store_button = document.createElement("button");
        store_button.id = container_id + "_button";
        store_button.innerText = "End Simulation";
        var p1 = document.createElement("p");
        $(p1).append(store_button);
        $(fieldset).append(p1);

        store_button.onclick = onClick;

        function onClick() {
            setParameter(uri, "Aloha.callee", "stopSimulation", "true");
        }

    }

    return EndButtonModule;
})();
