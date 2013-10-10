(function(){
  'use strict';

  var conf = {

    /* Коллекция подключаемых скриптов-компонентов редактора */
    requirs: [
      /* Libs */
      'libs/selection-1.0.8.js',
      'libs/html2canvas/0.4.1.js',

      /* Components */
      'editor/script/storage.js',
      'editor/script/ledge.js',
      'editor/script/picture.js',
      'editor/script/table.js',
      'editor/script/giperlink.js',

      /* Models */
      'editor/script/notice.js',
      'editor/script/space.js',
      'editor/script/toolbar.js'
    ],

    /* Простой режим работы редактора */
    basic: false
  };



  $.inArray = function(val, arr){
    for (var i in arr){
      if (arr[i] == val){
        return true;
      }
    }
    return false;
  };



  var Editor = function(conf){
    this.conf = conf;

    var root = this;
    var options = window.options.editor;
    var i = 0;


    if (window.options.editor){

      /* Запуск редактора в базовом режиме */
      this.conf.basic = (options.mode == 'basic');
    }


    var preloader = function(){
      var src = root.conf.requirs[i];

      if (src){
        i++;
        var script = $.create('script')
        .attr({src: src})
        .on('load', preloader);

        $('head').append(script);
      }
      else {
        root.instance();
      }
    };

    preloader();

    return this;
  };



  Editor.p = Editor.prototype;




  /* Начало работы редактора */
  Editor.p.instance = function(){
    var root = this;

    /* Объект выделенной области */
    this.sel = $.selection();

    /* Установить курсор в начало документа */
    this.begining();

    /* Каретка */
    this.space.self
    .by('click', '.page', root.stamp.bind(root))
    .by('keyup', '.page', root.stamp.bind(root));


    /* Объект выделенной области */
    this.sel = $.selection();
    this.toolbar.indicator();

    /* Поместить документ в хранилище */
    this.storage.stamp();
  };



  /* Работа с выделенной областью */
  Editor.p.stamp = function(){

    /* Объект выделенной области */
    this.sel = $.selection();
    this.toolbar.indicator();
  };



  /* Поставить курсор на первый абзац */
  Editor.p.begining = function(){
    var resort = this.space.self.find('.page:first-child');
    this.sel.range(resort, 0, 0);
  };



  /* Поставить курсор на элемент */
  Editor.p.caret = function(elem, start, end){
    if (elem.length){

      /* Поставить курсор элемнент */
      this.sel.range(elem, start, end);
    } else {

      /* Поставить курсор на первый абзац первой страницы */
      this.begining();
    }
  };



  /* Вывод нового html документа */
  Editor.p.display = function(html, fn){
    this.storage.truncate();
    this.space.display(html, fn);
    this.begining();
  };



  window.E = new Editor(conf);
})();
