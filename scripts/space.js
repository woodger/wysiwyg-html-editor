(function(){
  'use strict';



  /* Модель рабочей области */
  var Space = function(){
    this.self = $('#space');

    /* Свободный стек вызовов слушателей  */
    this.follow = true;

    /* Валидация элементов */
    this.spread();

    /* Валидация атрибутов */
    this.cleanSoul();

    /* Разрешить редактирование */
    this.editable(true);

    /* Активация подписчиков работы с элементами документа */
    this.listiners();

    /* Настройка */
    this.settings();

    return this;
  };


  Space.p = Space.prototype;




  /* Настройка */
  Space.p.settings = function(){
    if (E.conf.basic){
      this.book().classes({quaere: true});
    }
    else {

      /* Активация подписчиков на изменение структуры документа */
      this.sub();
    }
  };





  /* Получение высоты елемента через css свойство */
  var getClientHeight = function(elem){
    var height = 0;

    if (elem && elem.style){
      var styles = window.getComputedStyle(elem);
      height = parseInt(styles.height);
    }

    return height;
  };




  /* Стек действий над документом */
  Space.p.sequence = function(){
    if (this.follow){
      this.follow = false;

      if (!E.conf.basic){

        /* Запустить анализатор страниц */
        this.parsing();
      }

      this.follow = true;
    }
  };



  /* Подписчики на изменение структуры документа */
  Space.p.sub = function(){
    var iterator = $.debounce(300, this.sequence.bind(this));

    $.d
    .by('DOMNodeInserted', '#space', iterator)
    .by('DOMNodeRemoved', '#space', iterator)
    .by('DOMAttrModified', '#space', iterator)
    .by('DOMCharacterDataModified', '#space', iterator);
    return this;
  };




  /* Подписчики работы с элементами документа */
  Space.p.listiners = function(){

    /* Изменение размера изображения */
    this.self.by('mousedown', 'img', function(e){
      E.picture($(this)).resize(e);
    });


    /* Вызов меню для изменения аттрибутов ссылки */
    this.self.by('contextmenu', 'a', function(){
      var that = $(this);

      that.prop({
        oncontextmenu: function(){
          return false;
        }
      });

      E.giperlink.palette(that);
    });
  };




  /* Валидация элементов */
  Space.p.cleanSoul = function(){
    var nodeStyle = {
      p: [
        'text-transform:(uppercase|lowercase|none)',
        'text-align:(left|center|right)'
      ],
      td: [
        'vertical-align:',
        'border.*:',
        'height:',
        'width:'
      ],
      table: [
        'border.*:'
      ],
    };

    var expProp = {};

    for (var i in nodeStyle){
      expProp[i] = new RegExp("^("+ nodeStyle[i].join('|') +")");
    }

    this.self.find('[style]').each(function(){
      var that = $(this);
      var attr = that.attr('style');
      attr = attr.replace(/: */, ':');
      attr = attr.replace(/ +|;$/g, '');
      attr = attr.replace(/(\d+)\.\d*px/g, '$1px');

      var prop = attr.split(';');
      var style = [];

      var validate = function(tagName){
        for (var i in prop){
          var str = prop[i];
          if (expProp[tagName].test(str)){
            style.push(str +';');
          }
        }
      };

      for (var i in nodeStyle){
        if (that.is(i)) validate(i);
      }

      if (style.length){
        attr = style.join(' ');

        that.attr({
          style: style
        });
      } else {
        that.attr({
          style: false
        });
      }
    });


    var singe = ['page', 'album', 'overflou', 'volume', 'gap', 'ledge', 'tally'];

    this.self.find('[class]').each(function(){
      var that = $(this);
      var list = that.classes();
      var real = {};

      for (var i = 0; i < list.length; ++i){
        var name = list[i];
        real[name] = $.inArray(name, singe);
      }

      that.classes(real);
    });

    this.self.find('[data-http]').attr({
      'data-http': false
    });

    return this;
  };



  /* Валидация элементов */
  Space.p.spread = function(){
    var root = this;
    var pages = this.self.childs();


    // Чистый лист
    if (!pages.length){
      var blank = root.blank();
      this.self.append(blank);
    }


    pages.each(function(){
      var page = $(this);

      /* Удалить символы переноса строки между абзацами */
      page.childNodes().filter({nodeName: '#text'}).each(function(){
        var that = $(this);
        var txt = that.text();

        // \xNN NN - шестнадцатеричный код ASCII-символа (\x20 - пробел, \x4A - J, \x6A - j и т. д.)
        if (/\x0a|\x20/.test(txt)){
          that.remove();
        }
      });

      /* Обернуть висящие стрки в абзац */
      page.childs().filter('span, br, b, i').each(function(){
        var that = $(this),
        p = $.create('p');

        that.before(p);
        p.prepend(that);
      });


      /* Развернуть содержимое блоков */
      page.find('div').each(function(){
        root.expand($(this));
      });


      /* Удаление аттрибута style */
      page.find('span[style], b[style], i[style], a[style]').attr({
        style: false
      });


      /* Поиск ссылок, начинающихся с # или пустые */
      page.find('a').each(function(){
        var that = $(this);
        var href = that.attr('href');

        if (!href || /^#/.test(href)){
          root.expand(that);
        }
      });


      /* Работа с таблицами */
      page.find('table').each(function(){
        var table = $(this);

        /* Удаление текстовых нод между тегами */
        table.childNodes().filter({nodeName: '#text'}).remove();


        /* Удаление лишних аттрибутов из таблицы */
        table.attr({
          width: false,
          height: false,
          style: false
        });


        /* Работа с элементами таблицы */
        table.find('thead, tbody, tfoot, tr, caption, colgroup, col').each(function(){
          $(this).childNodes().filter({nodeName: '#text'}).remove();
        });


        /* Работа со строками таблицы */
        table.find('tr').each(function(){
          var tr = $(this);
          var height = tr.height();

          if (!height || height < 5){
            tr.remove();
          }
        });


        /* Удаление аттрибута width из ячеек таблицы */
        table.find('td[width]').attr({width: false});
      });


      /* Преобразование пустых абзацев */
      page.find('p:empty').each(function(){
        root.paragraph($(this));
      });
    });
  };




  /*
  * Превести к параграфу
  */
  Space.p.paragraph = function(elem){
    var br = $.create('br');
    var span = $.create('span');

    span.append(br);
    elem.append(span);
  }



  /*
  * Определить возможнсть редактирования,
  * Поставить - убрать overflow-x обертку таблиц для мобильных устройств
  */
  Space.p.editable = function(action){
    var root = this;

    /* Поставить - убрать overflow-x обертку таблиц для мобильных устройств */
    this.self.find('table').each(function(){
      var that = $(this);
      var overflou = that.parent('.overflou');

      if (!action && !overflou.length){
        overflou = $.create('div').classes({
          overflou: true
        });

        that.before(overflou);
        overflou.prepend(that);
      }
      else
      if (action && overflou.length){
        root.expand(overflou);
      }
    });


    /* Определить возможнсть редактирования */
    this.book().attr({
      contenteditable: action
    });
  };




  /* Избавиться от объекта, как от обертки */
  Space.p.expand = function(that){
    var childs = that.childNodes();

    that.before(childs);
    that.remove();
  };



  /* Отправить документ на постраничный разбор */
  Space.p.buggy = function(){
    var root = this;
    var page = E.toolbar.girth('.page');

    E.notice.spiner(function(){
      root.swish(page, E.notice.awa);
    });
  };



  /* Создаст и вернет новую страницу */
  Space.p.blank = function(){
    return $.create('div').attr({
      class: 'page',
      contenteditable: true
    });
  };



  /* Коллекция страниц рабочей области */
  Space.p.book = function(){
    return this.self.find('.page');
  };



  /* Контроллер загрузки всех ресурсов документа */
  Space.p.forwarder = function(load, listener){
    var promiseList = [];

    this.self.find('img').each(function(){
      var img = $(this);

      var iterable = function(resolve, reject){
        img
        .on('load', function(){
          if (typeof(load) == 'function'){
            load(img);
          }
          resolve();
        })
        .on('error', function(){
          img.remove();
          resolve();
        });
      };

      promiseList.push(new Promise(iterable));
    });

    Promise.all(promiseList).then(listener);
  };





  /* Вывод экземпляра html докомента */
  Space.p.insert = function(html){
    var root = this;

    this.follow = false;

    this.self.html(html);

    this.forwarder(null, function(){
      root.follow = true;
    });
  };




  /* Вывод нового докомента */
  Space.p.display = function(html, cb){
    this.follow = false;

    var root = this;
    var page = this.blank().html(html);

    /* Чистый лист */
    var dry = function(){
      return root.blank().prop();
    };



    /* Постраничный разбор */
    var beatOnPage = function(){
      var book = root.self.prop(),
      page = book.firstChild,
      pageHeight = getClientHeight(page),
      sumHeight = 0,
      blank = dry(),
      elem;


      while ((elem = page.firstChild)){
        if (elem.clientHeight){
          sumHeight += elem.clientHeight;
        }

        blank.appendChild(elem);

        if (sumHeight >= pageHeight){
          book.appendChild(blank);

          /* Чистый лист */
          blank = dry();

          /* Обнулить высоту */
          sumHeight = 0;
        }
      }

      book.appendChild(blank);
    };



    /* Примение аттрибутов сжатия ко всем изображениям */
    var squeeze = function(img){
      E.picture(img).squeeze(0.75).captionAuto().alt();
    };



    /* Стек последовательности действий, после загрузки всех ресурсов документа */
    var expectant = function(){

      /* Разбить на страницы */
      beatOnPage();

      /* Искать многоточия у первых 6 страниц */
      root.ledgeKeep(6);

      /* Постраничный разбор */
      root.parsing();

      /* Поместить экземпляр документа в хранилище */
      E.storage.stamp();

      /* Свободный стек вызовов слушателей */
      root.follow = true;

      cb();
    };


    this.self.html(null).append(page);

    /* Валидация атрибутов */
    this.cleanSoul();

    /* Валидация элементов */
    this.spread();

    /* Контроллер:
    * - ожидание загрузки всех ресурсов документа;
    * - примение аттрибутов ко всем изображениям
    */
    this.forwarder(squeeze, expectant);
  };




  /* Анализ страницы */
  Space.p.parsing = (function(){
    var book = document.getElementById('space');


    /* Переместить элементы на следующую страницу */
    var separator = function(page, elem){
      if (elem){
        var next = page.nextElementSibling,
        last = null;

        if (!next){
          next = page.cloneNode(false);
          book.appendChild(next);
        }

        while ((last = page.lastChild)){
          if (last == elem){
            break;
          }

          next.insertBefore(last, next.firstChild);
        }
      }
    };



    /* Переместить элементы со следующей страницы */
    var combiner = function(page, pageHeight, sumHeight){
      var next = page,
      first = null,
      height = 0;

      through: while ((next = next.nextSibling)){
        while ((first = next.firstChild)){
          height = first.clientHeight;

          if (height){
            sumHeight += height;
          }

          if (sumHeight > pageHeight){
            break through;
          }

          page.appendChild(first);
        }
      }
    };




    /* Контроллер страниц */
    var swish = function(){
      var page = book.firstChild,
      pageHeight = 0,
      elem = null,
      sumHeight = 0,
      band = false;


      while (page){
        elem = page.firstChild;
        pageHeight = getClientHeight(page);
        sumHeight = 0;
        band = false;


        while (elem){
          if (elem.clientHeight){
            sumHeight += elem.clientHeight;
          }

          if (elem.matches && elem.matches('.gap')){
            separator(page, elem);
            band = true;
            break;
          }

          if (sumHeight > pageHeight){
            elem = elem.previousSibling || elem;
            separator(page, elem);
            break;
          }

          elem = elem.nextSibling;
        }

        if (sumHeight < pageHeight && !band){
          combiner(page, pageHeight, sumHeight);
        }

        page = page.nextSibling;
      }


      /* Последняя страница */
      page = book.lastChild;

      /* Удалить пустую страницу */
      if (page && !page.firstChild && page != book.firstChild){
        page.remove();
      }
    };

    return swish;
  })();




  /* Искать многоточия у первых 6 страниц */
  Space.p.ledgeKeep = function(num){
    var leaf = num - 1;
    var pages = this.self.find('.page:nth-child(-n+'+ leaf +')');


    pages.each(function(){
      var page = $(this);

      E.ledge.keep(page);
    });
  };





  /* -------------------------------------- Действия с отдельными объектами -------------------------------------- */

  /* Добавить абзац */
  Space.p.indent = function(p, action){
    var elem = p.parent('table');

    if (!elem.length){
      elem = p.parent('figure');
    }

    if (!elem.length){
      E.notice.fail('Ошибка: изображение или таблица на найдены');
      return false;
    }

    p = $.create('p');
    this.paragraph(p);

    switch(action){
      case 'above':

      /* Абзац выше */
      elem.before(p);
      break;
      case 'below':

      /* Абзац ниже */
      elem.after(p);
      break;
    }
  };



  /* Очистить документ */
  Space.p.dry = function(){
    var blank = this.blank();

    this.self
    .html(null)
    .append(blank);
  };



  /* Табличный стиль + установка / снятие многоточия */
  Space.p.ledgeStyle = function(p){
    var page = p.parent('.page');

    if (page.length){
      E.ledge.keep(page);
    }
  };




  /* -------------------------------------- Сохранение документа -------------------------------------- */
  /* Преобразует страницы документа в коллекцию html текста */
  Space.p.bookToHtml = function(){
    var pages = [];

    ////////////////////////////////////////////////////////////| (возможно в этом и есть проблема валидации собственных ссылок)
    var exp = new RegExp(window.location.origin, 'g');

    var filter = function(str){
      str = str.replace(/shy;/g, '');
      str = str.replace(/\s{2,}/g, ' ');
      str = str.replace(exp, ''); // <|
      str = str.trim();

      return str;
    };

    /* Очистить стили элементов */
    this.cleanSoul();

    /* Отменить редактирование документа */
    this.editable(false);


    this.book().each(function(i){
      var page = $(this);
      var html = page.html();

      pages.push({
        index: i,
        item: (i + 2),
        album: page.is('.album'),
        html: filter(html)
      });
    });

    /* Вернуть редактирование документа */
    this.editable(true);

    return pages;
  };




  /* Преобразует страницы документа в текст */
  Space.p.bookToText = function(){
    var text = this.self.text();

    var filter = function(str){
      str = str.replace(/[\t\n\r]/g, '');
      str = str.replace(/\s{2,}/g, ' ');
      str = str.trim();
      str = str.toLowerCase();

      return str;
    };

    text = filter(text);

    return text;
  };




  /* Преобразования коллекции страниц в изображения */
  Space.p.bookToImage = function(clues, callback){
    var root = this;
    var count = clues.length;

    if (!count){
      callback();
      return null;
    }

    /* Отменить редактирование документа */
    this.editable(false);

    var clone = this.book().clone(true);
    var imageList = [];


    /* Вернуть документ на место */
    var replace = function(){

      /* Очистить рабочуую область */
      root.self.html(null);

      clone.each(function(){
        root.self.append(this);
      });

      /* Активировать редактирование документа */
      root.editable(true);

      callback(imageList);

      return true;
    };



    var htmlToImage = function(i){
      var item = clues[i];

      if (isNaN(item)){
        return replace();
      }
      else {
        var page = clone.item(item - 2);
        var pct = parseInt((i + 1) * 100 / count);

        if (!page.length){
          return replace();
        }

        E.notice.board('Сбор данных '+ pct +'%');


        /* Клонировать экземпляр страницы в нативный объект */
        var inst = page.clone(true)
        .classes({rely: true})
        .prop();

        /* Разместить экземпляр страницы */
        root.self.html(null).append(inst);


        /* Преобразование страницы документа в изображение */
        html2canvas(inst, {onrendered: function(canvas){
          var dataURL = canvas.toDataURL();

          /* Уменьшение размеров изображения */
          root.craftsman(dataURL, 0.37, function(canvas){
            var dataURL = canvas.toDataURL();

            imageList.push({
              index: i,
              item: item,
              dataurl: dataURL
            });

            htmlToImage(++i);
          });
        }});
      }
    };

    htmlToImage(0);
  };



  /* Уменьшение изображения */
  Space.p.craftsman = function (dataURL, factor, callback){
    var canvas = $.create('canvas');

    var img = $.create('img').attr({
      src: dataURL
    });

    img.on('load', function(){
      var width = this.width * factor;
      width = parseInt(width);

      var height = this.height * factor;
      height = parseInt(height);

      canvas.attr({
        width: width,
        height: height
      });

      canvas = canvas.prop();

      canvas.getContext('2d').drawImage(this, 0, 0, width, height);
      callback(canvas);
    });
  };


  E.space = new Space();
})();
