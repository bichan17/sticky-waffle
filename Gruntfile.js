module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

   // Tasks
    watch: {
      compass: {
        files: ['**/*.{scss,sass}'],
        tasks: ['compass:dev']
      },
      js: {
        files: ['scripts/*.js'],
        tasks: ['uglify']
      }
    },
    compass: {
      dev: {
        //dev options
      },
      prod: {
        options: {
          importPath : 'bower_components/foundation/scss',              
          sassDir: ['scss'],
          cssDir: ['stylesheets'],
          environment: 'production'
        }
      }
    },
    uglify: {
      all: {
        files: {
          'scripts/min/main.min.js': ["bower_components/jquery/dist/jquery.min.js","bower_components/jquery-ui/ui/minified/jquery-ui.min.js","bower_components/jquery-knob/js/jquery.knob.js","bower_components/foundation/js/foundation.min.js","scripts/tuna.js","scripts/utils.js", "scripts/note.js", "scripts/synth.js", "scripts/visualizer.js", "scripts/main.js"]
        }
      },
    }

  });

  // DEPENDENT PLUGINS =========================/
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // Default task(s).
  grunt.registerTask('default', ['compass:dev' , 'uglify' , 'watch']);

};