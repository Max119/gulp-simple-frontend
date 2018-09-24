var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var clean        = require('gulp-clean');
var runSequence  = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var csso         = require('gulp-csso');

// Static Server + watching sass/html files
gulp.task('serve', ['sass'], function() {  
    browserSync.init({
        server: "./app"
    });

    gulp.src("src/*.html").pipe(gulp.dest("app"));

    gulp.watch("src/sass/*.*", ['sass']);
    gulp.watch("src/*.html", ['move-static']);
    gulp.watch("src/img/**/*.*", ['move-static']);
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src("src/sass/main.sass")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(csso({
            
        }))
        .pipe(sourcemaps.write('', {
            sourceMappingURL: function(file) {
              return file.relative + '.map';
            }
          }))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Move html, img, etc to app folder
gulp.task('move-static', function() {
    gulp.src("src/*.html").pipe(gulp.dest("app"));
    gulp.src("src/img/**/*.*").pipe(gulp.dest("app/img"));
    browserSync.reload();
    return;
});


// Clean app folder
gulp.task('clean', function() {
    return gulp.src('app/*', {read: false}).pipe(clean()); 
});


//Default task
gulp.task('default', function() {
    runSequence('clean', 'move-static', 'serve');
});


//Build task
gulp.task('build', function() {
    runSequence('clean', 'move-static', 'sass');
});