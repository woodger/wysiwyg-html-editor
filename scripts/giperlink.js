(function(){
  'use strict';

  window.E.giperlink = {

    /* Палитра для изменения аттрибутов ссылки */
    palette: function(a){
      var overlap = $.create('div').attr({id: 'overlap'});
      var ground = $.create('div').attr({id: 'ground'});

      /* Поле ввода ссылки */
      var input = $.create('input')
      .attr({type: 'text'})
      .prop({value: a.attr('href')});


      /* Чекбокс: Открывать на новой вкладке */
      var target = $.create('input')
      .attr({
        type: 'checkbox',
        name: 'target'
      })
      .prop({
        checked: (a.attr('target') == '_blank'),
        value: '_blank'
      });
      var targetLabel = $.create('label').text('Открывать на новой вкладке');


      /* Чекбокс: Не передавать вес страницы */
      var rel = $.create('input')
      .attr({
        type: 'checkbox',
        name: 'rel'
      })
      .prop({
        checked: (a.attr('rel') == 'nofollow'),
        value: 'nofollow'
      });
      var relLabel = $.create('label').text('Не передавать вес страницы');



      /* Приклеит консоль к элементу */
      var sticking = function(){
        var offset = a.position();
        var height = ground.height();

        ground.css({
          left: offset.left +'px',
          top: (offset.top - height - 5) +'px'
        });
      };


      /* Изменение аттрибутов */
      var changeAttr = function(){
        var that = $(this);
        var prop = {};

        if (that.is('[type="checkbox"]')){
          var checked = that.prop('checked');
          var name = that.attr('name');

          prop[name] = checked ? that.prop('value') : false;
        }
        else {
          prop.href = that.prop('value');
        }

        a.attr(prop);
      };


      /* Удалить палитру для изменения аттрибутов ссылки */
      var letgo = function(){
        overlap.remove();

        $.d.off('scroll', sticking);
        $.w.off('resize', sticking);
      };


      ground
      .append(input)
      .append(target)
      .append(targetLabel)
      .append(rel)
      .append(relLabel);

      overlap.append(ground);



      ground.find('input').on('change', changeAttr);

      overlap.on('click', function(e){
        if (e.target == this){
          letgo();
        }
      });

      $('body').append(overlap);
      $.d.on('scroll', sticking);
      $.w.on('resize', sticking);

      sticking();
    }
  };
})();
