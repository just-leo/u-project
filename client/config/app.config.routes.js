'use strict';
/* App routes */
angular
  .module('app.config.routes', ['ui.router', 'LocalStorageModule'])
  .constant('DEFAULT_URL', '/')
  .constant('STATES', {
    MAINPAGE: 'landing',
    ERROR_NOTFOUND: '404'
  })
  .config([
    '$stateProvider', '$urlRouterProvider', 'STATES', 'DEFAULT_URL',
    function($stateProvider, $urlRouterProvider, STATES, DEFAULT_URL) {
      // when there is an empty route, redirect to /
      $urlRouterProvider.when('', DEFAULT_URL);

      $urlRouterProvider.otherwise(function($injector, $location) {
        var $state = $injector.get('$state');
        console.warn('[app.config.routes] location is not defined!', $state, $location);
        $state.go(STATES.MAINPAGE)
      });

      $stateProvider
        .state({
          url: '/',
          name: 'landing',
          templateUrl: 'layouts/main.html',
          controller: function($rootScope, $scope, page, Page, pageName, availableLanguages) {
            $scope.page = page;

            this.availableLanguageKeys = Object.keys(availableLanguages);

            this.reloadData = function() {
              Page.findOne({filter: {where: {name: pageName}}}).$promise.then(function(response) {
                $scope.page = response;
              })
            };

            this.toggleLanguage = function(lang) {
              $rootScope.$broadcast('languageChanged', lang);
              this.reloadData()
            }
          },
          controllerAs: 'controller',
          resolve: {
            page: function(Page) {
              return Page.findOne({filter: {where: {name: 'landing'}}}).$promise
            },
            pageName: function() {
              return 'landing'
            }
          },
          pageTitle: 'Main',
          authenticate: false
        })
        //Error page
        .state({
          name: '404',
          url: '/404',
          pageTitle: 'Page not found',
          views: {
            content: {
              templateUrl: 'layouts/404.html'
            }
          },
          authenticate: false
        })
    }
  ])
  .run([
    '$rootScope', '$state', '$log',
    function($rootScope, $state, $log){
      //Logs

      $rootScope.$state = $state;

      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          $log.info(event.name, toState.name);
        });
      $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
          $log.info(event.name, toState.name);
        });
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          $log.error(event.name, error);
          $log.info(event, toState, toParams, fromState, fromParams)
        });
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState, fromState, fromParams){
          $log.warn(event.name, unfoundState.to);
          $log.warn(unfoundState.toParams);

          var toState = unfoundState.to, toStateParent = toState;
          $log.error(toState, " state not found.");
        })
    }
  ]);
