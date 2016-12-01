'use strict';

var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.mongoDs;

  //create all models
  async.parallel({
    pages: async.apply(createPages)
  }, function(err, results) {
    if (err) throw err;
    console.log('> models created sucessfully');
  });

  //create collection
  function createPages(cb) {
    mongoDs.automigrate('Page', function(err) {
      if (err) return cb(err);
      var Page = app.models.Page;
      Page.create({
        name: 'landing',
        header: {
          en: 'Title of Your Product, Service or Event',
          ru: 'Название продукта или события'
        },
        headerTagLine: {
          en: 'It\'s a tag line, where you can write a key point of your idea.',
          ru: 'Ключевые особенности'
        },
        createdAt: Date.now()
      }, cb);
    });
  }
};
