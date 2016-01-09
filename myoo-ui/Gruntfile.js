module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {
                force: true
            },
            dist: 'dist/',
            ui: '../myoo-me/src/main/webapp/ui/'
        },
        copy: {
            components: {
                expand: true,
                cwd: 'src/',
                src: 'components/**',
                dest: 'dist/'
            },
            src: {
                expand: true,
                cwd: 'src/',
                src: ['**/*', '!**/components/**', '!**/*.js', '!**/*.css', '!index.html'],
                dest: 'dist/'
            },
            dist: {
                expand: true,
                cwd: 'dist/',
                src: '**',
                dest: '../myoo-me/src/main/webapp/ui/'
            }
        },
        concat: {
            build: {
                src: ['src/**/*.js', '!**/components/**'],
                dest: 'dist/myoo.js'
            }
        },
        uglify: {
            build: {
                src: 'dist/myoo.js',
                dest: 'dist/myoo.min.js'
            }
        },
        cssmin: {
            build: {
                src: ['src/**/*.css', '!**/components/**'],
                dest: 'dist/myoo.min.css'
            }
        },
        processhtml: {
            build: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true
            },
            build: {
                expand: true,
                cwd: 'dist',
                src: '**/*.html',
                dest: 'dist/'
            }
        }
    });
    grunt.registerTask('build', ['clean', 'copy:components', 'copy:src', 'concat', 'uglify', 'cssmin', 'processhtml', 'htmlmin']);
    grunt.registerTask('default', ['build', 'copy:dist']);
};