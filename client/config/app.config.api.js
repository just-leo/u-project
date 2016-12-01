'use strict';

angular
  .module('app.config.api', [
    'lbServices'
  ])
  .constant('ALLOW_PUBLIC_API', false)
  .config(function(LoopBackResourceProvider, ALLOW_PUBLIC_API) {
    // Use a custom auth header instead of the default 'Authorization'
    //LoopBackResourceProvider.setAuthHeader('X-Access-Token');

    // Change the URL where to access the LoopBack REST API server
    //var host = location.host;
    //if((host.indexOf('localhost') > -1) || (host.indexOf('127.0.0.1') > -1)) {
    //  LoopBackResourceProvider.setUrlBase('http://localhost/api');
    //} else if(ALLOW_PUBLIC_API){
    //  LoopBackResourceProvider.setUrlBase(location.protocol + '//' + location.hostname + '/api');
    //} else {
    //  LoopBackResourceProvider.setUrlBase('http://192.168.0.100/api');
    //}
  });
