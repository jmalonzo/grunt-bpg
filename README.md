# grunt-bpg

> Convert your images to the [BPG](http://bellard.org/bpg/) format

## Getting Started

This plugin requires bpgenc which is included in libbpg (libbpg is
also available in Homebrew). 

In addition, this plugin also requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bpg --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bpg');
```

## The "bpg" task

### Overview
In your project's Gruntfile, add a section named `bpg` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bpg: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

Run `bgpenc -h` for the full options.

#### options.binpath
Type: `String`
Default value: `'bpgenc'`

The location to the `bpgenc` binary.

#### options.qp
Type: `Number`
Default value: `27`

An integer value to use as the quantizer parameter.  set quantizer
parameter (smaller gives better quality, range: 0-51, default = 28)

#### options.cfmt
Type: `Number`
Default value: `420`

An integer value to use as the preferred chroma format (420, 422, 444, default=420)

#### options.color_space
Type: `Number`
Default value: `'ycbcr'`

A string value to use as the preferred color space (ycbcr, rgb, ycgco, ycbcr_bt709, ycbcr_bt2020, default=ycbcr)

#### options.bit_depth
Type: `Number`
Default value: `8`

An integer value to use as the bit depth (8 to 12, default = 8)

#### options.lossless
Type: `Boolean`
Default value: `false`

Enable lossless mode

#### options.encoder
Type: `String`
Default value: `'jctvc'`

The HEVC encoder (jctvc)

#### options.compression_level
Type: `Number`
Default value: `8`

The compression level (1=fast, 9=slow, default = 8)

#### options.alphaq
Type: `Number`
Default value: `28`

The quantizer parameter for the alpha channel (same as the 'qp' param)

#### options.hash
Type: `Boolean`
Default value: `false`

Include the MD5 hash in HEVC bitstream

#### options.keepmetadata
Type: `Boolean`
Default value: `false`

Keep the metadata (from JPEG: EXIF, ICC profile, XMP, from PNG: ICC profile)

#### options.verbose
Type: `Boolean`
Default value: `false`

Show debug messages


### Usage Examples

#### Default Options

```js
grunt.initConfig({
  bpg: {
    options: {},
    files: [{
      expand: true,
      src: ['**/*.{jpg,png}'],
      cwd: 'assets/images',
      dest: 'build/images'
    }]
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

