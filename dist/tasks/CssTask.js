'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CssTask = function (_Elixir$Task) {
    _inherits(CssTask, _Elixir$Task);

    /**
     * Create a new CssTask instance.
     *
     * @param {string}      name
     * @param {GulpPaths}   paths
     * @param {object|null} options
     */
    function CssTask(name, paths, options) {
        _classCallCheck(this, CssTask);

        var _this = _possibleConstructorReturn(this, (CssTask.__proto__ || Object.getPrototypeOf(CssTask)).call(this, name, null, paths));

        _this.options = options;
        return _this;
    }

    /**
     * Build the Gulp task.
     */


    _createClass(CssTask, [{
        key: 'gulpTask',
        value: function gulpTask() {
            return gulp.src(this.src.path).pipe(this.initSourceMaps()).pipe(this.compile()).on('error', this.onError()).pipe(this.autoPrefix()).pipe(this.concat()).pipe(this.minify()).on('error', this.onError()).pipe(this.writeSourceMaps()).pipe(this.saveAs(gulp)).pipe(this.onSuccess());
        }

        /**
         * Register file watchers.
         */

    }, {
        key: 'registerWatchers',
        value: function registerWatchers() {
            this.watch(this.src.baseDir + Elixir.config.css[this.name].search).ignore(this.output.path);
        }

        /**
         * Compile the CSS.
         */

    }, {
        key: 'compile',
        value: function compile() {
            this.recordStep('Compiling ' + this.ucName());

            var plugin = Elixir.Plugins[this.name] || Elixir.config.css[this.name].plugin;

            return plugin(this.options || Elixir.config.css[this.name].pluginOptions);
        }

        /**
         * Apply CSS auto-prefixing.
         */

    }, {
        key: 'autoPrefix',
        value: function autoPrefix() {
            if (!Elixir.config.css.autoprefix.enabled) {
                return this.stream();
            }

            this.recordStep('Autoprefixing CSS');

            return Elixir.Plugins.autoprefixer(Elixir.config.css.autoprefix.options);
        }
    }]);

    return CssTask;
}(Elixir.Task);

exports.default = CssTask;