'use strict';

var traverse = require('traverse');

module.exports = function(Page) {

  Page.validatesUniquenessOf('name', {message: 'Page name is not unique'});

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
