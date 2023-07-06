'use strict';

const bs = require('browser-sync');
const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const imageMin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const htmlmin = require('gulp-htmlmin');
const connectSSI = require('connect-ssi');
const del = require('del');

// BrowserSync
function bsInit(done) {
	bs.init({
		proxy: 'localhost:8000',
		notify: false,
		middleware: [
			connectSSI({
				baseDir: __dirname + '/wp',
				ext: '.html',
			}),
		],
	});
	done();
}
function bsInit_s(done) {
	bs.init({
		server: {
			baseDir: './html',
			port: 5656,
			open: true,
			notify: false,
			middleware: [
				connectSSI({
					baseDir: __dirname + '/html',
					ext: '.html',
				}),
			],
		},
	});

	done();
}

// Compile
function htmlCompile(done) {
	return src('html/**/*.html')
		.pipe(
			htmlmin({
				collapseWhitespace: false,
				removeComments: false,
			})
		)
		.pipe(bs.stream())
		.pipe(dest('wp/'));
}

function scssCompile(done) {
	src('html/assets/styles/**/*.scss')
		.pipe(
			sass({
				outputStyle: 'expanded',
			}).on('error', sass.logError)
		)
		.pipe(dest('html/assets/styles/'))
		.pipe(dest('wp/assets/styles/'))
		.pipe(bs.stream());

	done();
}

function imageCompile(done) {
	del(['html/assets/images/**/*', 'wp/assets/images/**/*']).then(() => {
		src('html/assets/slice_images/**/*')
			.pipe(
				imageMin([
					pngquant({
						quality: [0.8, 0.9],
						speed: 1,
					}),
					mozjpeg({quality: 80}),
					imageMin.svgo(),
					imageMin.optipng(),
					imageMin.gifsicle({optimizationLevel: 3}),
				])
			)
			.pipe(dest('html/assets/images/'))
			.pipe(dest('wp/assets/images/'))
			.pipe(bs.stream());
		done();
	});
}

function jsPipe(done) {
	src('html/assets/scripts/**/*.js').pipe(plumber()).pipe(dest('wp/assets/scripts')).pipe(bs.stream());
	done();
}

function assetsPipe(done) {
	src('html/assets/**').pipe(plumber()).pipe(dest('wp/assets'));

	done();
}

function bsReload(done) {
	bs.reload();
	done();
}

function assetsDel(done) {
	del('wp/assets');
	done();
}

function watchTask(done) {
	watch(['html/**/*.html'], series(htmlCompile));
	watch(['html/assets/**/*.scss'], series(scssCompile));
	watch(['html/assets/slice_images/**/*.+(jpg|jpeg|png|gif|svg)'], series(imageCompile));
	watch(['html/assets/scripts/**/*.js'], series(jsPipe));
	watch(['html/**'], series(bsReload));
	watch(['themes/**'], series(bsReload));
	watch(['wp/**'], series(bsReload));
}

exports.default = series(bsInit, bsReload, watchTask);
exports.static = series(bsInit_s, bsReload, watchTask);
exports.html = series(htmlCompile);
exports.sass = series(scssCompile);
exports.imagemin = series(imageCompile);
exports.js = series(jsPipe);
exports.assets = series(assetsPipe);
exports.assetsDel = series(assetsDel);
