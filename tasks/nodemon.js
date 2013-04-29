/*
 * grunt-nodemon
 * https://github.com/ChrisWren/grunt-nodemon
 *
 * Copyright (c) 2013 Chris Wren
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('nodemon', 'Starts a nodemon server.', function () {

    var command = [];
    var options = this.options();
    var done = this.async();

    if (options.exec) {
      command.push('--exec');
      command.push(options.exec);
    }

    if (options.delayTime) {
      command.push('--delay')
      command.push(options.delayTime);
    }

    if (options.ignoredFiles) {
      var fileContent = '# Generated by grunt-nodemon\n';
      options.ignoredFiles.forEach(function(ignoredGlob){
        fileContent += ignoredGlob + '\n';
      });
      grunt.file.write('.nodemonignore', fileContent);
    }

    if (options.watchedFolders) {
      options.watchedFolders.forEach(function(folder){
        command.push('--watch');
        command.push(folder);
      });
    }

    if (options.watchedExtensions) {
      command.push('-e');
      var extensionList = '';
      options.watchedExtensions.forEach(function(extensions) {
        extensionList += extensions + ','
      });
      command.push(extensionList.slice(0, -1));
    }

    if (options.debug) command.push('--debug');

    if(options.file) command.push(options.file);

    if(options.args) {
      options.args.forEach(function(arg){
        command.push(arg);
      });
    }

    grunt.util.spawn({
      cmd: 'nodemon',
      args: command,
      opts: {
        stdio: 'inherit'
      }
    }, function (error, result) {
      if (error) {
        grunt.log.error(result.stderr);
        grunt.log.error('Make sure you have nodemon installed globally. You can install it by entering the following into your terminal:');
        grunt.log.ok('npm install nodemon -g');
        done(false);
      }
      grunt.log.writeln(result.stdout);
      done();
    });
  });

}
