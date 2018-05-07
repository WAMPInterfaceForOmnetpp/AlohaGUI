var ParameterSliderModule = (function() {

    /***** CONSTRUCTOR *****/
    function ParameterSliderModule(container_id, uri, mod, parameter, unit, min, max, factor) {
        console.info("Constructing the interval slider")
        if (!(this instanceof arguments.callee)) {
            throw new Error("Constructor called as a function");
        }
        if (window.DEBUG) {
            console.log("Creating instance of 'interval.js' at '" + container_id + "'");
        }

        /***** PRIVATE VARIABLES *****/
        this._stored_sessions = {};
        this._input = null;
        this._label = null;
        this._min = min;
        this._max = max;
        this._unit = unit;
        this._factor = factor;

        _prepare_input.call(this, uri, container_id, mod, parameter);
        if(mod.includes('*')) {
            mod = mod.replace('*', '0');
        }
        getParameter.call(this, uri, mod, parameter, _setDisplayedValue, []);
    }

    /***** PRIVATE METHODS *****/

    function _prepare_input(uri, container_id, mod, param) {
        var that = this;

        that._input = document.createElement("input");
        that._input.id = container_id + "_range";
        that._input.name = that._input.id;
        that._input.type = "range";
        that._input.min = that._min;
        that._input.max = that._max;
        that._input.onchange = onChange;
        that._input.oninput = onInput;

        that._label = document.createElement("label");
        that._label.id = container_id + "_label";
        that._label.innerText = "0 " + that._unit;
        that._label.htmlFor = that._input.name;

        $("#" + container_id).append(that._input);
        $("#" + container_id).append(that._label);

        function onChange() {
            var value = that._input.value*that._factor;
            _setValue.call(that, uri, parseFloat(value), mod, param);
        }

        function onInput(value) {
            that._label.innerText = parseFloat(that._input.value) + " " + that._unit;
        }
    }

    function _setDisplayedValue(value) {
        var that = this;
        that._label.innerText = value/that._factor + " " + that._unit;
        that._input.value = parseFloat(value/that._factor);
    }

    function _setValue(uri, value, mod, param) {
        var that = this;
        var valueString = value.toString();
        setParameter.call(this, uri, mod, param, valueString);
    }

    /***** PUBLIC INTERFACE *****/
    ParameterSliderModule.prototype.reset = function() {
        var that = this;

        _setDisplayedValue.call(that, 1.0);
    };

    return ParameterSliderModule;
})();
