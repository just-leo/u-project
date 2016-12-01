'use strict';

var traverse = require('traverse');

module.exports = function(Page) {

  Page.validatesUniquenessOf('name', {message: 'Page name is not unique'});

  //deny access to some public apis
  Page.disableRemoteMethod('deleteById', true); // DELETE
  Page.disableRemoteMethod('create', true); // POST
  Page.disableRemoteMethod('upsert', true); // PUT
  Page.disableRemoteMethod('updateAll', true); // POST

  Page.afterRemote('findOne', function(context, remoteMethodOutput, next) {
    var language = context.req.language;//contains user language

    console.log('lang', language, context.req.headers['accept-language']);

    //doing like this
    //remoteMethodOutput.header = remoteMethodOutput.header[context.req.language];

    traverse(remoteMethodOutput).forEach(function(item) {
      if (this.key === language) {
        this.parent.update(item);
      }
    });

    next();
  });
};
