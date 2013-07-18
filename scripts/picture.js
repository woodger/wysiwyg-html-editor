(function(){
  'use strict';


  var Picture = function(img){
    this.img = img;

    return this;
  };



  E.picture = function(img){
    return new Picture(img);
  };



  Picture.p = Picture.prototype;



  /* Получить блок - обертку изображения */
  Picture.p.loop = function(msn){
    var p = this.img.parent('p');

    if (!p.length && msn){
      E.notice.fail('Изображение находится за пределами блока');
    }

    return p;
  };



  /* Получить окружение изображения */
  Picture.p.figure = function(msn){
    var figure = this.img.parent('figure');

    if (!figure.length && msn){
      E.notice.fail('Не удается найти окружение изображения');
    }

    return figure;
  };



  /* Умньшение размера изображения на определенный коэфициент */
  Picture.p.squeeze = function(factor){
    var width = this.img.attr('width');
    var height = this.img.attr('height');

    this.img.attr({
      width: parseInt(width * factor),
      height: parseInt(height * factor)
    });

    return this;
  };



  /* Определить подпись к рисуну после изображения в автоматическом режиме */
  Picture.p.captionAuto = function(){
    var figure = this.figure();

    if (figure.length){
      return this;
    }

    if (this.img.width() < 100){
      return this;
    }
    else {
      figure = $.create('figure');
      var p = this.img.parent('p');

      if (!p.length){
        return this;
      }

      p.before(figure);
      figure.prepend(p);
    }

    var next = figure.next();

    if (!next.length || next.is('table, figure')){
      return this;
    }

    var text = next.text();

    if (text.length > 5 && text.length < 128){
      var figcaption = $.create('figcaption');

      figcaption.append(next);
      figure.append(figcaption);
    }

    return this;
  };



  /* Определить подпись к рисуну до изображения */
  Picture.p.captionAbove = function(msn){
    var p = this.loop(msn);

    if (!p.length){
      return this;
    }

    var figure = this.figure();

    if (!figure.length){
      figure = $.create('figure');

      p.before(figure);
      figure.prepend(p);
    }

    /* Развернуть подпись к рисунку */
    this.captionExp(msn);

    var figcaption = $.create('figcaption');


    figure.prevNode(true).each(function(){
      var that = $(this);

      if (that.is('table, figure')){
        return false;
      }

      var text = that.text();

      figcaption.prepend(that);

      if (text.length > 5){
        return false;
      }
    });

    if (figcaption.childNodes().length){
      figure.prepend(figcaption);
    }
    else {
      if (msn){
        E.notice.fail('Невозможно определить пустую подпись к изображению');
      }
      figcaption.remove();
    }

    return this;
  };



  /* Определить подпись к рисуну после изображения */
  Picture.p.captionBelow = function(msn){
    var p = this.loop(msn);

    if (!p.length){
      return this;
    }

    var figure = this.figure();

    if (!figure.length){
      figure = $.create('figure');

      p.before(figure);
      figure.prepend(p);
    }

    /* Развернуть подпись к рисунку */
    this.captionExp(msn);

    var figcaption = $.create('figcaption');


    figure.nextNode(true).each(function(){
      var that = $(this);

      if (that.is('table, figure')){
        return false;
      }

      var text = that.text();

      figcaption.append(that);

      if (text.length > 5){
        return false;
      }
    });

    if (figcaption.childNodes().length){
      figure.append(figcaption);
    }
    else {
      if (msn){
        E.notice.fail('Невозможно определить пустую подпись к изображению');
      }
      figcaption.remove();
    }

    return this;
  };



  /* Не определять окружение рисунка */
  Picture.p.figureExp = function(msn){
    var figure = this.figure();

    if (!this.figure){
      if (msn){
        E.notice.fail('Не удается найти окружение изображения');
      }
      return this;
    }

    /* Развернуть подпись к рисунку */
    this.captionExp();

    var nodes = figure.childNodes();

    figure.before(nodes);
    figure.remove();

    return this;
  };



  /* Развернуть подпись к рисунку */
  Picture.p.captionExp = function(msn){
    var figure = this.figure(msn);

    if (!figure.length){
      return this;
    }

    var first = figure.first();
    var last = figure.last();


    if (first.is('figcaption')){
      var nodes = first.childNodes();

      figure.before(nodes);
      first.remove();
    }
    else if (last.is('figcaption')){
      var nodes = last.childNodes();

      nodes.each(function(){
        figure.after($(this));
      });

      last.remove();
    }

    return this;
  };



  /* Установить аттрибут alt к рисунку */
  Picture.p.alt = function(msn){
    var figure = this.figure(msn);
    var alt = '';

    if (figure.length){
      var str = figure.text();
      str = str.replace(/рис(унок)*\.* *\d*\.*\d*\.* *[-–]* */i, '');

      /* Убрать неразрывный пробел */
      str = str.replace(/\xA0/g, '');

      /*
      for (var i in str){
      var code = str.charCodeAt(i);

      if (code && code > 100 && code < 1000){
      debugger;
    }
  }
  */

  var words = str.split(' ');

  if (words){
    var ten = [];

    for (var i = 0; i < words.length; ++i){
      str = words[i];

      if (i > 15){
        break;
      }

      str = str.replace(/[\\/\:\*\?\"\<\>\|]/g, '');
      ten.push(str);
    }

    if (ten){
      str = ten.join(' ');

      if (str.length > 5){
        alt = str.toString();
      }
    }
  }
  }

  if (this.img){
    if (!alt){
      var pic = this.img.prop(),
      num = 1;

      $('#space img').each(function(index){
        if (this == pic){
          num = index + 1;
          return false;
        }
      });

      alt = this.img.width() < 100 ? 'Формула' : 'Изображение';
      alt += ' '+ num;
    }

    this.img.attr({alt: alt});
  }

  return this;
  };



  /* Изменение размера изображения */
  Picture.p.resize = function(e){
    var img = this.img,
    naturalWidth = img.prop('naturalWidth'),
    naturalHeight = img.prop('naturalHeight'),

    factor = naturalHeight / naturalWidth,
    parentWidth = img.parent('p').width(),

    imgWidth = img.width(),
    shiftX = e.pageX,

    overlap = $.create('div').attr({id: 'overlap'}),
    dash = $.create('p').classes({dash: true});

    // Запретить drag and drop
    img.prop({
      ondragstart: function(){
        return false;
      }
    });

    /* Движение мыши с зажатой кнопкой */
    var move = function(e){

      /* Смещения мыши по оси X */
      var biasX = imgWidth - parseInt(shiftX - e.pageX);
      var offset = img.position();
      var pct = parseInt(biasX * 100 / naturalWidth);

      if (naturalWidth >= biasX && parentWidth >= biasX && biasX > 20){
        img.attr({
          width: biasX,
          height: parseInt(biasX * factor)
        });

        dash
        .css({
          left: parseInt(offset.left) +'px',
          top: parseInt(offset.top) +'px'
        })
        .text(pct +'%');
      }
    };


    /* Зачистка подписчиков */
    var letgo = function(){
      overlap
      .off('mousemove', move)
      .off('mouseup', letgo)
      .remove();
    };

    move(e);
    overlap.append(dash);

    overlap.on('mousemove', move);
    overlap.on('mouseup', letgo);

    $('body').append(overlap);
  };
})();
