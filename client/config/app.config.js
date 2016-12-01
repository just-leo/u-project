'use strict';
/* App config */
angular
  .module('app.config', [
    'app.config.autoload',
    'app.config.api',
    'app.config.routes'
  ])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    })
  }])
  .config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(app.DEBUG)
  }])
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(app.DEBUG);
  }])
  .constant('availableLanguages', {
    en: 'en-US,en;q=0.8',
    ru: 'ru-RU,ru'
  })
  .config(function($httpProvider, availableLanguages) {
      $httpProvider.defaults.headers.common['Accept-Language'] = availableLanguages['en'];
  })
  .run(function($rootScope, availableLanguages, $http){
      $rootScope.$on('languageChanged', function(event, lang){
        if(availableLanguages[lang]) {
          $http.defaults.headers.common['Accept-Language'] = availableLanguages[lang]
        }
        console.log('Switched to', availableLanguages[lang]);
      })
    });
