/*
 * grunt-bpg
 * https://github.com/jmalonzo/grunt-bpg
 * https://www.janalonzo.com
 *
 * Copyright (c) 2014 Jan Alonzo
 * Licensed under the MIT license.
 */

/** bpgenc options
BPG Image Encoder version 0.9.5
usage: bpgenc [options] infile.[jpg|png]

Main options:
-h                   show the full help (including the advanced options)
-o outfile           set output filename (default = out.bpg)
-q qp                set quantizer parameter (smaller gives better quality,
                     range: 0-51, default = 28)
-f cfmt              set the preferred chroma format (420, 422, 444,
                     default=420)
-c color_space       set the preferred color space (ycbcr, rgb, ycgco,
                     ycbcr_bt709, ycbcr_bt2020, default=ycbcr)
-b bit_depth         set the bit depth (8 to 12, default = 8)
-lossless            enable lossless mode
-e encoder           select the HEVC encoder (jctvc, default = jctvc)
-m level             select the compression level (1=fast, 9=slow, default = 8)

Animation options:
-a                   generate animations from a sequence of images. Use %d or
                     %Nd (N = number of digits) in the filename to specify the
                     image index, starting from 0 or 1.
-fps N               set the frame rate (default = 25)
-loop N              set the number of times the animation is played. 0 means
                     infinite (default = 0)
-delayfile file      text file containing one number per image giving the
                     display delay per image in centiseconds.
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
      encoder: 'jctvc',  // the HEVC encoder
      compression_level: 8, // compression level
      qp: 28,  // quantizer parameter
      cfmt: 420,  // preferred chroma format
      color_space: 'ycbcr',  // preferred colour space
      bit_depth: 8,  // bit depth
      lossless: false // lossless mode
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

        if (o === 'encoder') {
          args.push('-e');
          args.push(options[o]);
        }

        if (o === 'compression_level') {
          args.push('-m');
          args.push(options[o]);
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

        if (o === 'lossless' && options[o]) { args.push('-lossless');}
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
