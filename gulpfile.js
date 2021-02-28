
let projectFolder = require('path').basename(__dirname);
let sourceFolder = 'app';

let fs = require('fs');

let path = {
    build: {
        html: projectFolder + '/',
        css: projectFolder + '/css/',
        js: projectFolder + '/js/',
        img: projectFolder + '/images/',
        fonts: projectFolder + '/fonts'
    },
    src: {
        html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
        css: sourceFolder + '/scss/style.scss',
        js: sourceFolder + '/js/**/',
        img: sourceFolder + '/images/**/*', //.{jpg, png, svg, gif, ico, webp}
        fonts: sourceFolder + '/fonts/**/*'
    },
    watch: {
        html: sourceFolder + '/**/*.html',
        css: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/images/**/*.{jpg, png, svg, gif, ico, webp}'
    },
    clean:  './' + projectFolder + '/'
}

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let fileInclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let groupMedia = require('gulp-group-css-media-queries');
let cleanCSS = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let concat = require('gulp-concat');
// let webp = require('gulp-webp');
// let webphtml = require('gulp-webp-html');
// let webpcss = require('gulp-webpcss');
let svgSprite = require('gulp-svg-sprite');
let cheerio = require('gulp-cheerio');
let replace = require('gulp-replace');
// let ttf2woff = require('gulp-ttf2woff');
// let ttf2woff2 = require('gulp-ttf2woff2');
// let fonter = require('gulp-fonter');


function browsersync(params) {
    browserSync.init({
        server: {
            baseDir: './' + projectFolder + '/'
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileInclude())
        // .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(
            groupMedia()
        )
        .pipe(
            autoprefixer({
                overrideBrowserList: ['last 5 versions'],
                cascade: true
            })
        )
        // .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(
            cleanCSS()
        )
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(src(sourceFolder + '/css/**/*'))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function js() {
    return src([path.src.js + '_splide.min.js', path.src.js + 'index.js'])
        // .pipe(fileInclude())
        // .pipe(dest(path.build.js))
        .pipe(concat('script.js'))
        .pipe(dest(path.build.js))
        .pipe(concat('script.min.js'))
        .pipe(
            uglify()
        )
        // .pipe(
        //     rename({
        //          '.min.js'
        //     })
        // )
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function images() {
    return src(path.src.img)
        // .pipe(
        //     webp({
        //         quality: 70
        //     })
        // )
        //.pipe(dest(path.build.img))
        //.pipe(src(path.src.img))
        .pipe(
            imagemin({
               // progressive: true,
               // svgoPlugins: [{ removeViewBox: false}],
                //interlaced: true,
                //optimizationLelel: 3
            })
        )
        //.pipe(fileInclude())
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}

function fonts() {
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}

// function fonts(params) {
//     src(path.src.fonts)
//         .pipe(ttf2woff())
//         .pipe(dest(path.build.fonts));
//     return    src(path.src.fonts)
//         .pipe(ttf2woff2())
//         .pipe(dest(path.build.fonts));
// }

// gulp.task('otf2ttf', function() {
//     return src([sourceFolder + '/fonts/*.otf'])
//     .pipe(fonter({
//         formats: ['ttf']
//     }))
//     .pipe(dest(sourceFolder + '/fonts/'))
// })

function svgSpriteMaker() {
    return gulp.src([sourceFolder + '/images/icons/*.svg'])
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg',
                // example: true
            }
        },
    }))
    .pipe(dest([sourceFolder + '/images/']))
    .pipe(dest(path.build.img))
}

// function fontsStyle(params) {

//     let file_content = fs.readFileSync(sourceFolder + '/scss/_fonts.scss');
//     if (file_content == '') {
//         fs.writeFile(sourceFolder + '/scss/_fonts.scss', '', cb);
//         return fs.readdir(path.build.fonts, function (err, items) {
//             if (items) {
//                 let c_fontname;
//                 for (var i = 0; i < items.length; i++) {
//                     let fontname = items[i].split('.');
//                     fontname = fontname[0];
//                     if (c_fontname != fontname) {
//                         fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
//                     }
//                     c_fontname = fontname;
//                 }
//             }
//         })
//     }
// }
    
// function cb() {

// }

// function testWebP(callback) {

//     var webP = new images();
//     webP.onload = webP.onerror = function () {
//     callback(webP.height == 2);
//     };
//     webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
//     }
    
//     testWebP(function (support) {
    
//     if (support == true) {
//     document.querySelector('body').classList.add('webp');
//     }else{
//     document.querySelector('body').classList.add('no-webp');
//     }
//     });

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}


let build = gulp.series(clean, gulp.parallel(js, css, html, svgSpriteMaker, images, fonts));
let watch = gulp.parallel(build, watchFiles, browsersync);

// exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.svgSpriteMaker = svgSpriteMaker;
exports.build = build;
exports.watch = watch;
exports.default = watch;