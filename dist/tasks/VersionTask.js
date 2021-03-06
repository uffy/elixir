'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = void 0,
    del = void 0,
    glob = void 0;

var VersionTask = function (_Elixir$Task) {
    _inherits(VersionTask, _Elixir$Task);

    /**
     * Create a new CssTask instance.
     *
     * @param {string}    name
     * @param {GulpPaths} paths
     */
    function VersionTask(name, paths) {
        _classCallCheck(this, VersionTask);

        var _this = _possibleConstructorReturn(this, (VersionTask.__proto__ || Object.getPrototypeOf(VersionTask)).call(this, name, null, paths));

        _this.publicPath = Elixir.config.publicPath;
        _this.buildPath = _this.output.baseDir;

        if (_this.src.baseDir == _this.buildPath) {
            if (_this.src.path.find(function (path) {
                return (/\*/.test(path)
                );
            })) {
                Elixir.fail('Because you\'ve overridden the "mix.version()" build path ' + 'to be the same as your source path, you cannot pass a ' + 'regular expression. Please use full file paths instead.');
            }
        }
        return _this;
    }

    /**
     * Lazy load dependencies.
     */


    _createClass(VersionTask, [{
        key: 'loadDependencies',
        value: function loadDependencies() {
            fs = require('fs');
            del = require('del');
            glob = require('glob');
        }

        /**
         * Build the Gulp task.
         *
         * @param {Elixir.Plugins} $
         */

    }, {
        key: 'gulpTask',
        value: function gulpTask($) {
            var _this2 = this;

            this.recordStep('Versioning');

            var oldManifestUri = this.buildPath + '/rev-manifest.json';
            var oldManifest = null;
            if (fs.existsSync(oldManifestUri)) {
                oldManifest = JSON.parse(fs.readFileSync(oldManifestUri));
            }

            return gulp.src(this.src.path, { base: './' + this.publicPath }).pipe($.rev()).pipe(this.updateVersionedPathInFiles($)).pipe(gulp.dest(this.buildPath)).pipe($.rev.manifest()).pipe(this.saveAs(gulp)).on('end', function () {
                _this2.copyMaps();
                _this2.deleteManifestFiles(oldManifest);
            });
        }

        /**
         * Register file watchers.
         */

    }, {
        key: 'registerWatchers',
        value: function registerWatchers() {
            this.watch(this.src.path);
        }

        /**
         * Update files to point to the newly versioned file name.
         *
         * @param {Elixir.Plugins} $
         */

    }, {
        key: 'updateVersionedPathInFiles',
        value: function updateVersionedPathInFiles($) {
            var buildFolder = this.buildPath.replace(this.publicPath, '').replace('\\', '/');

            this.recordStep('Rewriting File Paths');

            return $.revReplace({ prefix: buildFolder + '/' });
        }

        /**
         * 删除 old manifest 中，无用的文件
         */

    }, {
        key: 'deleteManifestFiles',
        value: function deleteManifestFiles(oldManifest) {

            if (!oldManifest) return;

            var manifest = this.buildPath + '/rev-manifest.json';

            if (!fs.existsSync(manifest)) return;

            manifest = JSON.parse(fs.readFileSync(manifest));

            for (var key in oldManifest) {
                if (!manifest[key] || manifest[key] != oldManifest[key]) {
                    del.sync(this.buildPath + '/' + oldManifest[key], { force: true });
                }
            }
        }

        /**
         * Copy source maps to the build directory.
         */

    }, {
        key: 'copyMaps',
        value: function copyMaps() {
            var _this3 = this;

            if (Elixir.config.production) {
                return;
            }
            this.recordStep('Copying Source Maps');

            this.src.path.forEach(function (file) {
                glob(file, {}, function (error, files) {
                    if (error) return;

                    files.filter(function (file) {
                        return fs.existsSync(file + '.map');
                    }).forEach(_this3.copyMap.bind(_this3));
                });
            });
        }

        /**
         * Copy a single map file over.
         *
         * @param {string} srcMap
         */

    }, {
        key: 'copyMap',
        value: function copyMap(srcMap) {

            var destMap = srcMap.replace(this.publicPath, this.buildPath + '/');

            fs.createReadStream(srcMap + '.map').pipe(fs.createWriteStream(destMap + '.map'));
        }
    }]);

    return VersionTask;
}(Elixir.Task);

exports.default = VersionTask;