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
  .factory('browserLanguage', function($window) {
    // tries to determine the browsers language
    var nav = $window.navigator,
      browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
      i,
      language;

    // support for HTML 5.1 "navigator.languages"
    if (angular.isArray(nav.languages)) {
      for (i = 0; i < nav.languages.length; i++) {
        language = nav.languages[i];
        if (language && language.length) {
          return language;
        }
      }
    }

    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
      language = nav[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        return language;
      }
    }

    return null
  })
  .run(function($rootScope, availableLanguages, $http, localStorageService, I18N_KEY, browserLanguage){
    //Resolves language and setup header
    var selectedLanguage = localStorageService.get(I18N_KEY) || browserLanguage;
    var langCode = (selectedLanguage || '').substr(0, 2).toLowerCase();
    if(selectedLanguage !== null && availableLanguages[langCode]) {
      $http.defaults.headers.common['Accept-Language'] = selectedLanguage;
    }

    $rootScope.$on('languageChanged', function(event, lang){
      if(availableLanguages[lang]) {
        $http.defaults.headers.common['Accept-Language'] = availableLanguages[lang];
        localStorageService.set(I18N_KEY, availableLanguages[lang]);
      }
      console.log('Switched to', availableLanguages[lang]);
    })
  });
