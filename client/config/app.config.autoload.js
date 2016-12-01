'use strict';
/* Lazy loader module-config */
angular
  .module('app.config.autoload', [
    'oc.lazyLoad'
  ])
  .constant('autoloaderDebugMode', false)
  .constant('modulesToLoad', [
    //list of modules to load on demand
  ])
  .config([
    '$ocLazyLoadProvider', 'modulesToLoad', 'autoloaderDebugMode',
    function($ocLazyLoadProvider, modulesToLoad, autoloaderDebugMode) {
      //if(debug) {
      //  angular.forEach(modules, function (module) {
      //    module.cache = false
      //  })
      //}

      $ocLazyLoadProvider.config({
        debug: autoloaderDebugMode,
        events: false,
        modules: modulesToLoad
      })
    }
  ]);
