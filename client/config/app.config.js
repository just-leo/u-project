'use strict';
/* App config */
angular
  .module('app.config', [
    'app.config.autoload',
    'app.config.api',
    'app.config.routes',
    'LocalStorageModule'
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
  .constant('I18N_KEY', 'i18n')
  .constant('availableLanguages', {
    en: 'en-US,en;q=0.8',
    ru: 'ru-RU,ru'
  })
  .config(function($httpProvider, availableLanguages) {
    $httpProvider.defaults.headers.common['Accept-Language'] = availableLanguages['en'];
  })
  .run(function($rootScope, availableLanguages, $http, localStorageService, I18N_KEY){
    //Resolves language and setup header
    var selectedLanguage = localStorageService.get(I18N_KEY) || availableLanguages['en'];
    $http.defaults.headers.common['Accept-Language'] = selectedLanguage;

    $rootScope.$on('languageChanged', function(event, lang){
      if(availableLanguages[lang]) {
        $http.defaults.headers.common['Accept-Language'] = availableLanguages[lang];
        localStorageService.set(I18N_KEY, availableLanguages[lang]);
      }
      console.log('Switched to', availableLanguages[lang]);
    })
  });
