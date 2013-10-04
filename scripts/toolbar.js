(function(){
  'use strict';

  /* Модель панели инструментов */
  var Toolbar = function(){
    var root = this;

    this.self = $('#toolbar');


    /* Действие при нажатии кнопки панели инструментов */
    this.self.find('li[data-move]').on('click', function(){
      root.hand($(this));
    });

    /* Раскрытие селектов инструментов */
    this.self.find('.flap .shake').on('click', this.opted);



    /* -------------------- Документ -------------------- */
    /* Выбран файл MS-Word */
    this.self.find('#msword').on('change', function(){
      root.loadDoc2html($(this));
    });

    /* Сохранение документа */
    this.self.find('#save').on('click', function(){
      root.save();
    });

    /* Вернуть редактор в состояние на шаг назад */
    this.self.find('#story-undo').on('click', this.undo);

    /* Вернуть редактор в состояние на шаг вперед*/
    this.self.find('#story-redo').on('click', this.redo);



    /* ------------------ Выравнивание ------------------ */
    /* Установка / снятие многоточия */
    this.self.find('.feather').on('click', this.feather.bind(this));



    /* ------------------- Изображения ------------------- */
    /* Выбран файл изображения */
    this.self.find('#picture').on('change', function(){
      root.loadPicture($(this));
    });

    /* Подписи к изображения */
    this.self.find('[data-draw]').on('click', function(){
      root.draw($(this));
    });



    /* --------------- Шаблоны --------------- */
    /* Вставка спецсимвола */
    this.self.find('#special-simbol li').on('click', this.insertSpecialSimbol);

    /* Добавить абзац */
    this.self.find('[data-indent]').on('click', function(){
      root.indent($(this));
    });

    /* Очистить документ */
    this.self.find('#dry').on('click', this.dryPage);

    /* Стиль многоточий */
    this.self.find('#ledge-style').on('click', this.ledgeStyle.bind(this));



    /* --------------------- Таблицы --------------------- */
    /* Работа с таблицами */
    this.self.find('[data-map]').on('click', function(){
      root.map($(this));
    });



    /* Настройка инструментов */
    this.settings();

    return this;
  };



  Toolbar.p = Toolbar.prototype;




  /* Настройка инструментов */
  Toolbar.p.settings = function(){
    if (E.conf.basic){

      /* Удалить поле ввода скрытия страниц */
      this.self.find('#hide-page').remove();

      /* Удалить кнопку поворота страницы */
      this.self.find('#twist').remove();

      /* Удалить кнопку разрыва страницы */
      this.self.find('#gap').remove();
    }
  };




  /* Контроллер подсветки инструментов */
  Toolbar.p.indicator = function(){
    var root = this;

    this.self.find('li[data-move]').each(function(){
      var that = $(this),
      Move = root.getMove(that),
      obj = root.girth(Move.tag),
      active = false;

      if (that.is('.a')){
        /* Очистка активных иконок */
        that.classes({a: false});
      }

      if (!obj.length){
        return true;
      }


      switch (Move.spot){
        case 'self':
        active = true;
        break;
        case 'css':
        if (obj.css(Move.property) == Move.tone){
          active = true;
        }
        break;
        case 'grade':
        if (obj.is('.'+ Move.tone)){
          active = true;
        }
        break;
      }

      if (active){
        that.classes({a: true});
      }
    });


    /* Установить слайдер */
    //this.setRangePicture();
  };



  /* Контроллер исполнения команд */
  Toolbar.p.hand = function(that){
    var move = this.getMove(that),
    elem = this.girth(move.tag),
    p = {};


    switch (move.spot){
      case 'self':
      if (elem.length){
        E.sel.unwrap(elem);
      }
      else {
        if (E.sel.isCollapsed){
          E.notice.alarm('Необходимо выделить текст');
          break;
        }

        var elem = $.create(move.tag);
        E.sel.wrap(elem);
      }
      break;
      case 'css':
      var v = move.normal && elem.css(move.property) == move.tone ? move.normal : move.tone;
      p[move.property] = v;
      elem.css(p);
      break;
      case 'grade':
      p[move.tone] = null;
      elem.classes(p);
      break;
      case 'all':
      p[move.property] = move.tone;
      elem.find(move.ward).css(p);
      break;
    }


    /* Анализирутовать страницы документа */
    E.space.sequence();

    /* Подсветить выделенную область документа */
    E.sel.highlight();

    /* Поместить экземпляр документа в хранилище */
    E.storage.stamp();

    /* Подсветить актуальное состояние кнопок */
    this.indicator();
  };



  /* Получить фаблику */
  Toolbar.p.getMove = function(elem){
    var data = elem.data('move');
    return JSON.parse(data);
  };



  /* Поиск node по селектору */
  Toolbar.p.girth = function(selector){
    var node = E.sel.anchor();

    if (node.length){
      return node.is(selector) ? node : node.parent(selector);
    }

    return $(null);
  };



  /* Раскрытие селектов инструментов */
  Toolbar.p.opted = function(){
    var flap = $(this).parent('.flap');

    flap.classes({opted: null});
    E.sel.highlight();
  };



  /* Загрузчик */
  Toolbar.p.upload = function(form, cb){
    var iframe = $.create('iframe').attr({
      name: form.attr('target')
    });

    var loader = function(){
      if (typeof(cb) == 'function'){
        iframe
        .on('load', cb)
        .on('error', cb);
      }

      form.method('submit');
    };

    form.prev('iframe').remove();
    form.before(iframe);

    E.notice.spiner('Загрузка', loader);
  };




  /* -------------------------------------- Сохранение -------------------------------------- */
  /* Коллекция ключей страниц, которые необходимо скрыть */
  var blurPage = function(str){
    var arr = [];
    var interval = str.split(',');

    for(var i in interval){
      var value = interval[i];
      var pos = value.indexOf('-');

      if (pos > 0){
        var start = value.substr(0, pos);
        start = parseInt(start);

        var limit = value.substr(++pos);
        limit = parseInt(limit);

        for (start; start <= limit; ++start){
          arr.push(start);
        }
      } else {
        var num = parseInt(value);
        arr.push(num);
      }
    }

    return arr;
  };




  /* Данные поля: "скрывать страницы" */
  Toolbar.p.hidePage = function(){
    var input = this.self.find('#hide-page input');

    var val = input.prop('value');
    val = val.replace(/ /, '');

    return val;
  };




  /* Сбор и упаковка данных перед отправкой */
  Toolbar.p.packer = function(callback){
    E.notice.board('Подготовка документа');

    var outset = [];

    /* Коллекция страниц в html */
    var html = E.space.bookToHtml();

    /* Текст страниц */
    var text = E.space.bookToText();


    outset.push({
      pages: JSON.stringify(html),
      text: JSON.stringify(text)
    });


    if (E.conf.basic){
      callback(outset);
      return true;
    }



    /* Данные поля: "скрывать страницы" */
    var hide = this.hidePage();

    if (hide.length && /[^\d, -]/.test(hide)){
      E.notice.fail('Ошибка: Недопустимый символ в поле "Скрыть страницы"');
      return false;
    }

    outset.push({
      hide: hide
    });


    /* Коллекция ключей страниц, которые необходимо скрыть */
    var clues = blurPage(hide);


    /* Коллекция изображений страниц */
    E.space.bookToImage(clues, function(imageList){
      for (var i in imageList){
        outset.push({
          brief: JSON.stringify(imageList[i])
        });
      }

      callback(outset);
    });
  };




  /* Сохранение документа */
  Toolbar.p.save = function(){
    var root = this;


    /* Метод надежной отправки данных на сервер */
    var transport = function(data, callback){
      var counter = 0;

      var upload = function(data, callback){
        $.ajax({
          method: "POST",
          url: window.location.pathname,
          data: data
        },
        function(){
          if (++counter > 3){
            E.notice.fail('Ошибка сохранения документа. Попыток: '+ counter);
            return true;
          }

          setTimeout(upload(data, callback), 500);
        },
        callback
      );
    };

    upload(data, callback);
  };



  /* Отправка собранных даннных */
  this.packer(function(outset){
    var count = outset.length;

    var upload = function(i, callback){
      if (!(i in outset)){
        callback();
        return true;
      }

      var pct = parseInt((i + 1) * 100 / count);
      E.notice.board('Сохранение документа '+ pct +'%');

      transport(outset[i], function(ans){
        upload(++i, callback);
      });
    };

    upload(0, root.successfully);
  });
  };



  /* Успешное завершение работы редактора */
  Toolbar.p.successfully = function(){
    var url = window.location.href;

    E.notice.done('Документ успешно сохранен');
    window.open(url, '_top');
  };



  /* -------------------------------------- Документ MS Word в html -------------------------------------- */
  var filenameOfFakepath = function(that){
    var val = that.prop('value');
    var dep = val.split('\\');

    return  dep[dep.length - 1];
  };



  /* Конвертировать документ MS Word в html */
  Toolbar.p.loadDoc2html = function(that){
    var filename = filenameOfFakepath(that);
    var form = that.parent('form');

    var away = function(){
      E.notice.away();
    };

    var iterator = function(e){
      var url = window.location.pathname +'?let=doc2html';

      $.ajax({
        url: url,
        method: 'get'
      },
      function(ans){
        E.notice.fail('Ошибка: конвертор недоступен');
      },
      function(ans){
        if (!ans){
          E.notice.fail('Ошибка: возможно документ пустой');
          return false;
        }

        try {
          var data = JSON.parse(ans);
        } catch(e){
          E.notice.fail('Ошибка: документ поврежден');
          return false;
        }

        E.display(data.content, away);
      }
    );
  };

  this.upload(form, iterator);
  };




  /* -------------------------------------- История -------------------------------------- */

  /* Вернуть редактор в состояние на шаг назад */
  Toolbar.p.undo = function(){
    E.storage.undo();
  };



  /* Вернуть редактор в состояние на шаг вперед */
  Toolbar.p.redo = function(){
    E.storage.redo();
  };



  /* Смена изображения кнопки (активный | пассивный) */
  Toolbar.p.exchange = function(selector, status){
    var that = this.self.find(selector +' img');
    var src = that.attr('src');
    var active = /\.a\./.test(src);

    if (status && !active){
      src = src.replace(/(\.\w+$)/, '.a$1');
      that.attr({src: src});
    }
    else if (!status && active){
      src = src.replace(/(a\.)/, '');
      that.attr({src: src});
    }
  };




  /* -------------------------------------- Выравнивание -------------------------------------- */

  /* Установка / снятие многоточия */
  Toolbar.p.feather = function(){
    var p = this.girth('p');
    E.ledge.feather(p);
  };




  /* -------------------------------------- Изображения -------------------------------------- */

  /* Загрузить изображение */
  Toolbar.p.loadPicture = function(that){
    var root = this,
    form = that.parent('form'),
    now = new Date(),
    key = now.getTime(),

    loader = function(src){
      root.insertImage(src);
      E.notice.away();
    };

    form.attr({
      action: window.location.pathname +'?cb=upload'+ key
    });

    window['upload'+ key] = loader;
    this.upload(form);
  };



  /* Добавить изображение */
  Toolbar.p.insertImage = function(src){
    var img = $.create('img').attr({src: src});

    img
    .on('error', function(){
      E.notice.fail('Ошибка: изображение не загружено');
      img.remove();
    })
    .on('load', function(){
      E.picture(img).captionAuto().alt();

      /* Установить курсор в начало объекта */
      E.caret(img, 0, 0);
    });

    /* Вставить изображение в курсор */
    E.sel.insert(img);

    /* Поместить экземпляр документа в хранилище */
    E.storage.stamp();
  };



  /* Контроллер по работе с изображениями */
  Toolbar.p.draw = function(that){
    var action = that.data('draw');
    var p = this.girth('p');
    var img = p.find('img');

    if (!img.length){
      E.notice.fail('Изображение не найдено');
      return;
    }

    switch (action){
      case 'above':
      /* Подпись над изображением */
      E.picture(img).captionAbove(true).alt();
      break;
      case 'below':
      /* Подпись над изображением */
      E.picture(img).captionBelow(true).alt();
      break;
      case 'exp':
      /* Не определять подпись к изображению */
      E.picture(img).captionExp(true).alt();
      break;
      case 'unset':
      /* Не определять окружение изображения */
      E.picture(img).figureExp(true).alt();
      break;
    }

    /* Подсветить выделенную область документа */
    E.sel.highlight();

    /* Поместить экземпляр документа в хранилище */
    E.storage.stamp();
  };



  /* -------------------------------------- Шаблоны -------------------------------------- */

  /* Вставка спецсимвола */
  Toolbar.p.insertSpecialSimbol = function(){
    var html = $(this).html();
    var simbol = $.create('span').html(html);

    E.sel.insert(simbol);
  };



  /* Добавиьт абзац */
  Toolbar.p.indent = function(that){
    var action = that.data('indent');
    var p = this.girth('p');

    E.space.indent(p, action);
  };



  /* Очистить документ */
  Toolbar.p.dryPage = function(){
    var msg = $(this).attr('title') +'?';

    if (confirm(msg)){
      E.space.dry();
    }
  };



  /* Табличный стиль + установка / снятие многоточия */
  Toolbar.p.ledgeStyle = function(){
    var p = this.girth('p');

    E.space.ledgeStyle(p);
  };



  /* -------------------------------------- Таблицы -------------------------------------- */

  /* Контроллер по работе с таблицей */
  Toolbar.p.map = function(that){
    var action = that.data('map');
    var p = this.girth('p');

    switch (action){
      case 'sever':
      /* Разбить таблицы */
      E.table(p).severTable(true);
      break;
      case 'unite':
      /* Объеденить таблицы */
      E.table(p).uniteTable(true);
      break;
      case 'cnap':
      /* Удалить столбец из таблицы */
      E.table(p).unsetCol(true, function(elem){
        E.caret(elem, 0, 0);
      });

      break;
      case 'strike':
      /* Удалить строку из таблицы */
      E.table(p).unsetRow(true, function(elem){
        E.caret(elem, 0, 0);
      });
      break;
      case 'height':
      /* Очистить высоту ячеек таблицы */
      E.table(p).cleanStyle('height', true);
      break;
      case 'width':
      /* Очистить ширину ячеек таблицы */
      E.table(p).cleanStyle('width', true);
      break;
    }

    /* Подсветить выделенную область документа */
    E.sel.highlight();

    /* Поместить экземпляр документа в хранилище */
    E.storage.stamp();
  };



  E.toolbar = new Toolbar();
})();
