let fs, del, glob;

class VersionTask extends Elixir.Task {

    /**
     * Create a new CssTask instance.
     *
     * @param {string}    name
     * @param {GulpPaths} paths
     */
    constructor(name, paths) {
        super(name, null, paths);

        this.publicPath = Elixir.config.publicPath;
        this.buildPath = this.output.baseDir;

        if (this.src.baseDir == this.buildPath) {
            if (this.src.path.find(path => /\*/.test(path))) {
                Elixir.fail(
                    'Because you\'ve overridden the "mix.version()" build path ' +
                    'to be the same as your source path, you cannot pass a ' +
                    'regular expression. Please use full file paths instead.'
                );
            }
        }
    }


    /**
     * Lazy load dependencies.
     */
    loadDependencies() {
        fs = require('fs');
        del = require('del');
        glob = require('glob');
    }


    /**
     * Build the Gulp task.
     *
     * @param {Elixir.Plugins} $
     */
    gulpTask($) {
        this.recordStep('Versioning');

        let oldManifestUri = `${this.buildPath}/rev-manifest.json`;
        let oldManifest = null;
        if ( fs.existsSync(oldManifestUri)){
            oldManifest = JSON.parse(fs.readFileSync(oldManifestUri));
        }

        return (
            gulp
            .src(this.src.path, { base: `./${this.publicPath}` })
            .pipe($.rev())
            .pipe(this.updateVersionedPathInFiles($))
            .pipe(gulp.dest(this.buildPath))
            .pipe($.rev.manifest())
            .pipe(this.saveAs(gulp))
            .on('end', ()=>{
                this.copyMaps();
                this.deleteManifestFiles(oldManifest);
            })
        );
    }


    /**
     * Register file watchers.
     */
    registerWatchers() {
        this.watch(this.src.path);
    }


    /**
     * Update files to point to the newly versioned file name.
     *
     * @param {Elixir.Plugins} $
     */
    updateVersionedPathInFiles($) {
        let buildFolder = this.buildPath.replace(this.publicPath, '').replace('\\', '/');

        this.recordStep('Rewriting File Paths');

        return $.revReplace({ prefix: buildFolder + '/' });
    }


    /**
     * 删除 old manifest 中，无用的文件
     */
    deleteManifestFiles(oldManifest) {

        if( !oldManifest ) return;

        let manifest = `${this.buildPath}/rev-manifest.json`;

        if (! fs.existsSync(manifest)) return;

        manifest = JSON.parse(fs.readFileSync(manifest));

        for (let key in oldManifest) {
            if( !manifest[key] || manifest[key] != oldManifest[key] ){
                del.sync(`${this.buildPath}/${oldManifest[key]}`, { force: true });
            }
        }
    }


    /**
     * Copy source maps to the build directory.
     */
    copyMaps() {
        if( Elixir.config.production ){
            return ;
        }
        this.recordStep('Copying Source Maps');

        this.src.path.forEach(file => {
            glob(file, {}, (error, files) => {
                if (error) return;

                files.filter(file => fs.existsSync(`${file}.map`))
                     .forEach(this.copyMap.bind(this));
            });
        });
    }


    /**
     * Copy a single map file over.
     *
     * @param {string} srcMap
     */
    copyMap(srcMap) {


        let destMap = srcMap.replace(this.publicPath, this.buildPath +'/');

        fs.createReadStream(`${srcMap}.map`)
          .pipe(fs.createWriteStream(`${destMap}.map`));
    }

}


export default VersionTask;
