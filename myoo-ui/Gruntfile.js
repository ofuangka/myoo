module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: '../myoo-me/src/main/webapp/ui/'
            }
        }
    });
    grunt.registerTask('default', ['copy']);
};