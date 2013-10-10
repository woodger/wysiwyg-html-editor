(function(){
  'use strict';
  
  
  var Storage = function(){
    
    /* Масимальное значение хранимых состояний */
    this.maxlength = 50;
    
    /* Текущий индекс */
    this.currentItem = 0;
    
    /* Коллекция состонияний */
    this.queue = [];
    
    return this;
  };
  
  
  
  
  Storage.p = Storage.prototype;
  
  
  
  
  /* Очистка памяти */
  Storage.p.truncate = function(){
    this.queue = [];
    this.currentItem = 0;
    
    this.projector();
  };
  
  
  
  
  /* Запомнит состояние рабочей области */
  Storage.p.stamp = function(){
    var obj = {
      html: E.space.self.html()
    };
    
    var count =  this.queue.length;
    
    /* ~ (не -1) */
    if (count && ~this.currentItem){
      var last = this.queue[this.currentItem];
      
      if (last.html == obj.html){
        return;
      }
    }
    
    
    if (count > this.maxlength){
      this.queue.shift();
    }
    
    this.queue.push(obj);
    
    this.currentItem = this.queue.length - 1;
    
    this.projector();
    
    return this;
  };
  
  
  
  
  /* Спроецирует состояние рабочей области */
  Storage.p.projector = function(){
    var count = this.queue.length,
    index = this.currentItem;
    
    E.toolbar.exchange('#story-undo', (count > 1 && ~index));
    E.toolbar.exchange('#story-redo', (count > 1 && index + 1 < count));
  };
  
  
  
  
  /* Вернуть редактор в состояние на шаг назад */
  Storage.p.undo = function(){
    var length = this.queue.length;
    
    if (length && ~this.currentItem){
      
      var ins = this.queue[this.currentItem];
      
      /* Html рабочей области */
      E.space.insert(ins.html);
      
      this.currentItem--;
      this.projector();
    }
  };
  
  
  
  
  /* Вернуть редактор в состояние на шаг вперед */
  Storage.p.redo = function(){
    var length = this.queue.length;
    
    if (length && this.currentItem + 1 < length){
      this.currentItem++;
      
      var ins = this.queue[this.currentItem];
      
      /* Html рабочей области */
      E.space.insert(ins.html);
      
      this.projector();
    }
  };
  
  
  
  E.storage = new Storage();
})();
