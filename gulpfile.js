"use strict";

// 出力するWPテーマ名を記入
const themeName = "goto_theme";

const bs = require("browser-sync");
const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const imageMin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");
const htmlmin = require("gulp-htmlmin");
const connectSSI = require("connect-ssi");
const del = require("del");
const path = require("path");

// BrowserSync
function bsInit(done) {
  bs.init({
    proxy: "localhost:8000",
    notify: false,
    middleware: [
      connectSSI({
        baseDir: __dirname + "/wp",
        ext: ".html",
      }),
    ],
  });
  done();
}
function bsInit_s(done) {
  bs.init({
    server: {
      baseDir: "./static",
      port: 5656,
      open: true,
      notify: false,
      middleware: [
        connectSSI({
          baseDir: __dirname + "/static",
          ext: ".html",
        }),
      ],
    },
  });

  done();
}

// Compile
function htmlCompile(done) {
  return src("static/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: false,
      })
    )
    .pipe(dest("wp/"));
}

function scssCompile(done) {
  src("static/assets/styles/**/*.scss")
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(dest("static/assets/styles/"))
    .pipe(dest("wp/assets/styles/"));

  done();
}

function imageCompile(done) {
  // 全ての画像ファイルを削除する
  del(["static/assets/images/**/*", "wp/assets/images/**/*"]).then(() => {
    src("static/assets/slice_images/**/*")
      .pipe(
        imageMin([
          pngquant({
            quality: [0.8, 0.9],
            speed: 1,
          }),
          mozjpeg({ quality: 80 }),
          imageMin.svgo(),
          imageMin.optipng(),
          imageMin.gifsicle({ optimizationLevel: 3 }),
        ])
      )
      .pipe(dest("static/assets/images/"))
      .pipe(dest("wp/assets/images/"));
    done();
  });
}

function jsPipe(done) {
  src("static/assets/scripts/**/*.js").pipe(plumber()).pipe(dest("wp/assets/scripts"));

  done();
}

function assetsPipe(done) {
  src("static/assets/**").pipe(plumber()).pipe(dest("wp/assets"));

  done();
}

function bsReload(done) {
  bs.reload();

  done();
}

function assetsDel(done) {
  del("wp/assets");
  done();
}

function watchTask(done) {
  watch(["static/**/*.html"], series(htmlCompile));
  watch(["static/assets/**/*.scss"], series(scssCompile));
  watch(["static/assets/slice_images/**/*.+(jpg|jpeg|png|gif|svg)"], series(imageCompile));
  watch(["static/assets/scripts/**/*.js"], series(jsPipe));
  watch(["static/**"], series(bsReload));
  watch(["themes/**"], series(bsReload));
  watch(["wp/**"], series(bsReload));
}

exports.default = series(bsInit, bsReload, watchTask);
exports.static = series(bsInit_s, bsReload, watchTask);
exports.html = series(htmlCompile);
exports.sass = series(scssCompile);
exports.imagemin = series(imageCompile);
exports.js = series(jsPipe);
exports.assets = series(assetsPipe);
exports.assetsDel = series(assetsDel);

