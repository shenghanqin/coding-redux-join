// 定义依赖项
var gulp = require('gulp'),
    connect = require('gulp-connect');
    // watch = require('gulp-watch');

// 定义 webserver 任务
gulp.task('webserver', function() {
    connect.server({
        port: 80,
        root: '../',
        livereload: true
    });
});

// 定义 livereload 任务
// gulp.task('livereload', function() {
//     gulp.src(['account/*.html'])
//         .pipe(watch('../*/*.*', function() {}))
//         .pipe(connect.reload());
// });

// 定义 reload 任务
gulp.task('reload', function() {
    gulp.src('')
        .pipe(connect.reload());
});

// 定义 watch 任务
gulp.task('watch', function() {
    gulp.watch('../*/*', ['reload']);
    gulp.watch('../*/*/*', ['reload']);
    gulp.watch('../*/*/*/*', ['reload']);
});

// 定义默认任务
gulp.task('default', ['webserver', 'watch']);
