const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    gulpSass = require('gulp-sass'),
    htmlmin = require('gulp-htmlmin'),
    babel = require("gulp-babel"),
    connect = require('gulp-connect');

// 制定一个css任务
//   scss编译成css， 压缩css
gulp.task('css', () => {
    // src取源文件
    // pipe管道（文件传输的过程，可以在过程中对文件做处理
    // dest destination 目的地，管道里处理完成以后放到目标文件夹里
    gulp.src('src/css/*.scss')
        .pipe(gulpSass())
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
})

// 制定html任务
gulp.task('html', () => {
    gulp.src('src/**/*.html')
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true //删除<style>和<link>的type="text/css"
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
})

// 制定js任务
gulp.task('js', () => {
    // 所有js代码取出来，ES6转成ES5  babel
    // 压缩，再放到dist/js里
    gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
})

// libs任务
gulp.task('libs', () => {
    // libs里面的所有文件原封不动的移动到dist里
    gulp.src('src/libs/**/*')
        .pipe(gulp.dest('dist/libs'));
})

// images任务
gulp.task('images', () => {
    // images里面的所有文件原封不动的移动到dist里
    gulp.src('src/imgs/**/*')
        .pipe(gulp.dest('dist/imgs'));
})


// 制定一个开启服务器的任务
gulp.task('server', () => {
    connect.server({
        root: "dist",
        port: 2888,
        livereload: true // 支持热更新
    });
})

// 制定一个监听任务
gulp.task('watch', () => {
    // 监听所有html文件的修改，一旦被修改了 html任务就会被执行
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/css/**/*.scss', ['css']);
})


// 把任务集中执行
gulp.task('default', ["html", "css", "js", "libs", "images", "server", "watch"]);