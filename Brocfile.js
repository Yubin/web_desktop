/*jshint node:true*/

var EmberApp      = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees    = require('broccoli-merge-trees');
var pickFiles     = require('broccoli-static-compiler');
var app;

/**
 * Import one or more symbols from an ES5 (RequireJS) module
 * @param {string} file    path to file containing the module, relative to project root
 * @param {array} symbols symbols from the module to import
 */
function importLegacyResource(file, symbols) {
	var export_symbols = {};
	symbols.forEach(function (sym) {
		export_symbols[sym] = ['default'];
	});

	app.import(file, {
		exports: export_symbols
	});
}

app = new EmberApp({
	fingerprint: {
		enabled: false
	},
	ramdisk: {
		removeTmp: true,
		disabled: (function () {
			// if this environment variable exists then we are
			// on screwdriver and should disable ramdisk
			return !!process.env.SCREWDRIVER;
		})()
	},
	es3Safe: false, // reduces initial build times by 15s, incremental by ~5s
	hinting: true, // reduces initial build times by 16s, incremental by ~3s
	//minifyJS: { enabled: false },//production build failing? uncomment this to debug
	vendorFiles: {
		'handlebars.js': {
			production: 'bower_components/handlebars/handlebars.js'
		}
	}
});
//
// app.import({
// 	development: 'bower_components/lodash/dist/lodash.underscore.js',
// 	production:  'bower_components/lodash/dist/lodash.underscore.min.js'
// });
//
// app.import('bower_components/velocity/jquery.velocity.js');
// app.import('bower_components/jquery-mousewheel/jquery.mousewheel.min.js');
// app.import('bower_components/moment/moment.js');
// app.import('bower_components/moment-timezone/builds/moment-timezone-with-data.js');
// app.import('bower_components/jquery-ui/ui/minified/jquery-ui.custom.min.js');
// app.import('bower_components/ic-ajax/dist/globals/main.js');
// app.import('bower_components/bootstrap-ads-data/dist/js/bootstrap.js');
// app.import('bower_components/ember-list-view/dist/list-view.js');
// app.import('bower_components/ember-table-shim/ember-table.js');
// app.import('vendor/ember-table-support/table.js');
//
// app.import({
// 	development: 'bower_components/d3/d3.js',
// 	production:  'bower_components/d3/d3.min.js'
// });
//
// app.import({
// 	development: 'bower_components/jszip/dist/jszip.js',
// 	production:  'bower_components/jszip/dist/jszip.min.js'
// });
//
// app.import({
// 	development: 'bower_components/Jcrop/js/jquery.Jcrop.js',
// 	production:  'bower_components/Jcrop/js/jquery.Jcrop.min.js'
// });
//
// app.import({
// 	development: 'bower_components/moneyFormatter/accounting.js',
// 	production:  'bower_components/moneyFormatter/accounting.min.js'
// });
//
// app.import({
// 	development: 'bower_components/select2/select2.js',
// 	production:  'bower_components/select2/select2.min.js'
// });
//
// app.import('bower_components/simplify-js/simplify.js');
// app.import('bower_components/filesaver/FileSaver.js');
// app.import('bower_components/bootstrap-daterangepicker/daterangepicker.js');
//
// app.import('bower_components/ember-data-model-fragments/dist/ember-data.model-fragments.js', {
// 	exports: {
// 		'fragments/attributes': [
// 			'hasOneFragment',
// 			'hasManyFragments',
// 			'fragmentOwner'
// 		]
// 	}
// });
//
// app.import('bower_components/opentip/lib/opentip.js');
// app.import('bower_components/opentip/lib/adapter-jquery.js');
//
// app.import('bower_components/FakeXMLHttpRequest/fake_xml_http_request.js');
// app.import('bower_components/fakehr/fakehr.js');
// app.import('bower_components/ember-testing-httpRespond/httpRespond-1.1.js');
// app.import('bower_components/js.edgar/src/edgar.js');

var trees = [];
trees.push(app.toTree());

module.exports = mergeTrees(trees, {
	overwrite: true
});
