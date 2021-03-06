'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        test: 'test'
    };

    try {
        yeomanConfig.app = require('./package.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:debug']
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.app %>/styles/*.css',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            debug: [
                '<%= yeoman.app %>/styles/*.css'
            ]
        },
        jshint: {
            options:{
                force: true,
                jshintrc: '.jshintrc',
                verbose: true,
                reporter: require('jshint-stylish')

            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/**/*.js',
                '!<%= yeoman.app %>/**/*.min.js',
                '!<%= yeoman.app %>/components/**/*.js',
                '!<%= yeoman.app %>/lib/**/*.js',
                '!app/lib/**/*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'test/config/karma.conf.js'
            },
            auto: {
                configFile: 'test/config/karma.conf.js',
                singleRun: false,
                autoWatch: true
            }
        },
        coverage: {
            options: { /* Please keep only one digit precision on the numbers. */
                thresholds: {
                    'statements': 63.4,
                    'branches': 52.2,
                    'functions': 54.5,
                    'lines': 63.4
                },
                dir: 'coverage',
                root: '.'
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '<%= yeoman.app %>/styles/',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/components',
                relativeAssets: true
            },
            dist: {},
            debug: {
                options: {
                    debugInfo: true
                }
            }
        },
        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/**/*.js',
                    '<%= yeoman.dist %>/**/*.css',
                    '!<%= yeoman.dist %>/initWorker.js',
                    '!<%= yeoman.dist %>/components/sw-toolbox/sw-toolbox.js',
                    '!<%= yeoman.dist %>/components/offline/*.js',
                    '!<%= yeoman.dist %>/worker.js'
                ]
            }
        },
        useminPrepare: {
            html: [
                '<%= yeoman.app %>/patients/*.html',
                '<%= yeoman.app %>/clinical/*.html',
                '<%= yeoman.app %>/**/*.html',
                '<%= yeoman.app %>/adt/**/*.html',
                '<%= yeoman.app %>/common/**/*.html',
                '<%= yeoman.app %>/orders/**/*.html',
                '<%= yeoman.app %>/home/**/*.html',
                '<%= yeoman.app %>/admin/**/*.html',
                '<%= yeoman.app %>/dhis/**/*.html',
                '<%= yeoman.app %>/registration/**/*.html',
                '<%= yeoman.app %>/document-upload/**/*.html',
                '<%= yeoman.app %>/reports/**/*.html'
            ],
            css: '<%= yeoman.app %>/styles/**/*.css',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        usemin: {
            html: [
                '<%= yeoman.dist %>/patients/**/*.html',
                '<%= yeoman.dist %>/clinical/**/*.html',
                '<%= yeoman.dist %>/adt/**/*.html',
                '<%= yeoman.dist %>/common/**/*.html',
                '<%= yeoman.dist %>/orders/**/*.html',
                '<%= yeoman.dist %>/home/**/*.html',
                '<%= yeoman.dist %>/admin/**/*.html',
                '<%= yeoman.dist %>/dhis/**/*.html',
                '<%= yeoman.dist %>/reports/**/*.html',
                '<%= yeoman.dist %>/registration/**/*.html',
                '<%= yeoman.dist %>/document-upload/**/*.html'
            ],
            css: '<%= yeoman.dist %>/styles/**/*.css',
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                banner: '/* Bahmni OPD minified CSS file */'
            },
            minify: {
                expand: true,
                cwd: '<%= yeoman.dist %>/styles/css/',
                src: ['**/*.css', '!**/*.min.*.css'],
                dest: '<%= yeoman.dist %>/styles/css/',
                ext: '.min.*.css'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    keepClosingSlash: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            'patients/**/*.html',
                            'clinical/**/*.html',
                            'adt/**/*.html',
                            'common/**/*.html',
                            'orders/**/*.html',
                            'home/**/*.html',
                            'admin/**/*.html',
                            'dhis/**/*.html',
                            'reports/**/*.html',
                            'registration/**/*.html',
                            'document-upload/**/*.html'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,txt,html,js}',
                            '.htaccess',
                            'components/**/*',
                            'images/**/*.{gif,webp}',
                            'styles/**/*',
                            '**/*/*.json',
                            'lib/**/*'
                        ]
                    }
                ]
            }
        },
        rename: {
            minified: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['patients.min.*.js'],
                        dest: '<%= yeoman.dist %>/patients/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['clinical.min.*.js'],
                        dest: '<%= yeoman.dist %>/clinical/'
                    },
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['adt.min.*.js'], dest: '<%= yeoman.dist %>/adt/'},
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['orders.min.*.js'],
                        dest: '<%= yeoman.dist %>/orders/'
                    },
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['home.min.*.js'], dest: '<%= yeoman.dist %>/home/'},
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['admin.min.*.js'],
                        dest: '<%= yeoman.dist %>/admin/'
                    },
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['dhis.min.*.js'], dest: '<%= yeoman.dist %>/dhis/'},
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['reports.min.*.js'],
                        dest: '<%= yeoman.dist %>/reports/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['registration.min.*.js'],
                        dest: '<%= yeoman.dist %>/registration/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['document-upload.min.*.js'],
                        dest: '<%= yeoman.dist %>/document-upload/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['patients.min.*.css'],
                        dest: '<%= yeoman.dist %>/patients/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['clinical.min.*.css'],
                        dest: '<%= yeoman.dist %>/clinical/'
                    },
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['adt.min.*.css'], dest: '<%= yeoman.dist %>/adt/'},
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['orders.min.*.css'],
                        dest: '<%= yeoman.dist %>/orders/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['home.min.*.css'],
                        dest: '<%= yeoman.dist %>/home/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['admin.min.*.css'],
                        dest: '<%= yeoman.dist %>/admin/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['dhis.min.*.css'],
                        dest: '<%= yeoman.dist %>/dhis/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['reports.min.*.css'],
                        dest: '<%= yeoman.dist %>/reports/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['registration.min.*.css'],
                        dest: '<%= yeoman.dist %>/registration/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['document-upload.min.*.css'],
                        dest: '<%= yeoman.dist %>/document-upload/'
                    }
                ]
            }
        },
        hologram: {
            generate: {
                options: {
                    config: 'hologram_config.yml'
                }
            }
        },
        ngAnnotate: {
            options: {
                remove: true,
                add: true
            },
            files: {
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['**/*.min.*.js'],
                dest: '<%= yeoman.dist %>'
            }
        },
        uglify:{
            options: {
                mangle: false
            },
            files:{
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['**/*.min.*.js'],
                dest: '<%= yeoman.dist %>'
            }
        },
        preprocess : {
            options: {
                context : {
                    DEBUG: 'production'
                }
            },
            js : {
                src : '<%= yeoman.dist %>/registration.min.js',
                dest : '<%= yeoman.dist %>/registration.min.js'
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('test', ['karma:unit', 'coverage']);

    grunt.registerTask('dist', [
        'clean:dist',
        'compass:dist',
        'useminPrepare',
        'ngAnnotate',
        'concat',
        'preprocess',
        'imagemin',
        'htmlmin',
        'cssmin',
        'copy:dist',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('build', [
        'npm-install',
        'bower-install',
        'jshint',
        'test',
        'dist'
    ]);

    grunt.registerTask('uglify-and-rename', [
        'uglify',
        'rename:minified'
    ]);


    var updatePrefetchList = function (preFetchList) {
        var replace = require("replace");

        replace({
            regex: "{pre-fetch-list}",
            replacement: preFetchList,
            paths: ['./app/worker.js'],
            recursive: false,
            silent: true
        });
    };

    var unique = function(array) {
        return array.filter(function(item, pos) {
            return array.indexOf(item) === pos;
        });
    };

    var getFiles = function (dir, files_) {
        var fs = require('fs');
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name, files_);
            } else {
                name = "'"+name.split("./app").join("/bahmni")+"'";
                if(files_.indexOf(name) === -1) {
                    files_.push(name);
                }
            }
        }
        return files_;
    };

    grunt.registerTask('default', ['build', 'uglify-and-rename']);
    grunt.registerTask('dev', ['build']);

    grunt.registerTask('pre-fetch', 'Generate files to pre-fetch for service worker', function() {
            var preFetchList = [];
            var preFetchDirs = ['./app/lib', './app/images', './app/home', './app/registration', './app/i18n/home', './app/i18n/registration'];
            for (var i in preFetchDirs) {
                preFetchList = preFetchList.concat(getFiles(preFetchDirs[i], preFetchList));
            }
            updatePrefetchList(unique(preFetchList));
        }
    );

    grunt.registerTask('bower-install', 'install dependencies using bower', function () {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('bower install', function (err, stdout) {
            console.log(stdout);
            cb();
        });
    });

    grunt.registerTask('npm-install', 'install dependencies using npm', function () {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('npm install', function (err, stdout) {
            console.log(stdout);
            cb();
        });
    });
};
