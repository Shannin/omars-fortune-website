module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['js/**/*.js'],
        // the location of the resulting JS file
        dest: 'tmp/main.js'
      }
    },
    sass: {
      dist: {
        files: {
          'public/css/main.css': 'sass/main.scss'
        }
      }
    },
    uglify: {
      options: {
        compress: { unused: false }
      },
      dist: {
        files: {
          'public/js/main.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    watch: {
      styles: {
        files: ['js/**/*.js', 'sass/**/*.scss'], // which files to watch
        tasks: ['concat', 'uglify', 'sass'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['concat', 'sass', 'uglify', 'watch']);
};