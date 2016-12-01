'use strict';
/* Cross app modules (common) */
angular
  .module('app.core', [
    'ngAnimate',
    'app.core.interceptor',
    'app.config',
    'cfp.loadingBar',
    'ui-notification'
  ])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
  }])
  .config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 4000
      //startTop: 20,
      //startRight: 10,
      //verticalSpacing: 20,
      //horizontalSpacing: 20,
      //positionX: 'right',
      //positionY: 'top',
      //replaceMessage: false
    })
  })
  .run(function($urlRouter, User, $rootScope, AuthService, $state, STATES, cfpLoadingBar, Notification, $log) {
    var start = cfpLoadingBar.start;
    var complete = function() {
      if(cfpLoadingBar.status() > 0) {
        cfpLoadingBar.complete()
      }
    };

    /**
     * Shortcut to take user back
     * @returns {promise|void}
     */
    $rootScope.goBack = function goBack(){
      complete();
      var lastState = AuthService.getReturnState();
      if(lastState && lastState.name){
        return $state.go(lastState.name, lastState.params)
      } else {
        return $state.go(STATES.DEFAULT, {})
      }
    };

    /**+
     * AuthInterceptor events
     */
    $rootScope.$on('auth.not.authorized', function(e){
      //Use this exception when a user has been authenticated but is not allowed to perform the requested action
      Notification.warning('У вас недостаточно прав для выполнения данного действия').then(function() {
        User.isAuthenticated()
      })
    });

    $rootScope.$on('auth.not.authenticated', function(e){
      if(AuthService.isAuthenticated()) {
        Notification.warning({message: 'Время сессии истекло, необходимо авторизоваться снова', closeOnClick: true, delay: 30000}).then(function() {
          $state.go(STATES.LOGINPAGE, {}, {reload: true})
        })
      }
    });

    $rootScope.$on('auth.login.success', function(e, value){
      Notification.clearAll();
      $rootScope.setCurrentUser(value);
      $rootScope.goBack()
    });

    $rootScope.$on('auth.logout.success', function(){
      if($rootScope.$state.current.name.indexOf(STATES.REGISTRATION) < 0) {
        AuthService.setReturnState($rootScope.$state.current.name, $rootScope.$state.params)
      }
      $rootScope.setCurrentUser(null);
      complete();
      $state.go(STATES.LOGINPAGE, {}, {reload: true})
    });
    /**
     * /AuthInterceptor events end
     */

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if(!toState.abstract) {//&& (toState.name !== STATES.LOGINPAGE) && (toState.name !== STATES.REGISTRATION)
          //remember not abstract and not user logins states
          AuthService.setReturnState(toState, toParams)
        }

        //Auth DISABLED
        //if(toState.name.indexOf(STATES.LOGINPAGE) > -1) {
        //  if(AuthService.isAuthenticated()) {
        //    event.preventDefault();
        //    //notify
        //    $rootScope.goBack();
        //  }
        //} else {
        //  //AUTHENTICATION CHECK
        //  if (toState.authenticate !== false && !AuthService.isAuthenticated()) {
        //    //auth required
        //    event.preventDefault();
        //    complete();
        //    $state.go(STATES.LOGINPAGE);
        //  }
        //}
      });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      if(error.status == 404) {
        $state.go(STATES.ERROR_NOTFOUND)
      }
      console.warn(error)
    });

    $rootScope.currentUser = null;
    $rootScope.isAuthenticated = AuthService.isAuthenticated;

    $rootScope.setCurrentUser = function (user) {
      $rootScope.currentUser = user;
    };

    $rootScope.setCurrentUser(AuthService.init())
  })
  .run(function(cfpLoadingBar, $rootScope){
    //Loading bar manipulation

    var start = cfpLoadingBar.start;
    var complete = cfpLoadingBar.complete;

    $rootScope.$on('$stateChangeStart', start);
    $rootScope.$on('$stateChangeSuccess', complete);
    $rootScope.$on('$stateChangeError', complete)
  })
  .run(function($rootScope, $state) {
    //Page Title handling

    $rootScope.$state = $state;
    $rootScope.pageTitle = '';

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        if(!toState.abstract) {
          $rootScope.pageTitle = toState.pageTitle ? toState.pageTitle : ''
        }
      });

    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        $rootScope.pageTitle = '';
      });

    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams){
        $rootScope.pageTitle = '';
      });

    console.info(app.workingTime(), 'Ready!')
  });
