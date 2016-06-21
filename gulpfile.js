'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const jade = require('gulp-jade');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const fontgen = require('gulp-fontgen');


const src = {
	scss: 'scss/*.scss',
	scssPartials: 'scss/partials/*.scss',
	fontsScss: 'scss/partials/fonts.scss',
	jade: '*.jade',
	jadePartials: 'partials/*jade',
	js: ['js/pubsub.js', 'js/*.js'],
	img: 'images/*',
	audio: 'audio/*',
	fonts: 'fonts/'
};

const dist = {
	base: 'dist',
	css: 'dist/css',
	js: 'dist/js',
	img: 'dist/images',
	audio: 'dist/audio',
	fonts: 'dist/fonts'
};

// Static Server + watching scss/jade files
gulp.task('serve', ['sass+clean-font-partial', 'jade', 'javascript'], function() {
	browserSync.init({
		server: {
			baseDir: dist.base
		},
		browser: "chromium-browser"
	});

	gulp.watch([src.scss, src.scssPartials], ['sass']);
	gulp.watch([src.jade, src.jadePartials], ['jade']);
	gulp.watch(src.js, ['javascript']);
});

gulp.task('clean', function(){
	return del(dist.base);
});


// Compile sass into CSS
gulp.task('sass', ['fontgen'], function() {
	return gulp.src(src.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(dist.css))
		.pipe(browserSync.stream({once: true}));
});

// Remove temporary scss/partials/fonts.scss
gulp.task('sass+clean-font-partial', ['sass'], function() {
	return del(src.fontsScss.replace(/\.scss$/, "*$&"));
});

// Compile jade into HTML
gulp.task('jade', function() {
	let locals = {title: "Calculator"};

	return gulp.src(src.jade)
		.pipe(jade({ locals }))
		.pipe(gulp.dest(dist.base))
		.pipe(browserSync.stream({once: true}));
});

// Concat all jscripts, keeping non-hoisted classes declarations first
gulp.task('javascript', function() {
	return gulp.src(src.js)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(dist.js))
		.pipe(browserSync.stream({once: true}));
});



// Create temporary scss/partials/font.scss
gulp.task('fontgen', function() {
	return gulp.src(src.fonts + "*")
		.pipe(fontgen({
			dest: dist.fonts,
			css: src.fontsScss,
			css_fontpath: "../fonts",
			embed: ['woff2'],
			subset: ".0123456789+-*/%InfiNeaty"
		}));
});


// Create temporary scss/partials/font.scss
// gulp.task('fontgen', function(done) {
// 	const fonts  = fs.readdirSync(src.fonts);
//
// 	for (let i = fonts.length - 1; i >= 0; i--) {
// 		const font = fonts[i];
// 		const extension = path.extname(font);
// 		let scss = src.fontsScss;
// 		// different name if more than 1 font
// 		if(fonts.length > 1) scss = scss.replace(/\.scss$/, `.${path.basename(font, extension)}$&`);
//
// 		if (extension == '.ttf' || extension == '.otf' || extension == '.woff') {
// 			fontfacegen({
// 				source: path.join(src.fonts, font),
// 				css: scss,
// 				dest: dist.fonts,
// 				css_fontpath: '../fonts/',
// 				embed: ["woff2"],
// 				// strips every character except for subset
// 				subset: '.0123456789+-*/%InfiNeaty'
// 			});
// 		}
// 	}
//
// 	done();
// });



gulp.task('default', ['serve']);
