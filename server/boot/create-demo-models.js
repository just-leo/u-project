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
        motivationText: {
          en: 'Text that should motivate your visitors to take an action and push the button',
          ru: 'Текст который должен мотивировать ваших посетителей к действию'
        },
        mainActionButton: {
          en: 'Watch Video',
          ru: 'Видео'
        },
        menu: {
          gallery: {
            en: 'Gallery',
            ru: 'Галлерея'
          },
          pricing: {
            en: 'Pricing',
            ru: 'Цены'
          },
          contacts: {
            en: 'Contacts',
            ru: 'Контакты'
          }
        },
        threeSteps: {
          header: {
            en: 'Solution in 3 Easy Steps',
            ru: '3 простых шага'
          },
          subHeader: {
            en: 'Explain that your product, service or event can solve anything in 3 easy steps.',
            ru: 'Обьясните, что с помощью вашего продукта или сервиса можно решить все проблемы за три простых шага.'
          },
          stepHeader: {
            en: 'Step',
            ru: 'Шаг.'
          },
          stepsContent: [
            {
              en: 'Add short description of the Step 1, so your customers could feel how it\'s easy to get a solution with your product, service or event',
              ru: 'Короткое описание шага 1, что ваши клиенты могут почувствоватьб как просто найти решение с помощью вашего продуктаб сервиса или события'
            },
            {
              en: 'Add short description of the Step 2, so your customers could feel how it\'s easy to get a solution with your product, service or event',
              ru: 'Короткое описание шага 2, что ваши клиенты могут почувствоватьб как просто найти решение с помощью вашего продуктаб сервиса или события'
            },
            {
              en: 'Add short description of the Step 3, so your customers could feel how it\'s easy to get a solution with your product, service or event',
              ru: 'Короткое описание шага 3, что ваши клиенты могут почувствоватьб как просто найти решение с помощью вашего продуктаб сервиса или события'
            }
          ]
        },
        adsBar: {
          header: {
            en: 'Time Limited Offer',
            ru: 'Ограниченное предложение'
          },
          subHeader: {
            en: 'Tell your visitors about some',
            ru: 'Расскажите про'
          },
          helpText: {
            en: '(with 50% OFF) It will raise the Conversion!',
            ru: '(с 50% скидкой) Это поможет начать общение!'
          },
          actionButton: {
            en: 'Call to action button',
            ru: 'Действие'
          }
        },
        promote: {
          header: {
            en: 'Promote Yourself',
            ru: 'Расскажите о себе'
          },
          subHeader: {
            en: 'Show your best to get a good offer',
            ru: 'Покажите ваши лучшие навыки чтобы получить хорошее предложение'
          }
        },
        pricing: {
          header: {
            en: 'Show Your Pricing Plans',
            ru: 'Ваши тарифные планы'
          },
          subHeader: {
            en: 'Let your visitors compare and choose the most suitable variant',
            ru: 'Позвольте вашим посетителям сравнить и выбрать наиболее подходящий вариант'
          }
        },
        clients: {
          header: {
            en: 'Show the List of Your Clients',
            ru: 'Покажите список ваших клиентов'
          }
        },
        createdAt: Date.now()
      }, cb);
    });
  }
};
