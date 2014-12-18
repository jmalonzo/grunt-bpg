/*
 * grunt-bpg
 * https://github.com/jmalonzo/grunt-bpg
 * https://www.janalonzo.com
 *
 * Copyright (c) 2014 Jan Alonzo
 * Licensed under the MIT license.
 */

/** bpgenc options
BPG Image Encoder version 0.9
usage: bpgenc [options] infile.[jpg|png]

Main options:
-h                   show the full help
-o outfile           set output filename (default = out.bpg)
-q qp                set quantizer parameter (smaller gives better quality,
                     range: 0-51, default = 28)
-f cfmt              set the preferred chroma format (420, 422, 444,
                     default=420)
-c color_space       set the preferred color space (ycbcr, rgb, ycgco,
                     default=ycbcr)
-b bit_depth         set the bit depth (8 to 12, default = 10)
-lossless            enable lossless mode

Advanced options:
-alphaq              set quantizer parameter for the alpha channel (default = same as -q value)
-hash                include MD5 hash in HEVC bitstream
-nometadata          do not keep EXIF metadata
-v                   show debug messages

*/

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var path = require('path');
  var async = require('async');

  grunt.registerMultiTask('bpg', 'Convert your images to the BPG format', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      binpath: 'bpgenc',
      qp: 27,  // quantizer parameter
      cfmt: 420,  // preferred chroma format
      color_space: 'ycbcr',  // preferred colour space
      bit_depth: 10,  // bit depth
      lossless: false, // lossless mode
      alphaq: 27,  // quantizer paramter for the alpha channel
      hash: false,  // include MD5 hash in the HEVC bitstream
      nometadata: false,  // Keep EXIF metadata
      verbose: false  // set verbosity levl
    });

    async.eachSeries(this.files, function(fd, next) {
      var args = [];

      // Create folder for the dest file
      fd.dest = fd.dest.replace(path.extname(fd.dest), '.bpg');
      grunt.file.mkdir(path.dirname(fd.dest));

      for (var o in options) {
        if (!options.hasOwnProperty(o)) {
          continue;
        }

        if (o === 'binpath') {
          //args.push(options[o]);
          continue;
        }

        if (o === 'qp') {
          args.push('-q');
          args.push(options[o]);
        }

        if (o === 'cfmt') {
          args.push('-f');
          args.push(options[o]);
        }
        
        if (o === 'color_space') {
          args.push('-c');
          args.push(options[o]);
        }

        if (o === 'bit_depth') {
          args.push('-b');
          args.push(options[o]);
        }

        if (o === 'alphaq') {
          args.push('-alphaq');
          args.push(options[o]);
        }

        if (o === 'verbose' && options[o]) { args.push('-v');}
        if (o === 'lossless' && options[o]) { args.push('-lossless');}
        if (o === 'nometadata' && options[o]) { args.push('-nometadata');}
        if (o === 'hash' && options[o]) { args.push('-hash');}
      }

      args.push(fd.src);
      args.push('-o');
      args.push(fd.dest);

      grunt.log.writeln(options.binpath + ' ' + args.join(' '));

      var child = grunt.util.spawn({
        cmd: options.binpath,
        args: args
      }, function(error, result, code) {
        grunt.log.writeln(code + '' + result);
        if (code !== 0) {
          return grunt.warn(String(code));
        }
        next(error);
      });

      /**
       * displays the output and error streams via the parent process.
       */
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }.bind(this), this.async());
  });

};
