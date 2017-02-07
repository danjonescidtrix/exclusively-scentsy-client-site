module.exports = function(grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-ejs');

    var userConfig = {
        buildDir: "build",
        srcDir: "www"
    };

    var taskConfig = {

        copy: {
            assets: {
                files: [{
                    src: ['**'],
                    dest: '<%= buildDir %>/img/',
                    cwd: '<%= srcDir %>/img/',
                    expand: true
                }, {
                    src: ['**'],
                    dest: '<%= buildDir %>/fonts/',
                    cwd: '<%= srcDir %>/fonts/',
                    expand: true
                }, {
                    src: ['**/*.js'],
                    dest: '<%= buildDir %>/js/',
                    cwd: '<%= srcDir %>/js/',
                    expand: true
                }, {
                    src: ['**/*.php'],
                    dest: '<%= buildDir %>/',
                    expand: true,
                    cwd: '<%= srcDir %>/',
                    ext: '.php'
                }]
            }
        },

        ejs: {
            all: {
                src: ['**/*.ejs', '!**/_*.ejs'],
                dest: '<%= buildDir %>/',
                expand: true,
                cwd: '<%= srcDir %>/',
                ext: '.html',
            },            
        },

        sass: {
            compile: {
                files: {
                    '<%= buildDir %>/css/main.css': '<%= srcDir %>/sass/main.scss'
                }
            },
            bootstrap: {
                files: {
                    '<%= buildDir %>/css/bootstrap.css': '<%= srcDir %>/sass/bootstrap/bootstrap.scss'
                }
            },
            fontawesome: {
                files: {
                    '<%= buildDir %>/css/font-awesome.css': '<%= srcDir %>/sass/font-awesome/font-awesome.scss'
                }
            }

        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 5 versions'
                    })
                ]
            },
            dist: {
                src: '<%= buildDir %>/css/main.css'
            }
        },
        csso: {
            compress: {
                options: {
                    report: 'gzip'
                },
                files: {
                    '<%= buildDir %>/css/main.css': ['<%= buildDir %>/css/main.css']
                }
            }
        },
        delta: {

            options: {
                livereload: true
            },

            /**
             * When the SCSS files change, we need to compile and copy to build dir
             */
            sass: {
                files: ['<%= srcDir %>/**/*.scss'],
                tasks: ['sass:compile', 'postcss:dist'],
                options: {
                    livereload: true
                },
            },

            /**
             * When .ejs file changes, we need to compile ejs into HTML.
             */
            html: {
                files: ['<%= srcDir %>/**/*.ejs'],
                tasks: ['ejs:all'],
                options: {
                    livereload: true
                },
            },

            assets: {
                files: [
                    '<%= srcDir %>/img/**/*',
                    '<%= srcDir %>/fonts/**/*',
                    '<%= srcDir %>/js/**/*',
                ],
                tasks: ['copy:assets']
            },

            js: {
                files: ['<%= srcDir %>/js**/*'],
                options: {
                    livereload: true
                },
            },
        }
    }

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));
    // grunt.config.init(taskConfig);

    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', [
        'sass:bootstrap',
        'sass:compile',
        'ejs:all',
        'copy:assets',
        'postcss:dist',
        'delta'
    ]);

    grunt.registerTask('build', [
        'sass:bootstrap',
        'sass:compile',
        'ejs:all',
        'postcss:dist',
        'copy:assets'
    ]);

    grunt.registerTask('csso', ['csso:compress']);
    grunt.registerTask('default', ['sass:bootstrap', 'sass:compile', 'postcss:dist']);

}