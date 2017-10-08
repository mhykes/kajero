var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var babelify = require('babelify');
var browserify = require('browserify');
//var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');

var isProduction = process.env.NODE_ENV === 'production';

// Input file
watchify.args.debug = (!isProduction);
var bundler = watchify(browserify('./src/js/app.js', watchify.args));

// Babel transform (for ES6)
bundler.transform(babelify.configure({
    sourceMapRelative: 'src/js',
    presets: ['es2015', 'react']
}));

bundler.transform('envify');
bundler.transform({
    global: isProduction,
    ignore: [
        '**/jutsu/lib/**'
    ]
}, 'uglifyify');

// Recompile on updates.
//bundler.on('update', bundle);

function bundle() {
    gutil.log("Recompiling JS...");

    return bundler.bundle()
        .on('error', function(err) {
            gutil.log(err.message);
            //browserSync.notify("Browserify error!");
            this.emit("end");
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./src/dist'));
        //.pipe(browserSync.stream({once: true}));
}

// Gulp task aliases

gulp.task('bundle', function() {
    return bundle();
});

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            noCache: true
        }))
        .on('error', function(err) {
            gutil.log(err.message);
        })
        .pipe(gulp.dest('./src/dist'));
        //.pipe(browserSync.stream({once: true}));
});


// Generate test html on updates.
//bundler.on('update', genTest);

function genTest(cb) {
    gutil.log("Generating test html...");
    
    var exec = require('child_process').exec;
    var fileName = 'test1';
    return exec('npm run generate html '+fileName+'.md', function (err, stdout, stderr) {
        //console.log(stdout);
        console.log(stderr);
        // strip off initial lines that contain the command
        let startOfHtml = stdout.indexOf('<!DOCTYPE');
        if (startOfHtml == -1) {
            console.log('ERROR:  No html found in stdout!');
        } else {
            let outHtml = stdout.substr(startOfHtml);
            let outFile = fileName+'.html';
            let fs = require('fs'); 
            fs.writeFile('./'+outFile, outHtml, (fileErr) => {
                if (fileErr) {
                    console.log(fileErr);
                    err = err || fileErr;
                } else {
                    console.log('The file '+outFile+' has been saved!');                
                }
            });
        }
        if(cb && typeof cb == 'function') {
            cb(err);
        }
    });
}

// Bundle and serve page
gulp.task('default', ['sass', 'bundle'], function(cb) {
    //gulp.watch('./src/scss/*.scss', ['sass']);
    //browserSync.init({
    //    server: './src'
    //});
    return genTest(cb);
    
});

/*
 * Testing
 */

gulp.task('test-cov', require('gulp-jsx-coverage').createTask({
    src: './src/**/*-spec.js',
    istanbul: {
        preserveComments: true,
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|-spec|jutsu|reshaper|smolder/
    },
    threshold: {
        type: 'lines',
        min: 90
    },
    transpile: {
        babel: {
            exclude: /node_modules/
        }
    },
    coverage: {
        reporters: ['text-summary', 'json', 'lcov'],
        directory: 'coverage'
    },
    mocha: {
        reporter: 'spec'
    }
}));
