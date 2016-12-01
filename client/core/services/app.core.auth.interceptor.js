'use strict';

angular.module('app.core.interceptor', ['lbServices', 'LocalStorageModule'])
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth.login.success',
    loginFailed: 'auth.login.failed',
    logoutSuccess: 'auth.logout.success',
    sessionTimeout: 'auth.session.timeout',
    notAuthenticated: 'auth.not.authenticated',
    notAuthorized: 'auth.not.authorized'
  })
  .config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('frontend');
    // localStorageServiceProvider.setStorageCookieDomain('example.com');
    // localStorageServiceProvider.setStorageType('localStorage');
  })
  .factory('AuthService', function($rootScope, $q, AUTH_EVENTS, User, LoopBackAuth, localStorageService) {

      var authService = {};

      authService.init = function() {
          if(LoopBackAuth.currentUserData)
            return LoopBackAuth.currentUserData;
          //return User.getCurrent()
      };

      authService.login = function login(credentials, rememberMe) {
        var deferred = $q.defer();

        User.login({ rememberMe: rememberMe }, credentials)
          .$promise.then(
            function(response){
              deferred.resolve(response);
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, response.user);
            },
            function(errResponse){
              $rootScope.$broadcast(AUTH_EVENTS.loginFailed, errResponse);
              deferred.reject(errResponse);
            }
          );

        return deferred.promise
      };

      authService.logout = function logout(){
        var deferred = $q.defer();
        LoopBackAuth.clearUser();
        LoopBackAuth.clearStorage();
        User.logout().$promise.then(
          function(response){
            deferred.resolve(response);
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
          },
          deferred.reject
        );

        return deferred.promise
      };

      authService.registration = function(credentials) {
        var deferred = $q.defer();
        User.create(credentials, function(response, headers){
          deferred.resolve(response);
        }, deferred.reject);

        return deferred.promise
      };

      authService.isAuthenticated = function isAuthenticated(){
          return User.isAuthenticated()
      };

      authService._returnState = null;

      authService.setReturnState = function(state, params) {
        authService._returnState = {
          name: state.name,
          params: params
        };
        localStorageService.set('_returnState', authService._returnState);
      };

      authService.getReturnState = function(){
        if(!authService._returnState) {
          authService._returnState = localStorageService.get('_returnState')
        }
        return authService._returnState
      };

      return authService
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($rootScope, $q, $injector, AUTH_EVENTS, $log, LoopBackAuth) {
        //TODO LoopBackAuth
        var _request = function(config) {
          config.headers = config.headers || {};
          config.params = config.params || {};

          //config.headers.Authorization = 'Bearer ' + sid;
          //config.params.session = Session.id;
          //config.params.token = Session.token;

          if(console.time && app.DEBUG) console.time('request');

          return config;
        };

        var _responseError = function(rejection) {
          $log.error('interceptor:', rejection.status, rejection);
          $rootScope.$broadcast({
            //0: AUTH_EVENTS.notAuthenticated,
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[rejection.status], rejection);

          if(rejection.status === 401) {
            //Now clearing the loopback values from client browser for safe logout...
            LoopBackAuth.clearUser();
            LoopBackAuth.clearStorage();
          }

          return $q.reject(rejection)
        };

        var _response = function(response) {
          if (response.status === 401 || response.status === 403) {
            $rootScope.$broadcast({
              401: AUTH_EVENTS.notAuthenticated,
              403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
          }
          if(response.status === 401) {
            //Now clearing the loopback values from client browser for safe logout...
            LoopBackAuth.clearUser();
            LoopBackAuth.clearStorage();
          }
          if(console.time && app.DEBUG) {
            $log.debug(response.config.url);
            console.timeEnd('request');
          }

          return response || $q.when(response);
        };

        return {
          request: _request,
          response: _response,
          responseError: _responseError
        }
      })
  }]);
