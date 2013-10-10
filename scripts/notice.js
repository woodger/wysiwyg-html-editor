(function(){
  'use strict';

  /* Модель уведомлений */
  var Notice = function(){
    var root = this;

    this.self = $('#monitor');



    var hang = function(){
      var top = root.self.prev().height();
      top = parseInt(top) + 20;

      root.self.css({top: top +'px'});
    };

    hang();


    /* Позиционирование окна уведомлений */
    $.w.on('resize', $.debounce(500, hang));

    /* Деактивация уведомлений */
    $.d.by('click', '.page', $.debounce(500, function(){
      root.away();
    }));

    return this;
  };



  E.notice = new Notice();



  Notice.p = Notice.prototype;



  /* Деактивация уведомления */
  Notice.p.away = function(){
    this.self.attr({class: false}).html("");
    return this;
  };



  /* Вывод уведомления */
  Notice.p.light = function(prop, txt){
    var span = $.create('span').text(txt);

    this
    .away()
    .self.classes(prop).append(span);

    return this;
  };



  /* Выполнение (крутилка) */
  Notice.p.spiner = function(txt, fn){
    var img = $.create('img')
    .attr({src: '/im/editor/spiner.png'})
    .classes({spiner: true})
    .on('load', fn);

    this
    .light({wait: true}, txt)
    .self.prepend(img);

    return this;
  };



  /* Стандартное уведомление */
  Notice.p.board = function(txt){
    return this.light({flowing: true}, txt);
  };



  /* Информационное уведомление */
  Notice.p.info = function(txt){
    return this.light({informing: true}, txt);
  };



  /* Предепреждение */
  Notice.p.alarm = function(txt){
    return this.light({alarm: true}, txt);
  };



  /* Уведомление об успехе */
  Notice.p.done = function(txt){
    return this.light({success: true}, txt);
  };



  /* Уведомление об ошибке */
  Notice.p.fail = function(txt){
    return this.light({error: true}, txt);
  };
})();
