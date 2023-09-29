const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const image = require('gulp-image');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const clean = () => {
  return del(['dist'])
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'))
}

const styles = () => {
  return src('src/styles/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(concat('main.css'))
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(sourcemaps.write())
      .pipe(dest('dist'))
      .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const scripts = () => {
  return src([
    'src/js/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/**/*.svg',
    'src/images/**/*.jpeg'
  ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

watch('src/**/*.html', htmlMinify)
watch('src/styles/**/*.css', styles)
watch('src/js/**/*.js', scripts)
watch('src/resources/**', resources)

exports.styles = styles;
exports.scripts = scripts;
exports.htmlMinify = htmlMinify;
exports.default = series(clean, resources,htmlMinify, scripts, styles, images, watchFiles);

// Dev settings

const cleanDev = () => {
  return del(['dev'])
}

const resourcesDev = () => {
  return src('src/resources/**')
    .pipe(dest('dev'))
}

const stylesDev = () => {
  return src('src/styles/**/*.css')
    .pipe(concat('main.css'))
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

const htmlDev = () => {
  return src('src/**/*.html')
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

const scriptsDev = () => {
  return src([
    'src/js/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

const watchFilesDev = () => {
  browserSync.init({
    server: {
      baseDir: 'dev'
    }
  })
}

const imagesDev = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/**/*.svg',
    'src/images/**/*.jpeg'
  ])
    .pipe(dest('dev/images'))
}

watch('src/**/*.html', htmlDev)
watch('src/styles/**/*.css', stylesDev)
watch('src/js/**/*.js', scriptsDev)
watch('src/resources/**', resourcesDev)

exports.stylesDev = stylesDev;
exports.htmlDev = htmlDev;
exports.dev = series(cleanDev, resourcesDev, htmlDev, stylesDev, scriptsDev, imagesDev, watchFilesDev);