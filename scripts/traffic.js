var BarChartModule = (function () {

    /***** CONSTRUCTOR *****/
    function BarChartModule(container_id, uri, datasets, fit, excluded) {
        if (!(this instanceof arguments.callee)) {
            throw new Error("Constructor called as a function");
        }
        if (window.DEBUG) {
            console.log("Creating instance of 'traffic.js' at '" + container_id + "'");
        }

        /***** PRIVATE VARIABLES *****/
        this._chart = null;
        this._fit_chart = fit;
        this._fit_max = -Infinity;

        if (excluded !== undefined) {
            this._excluded = excluded.sort();
        } else {
            this._excluded = []
        }

        _prepare_chart.call(this, container_id, datasets);


        this.oldTime = 0;
        this.oldTimeString = this.oldTime.toString();
        this.totalDatasets = this._chart.data.datasets.length + this._excluded.length;
        this.eventCount = Array.apply(null, Array(this.totalDatasets)).map(Number.prototype.valueOf, 0);
        this.firstEvent = true;
        this.firstInSecond = true;
        for (var i = 0; i < datasets.length; i++) {
            subscribe.call(this, uri, datasets[i].topic, _onEvent, i);
        }
    }

    /***** PRIVATE METHODS *****/
    function _prepare_chart(container_id, datasets) {
        var that = this;

        var canvas = document.createElement("canvas");
        canvas.id = container_id + "_canvas";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        $("#" + container_id).append(canvas);

        var ctx = canvas.getContext('2d');

        for (var i = that._excluded.length - 1; i >= 0; i--) {
            datasets.splice(that._excluded[i], 1);
        }

        for (var i = 0; i < datasets.length; i++) {
            var color = datasets[i].rgb
            datasets[i].data = [];
            datasets[i].backgroundColor = "rgba(" + color + ",0.5)";
            datasets[i].borderColor = "rgba(" + color + ",0.5)";
            datasets[i].borderWidth = 0;
        }

        var initial_data = {
            labels: [],
            datasets: datasets
        };

        that._chart = new Chart(ctx, {
            type: "bar",
            data: initial_data,
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        },
                        afterFit: function (scale) {
                            if (that._fit_chart !== undefined) {
                                var fitScale = that._fit_chart._chart.scales["y-axis-0"];
                                var fitMax = fitScale.max;
                                if (scale.max < fitMax) {
                                    scale.end = fitMax;
                                    scale.ticks = fitScale.ticks;
                                    scale.ticksAsNumbers = fitScale.ticksAsNumbers;
                                    that._fit_chart._chart.update(1);
                                }
                            }
                        },
                    }]
                }
            }
        });
    }

    function _onEvent(args) {
        var that = this
        var currentDataset = args[0];
        var tuple = args[1];
        if (that.firstEvent) {
            that.oldTime = Math.floor(parseFloat(tuple[0]));
            that.oldTimeString = that.oldTime.toString();
            that.firstEvent = false;
        }
        while (that._excluded.indexOf(i - 1) > -1) {
            i++;
        }
        if (that._chart.data.datasets.length > currentDataset) {
            var curTime = tuple[0];
            if (currentDataset == 1 && tuple[1] == '0') {
                that.eventCount[currentDataset]++;
            }
            else if (currentDataset == 0) {
                that.eventCount[currentDataset] += parseInt(tuple[1]);
            }
            if (!curTime.startsWith(that.oldTimeString)) {
                that.oldTime = Math.floor(parseFloat(tuple[0]));
                that.oldTimeString = that.oldTime.toString();
                firstInSecond = true;
            }
            if (that.oldTime % 10 == 0 && firstInSecond && that.oldTime != 0) {
                firstInSecond = false;
                that._chart.data.labels.push(parseFloat(that.oldTimeString)); // time
                for (var i = 0; i < that._chart.data.datasets.length; i++) {
                    that._chart.data.datasets[i].data.push(parseFloat(that.eventCount[i]));
                }
                that.eventCount = Array.apply(null, Array(that.totalDatasets)).map(Number.prototype.valueOf, 0);
            }
        }


        if (that._chart.data.labels.length > 30) {
            that._chart.data.labels.shift();
            for (var i = 0; i < that._chart.data.datasets.length; i++) {
                that._chart.data.datasets[i].data.shift();
            }
            that._chart.update(1);
        } else {
            that._chart.update(1000);
        }

    }

    /***** PUBLIC INTERFACE *****/
    BarChartModule.prototype.setFitChart = function (fit_chart) {
        this._fit_chart = fit_chart;
    };

    return BarChartModule;
})();
