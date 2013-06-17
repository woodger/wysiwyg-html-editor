/*!
* JavaScript Library v1.9.2
* Released under the MIT license
* Автор Станислав Вуджер
*/

(function(){
  'use strict';

  var win = window,
  doc = document,
  und = void 0,


  /*
  * __Constrictor
  */
  Wish = function(obj){
    if (obj){
      if (typeof obj == 'object'){
        this.nodeList = obj instanceof Array ? obj : [obj];
      }
      else {
        obj = doc.querySelectorAll(obj);
        this.nodeList = $.inside(obj);
      }
    }
    else {
      this.nodeList = [];
    }
    this.length = this.nodeList.length;
    return this;
  },


  /*
  * __Factory
  * object Wish {obj = [], length = 0} ( [object node, object NodeList, string selector] )

  *@ Собственно фабрика
  * Принимает node или NodeList или selector
  * Создаст и вернет экземпляр объекта Wish -> this

  *@ node
  * Если передана object node, - библиотека создаст коллекцию Wish из одной node

  *@ NodeList
  * Из NodeList создаст поверхностную копию массива передаст под управление Wish

  *@ selector
  * Выполняет поиск узлов, которые соответствуют указанной группе селекторов. Поиск производится по всему документу.

  *@ null
  * При передаче null вернет пустой экземпляр объекта Wish
  */
  $ = function(obj){
    return new Wish(obj);
  },


  /* Reduction chain Element.prototype -> E*/
  E = Element.prototype,

  /* Reduction chain Wish.prototype -> W*/
  W = Wish.prototype;

  /* Global scope window.Wish -> Wish*/
  win.Wish = Wish;

  /* Global scope window.$ -> $*/
  win.$ = $;



  /*
  * It is important to use one method Element.prototype.matches
  */
  if (!E.matches){
    E.matches = function(selector){
      var matches = doc.querySelectorAll(selector),
      that = this;

      return [].some.call(matches, function(elem){
        return elem === that;
      });
    };
  }


  /*
  * Warning expected single element
  *
  function(obj){
  throw new TypeError('Expected a single element and instead saw an list', obj);
  };
  */



  /*
  * Вернет конкретный элемент коллекции объекта Wish по ключу
  * object Wish ( int item )
  */
  W.item = function(item){
    var obj = this.nodeList[item] || null;
    return $(obj);
  };



  /*
  * Вернет коллекцию конкретных элементов из коллекции объекта Wish по ключам
  * object Wish (int begin [, int end])

  *@ begin
  * Индекс (счёт начинается с нуля), по которому начинать извлечение.
  * Если индекс отрицательный, begin указывает смещение от конца последовательности. Вызов .slice(-2) извлечёт два последних элемента последовательности.
  * Если begin опущен, .slice() начинает работать с индекса 0.

  *@ end
  * Индекс (счёт начинается с нуля), по которому заканчивать извлечение. Метод slice() извлекает элементы с индексом меньше end.
  * Вызов .slice(1, 4) извлечёт элементы со второго по четвёртый (элементы по индексам 1, 2 и 3).
  * Если индекс отрицательный, end указывает смещение от конца последовательности. Вызов .slice(2, -1) извлечёт из последовательности элементы начиная с третьего элемента с начала и заканчивая вторым с конца.
  * Если end опущен, .slice() извлекает все элементы до конца последовательности (arr.length).
  */
  W.slice = function(begin, end){
    var obj = this.nodeList.slice(begin, end) || null;
    return $(obj);
  };



  /*
  * Добавит элемент или объект Wish в коллекцию элементов объекта Wish
  * object Wish ( object )

  *@ object
  * Принимаемый object может быть объектом Wish, NodeList или node
  */
  W.push = function(obj){
    var dft = this.nodeList;

    obj = obj instanceof Wish ? obj.nodeList : obj;

    if (obj instanceof Array){
      dft = dft.concat(obj);
    }
    else {
      dft.push(obj);
    }

    dft = $.unique(dft);

    return $(dft);
  };



  /*
  * Для каждого элемента коллекции Wish, выполнит function
  * Это должна быть просто функция JavaScript.
  * object Wish ( function )
  */
  W.each = function(fn){
    var count = this.length,
    i = 0;

    for (; i < count; ++i){
      if (fn.call(this.nodeList[i], i) === false){
        break;
      }
    }
    return this;
  };




  /* Выборка узлов. Поиск осуществляется в пределах указанного элемента */

  /*
  * Поиск узлов, которые соответствуют указанной группе селекторов
  * object Wish ( string selector )
  */
  W.find = function(selector){
    var dft = [],
    obj;

    this.each(function(){
      obj = this.querySelectorAll(selector);
      obj = $.inside(obj);
      dft = dft.concat(obj);
    });

    return $(dft);
  };



  var until = function(obj, method, arg){
    var list = false,
    dft = [],
    selector,
    that;

    $.loop(arg, function(i, val){
      if (typeof val == 'boolean'){
        list = true;
      }
      else if (typeof val == 'string'){
        selector = val;
      }
    });

    var pin = function(){
      that = this;

      while ((that = that[method])){
        if (selector){
          if (that.matches && that.matches(selector)){
            dft.push(that);
          }
        }
        else {
          dft.push(that);
        }
      }
    },

    tag = function(){
      that = this;

      while ((that = that[method])){
        if (selector){
          if (that.matches && that.matches(selector)){
            return dft.push(that);
          }
        }
        else {
          return dft.push(that);
        }
      }
    },

    link = list ? pin : tag;

    obj.each(link);
    dft = $.unique(dft);

    return $(dft);
  },


  into = function(obj, method, arg){
    var dft = [],
    selector;

    $.loop(arg, function(i, val){
      if (typeof val == 'string'){
        selector = val;
      }
    });

    var pin = function(){
      var list = this[method];
      list = $.inside(list);

      if (selector){
        var count = list.length,
        i = 0,
        elem;

        for (; i < count; ++i){
          elem = list[i];

          if (elem.matches && elem.matches(selector)){
            dft.push(elem);
          }
        }
      }
      else {
        dft = dft.concat(list);
      }
    };

    obj.each(pin);
    dft = $.unique(dft);

    return $(dft);
  };


  /*
  * Выборка дочерних узлов-элементов
  * object Wish ([ string selector, list = true ])
  */
  W.childs = function(){
    return into(this, 'children', arguments);
  };


  /*
  * Выборка первого из детей-элементов
  * object Wish ([ string selector, list = false ])
  */
  W.first = function(){
    return until(this, 'firstElementChild', arguments);
  };


  /*
  * Выборка последнего из детей-элементов
  * object Wish ([ string selector [, list = false ]])
  */
  W.last = function(){
    return until(this, 'lastElementChild', arguments);
  };


  /*
  * Выборка родителя-элемента
  * object Wish ([ string selector, list = false ])
  */
  W.parent = function(){
    return until(this, 'parentElement', arguments);
  };


  /*
  * Выборка предыдущего соседнего-элемента
  * object Wish ([ string selector, list = false ])
  */
  W.prev = function(){
    return until(this, 'previousElementSibling', arguments);
  };


  /*
  * Выборка следующего соседнего-элемента
  * object Wish ([ string selector, list = false ])
  */
  W.next = function(){
    return until(this, 'nextElementSibling', arguments);
  };





  /*
  * Выборка всех дочерних узлов
  * object Wish ([ string selector, list = true ])
  */
  W.childNodes = function(){
    return into(this, 'childNodes', arguments);
  };


  /*
  * Выборка первого из детей-узлов
  * object Wish ([ string selector, list = false ])
  */
  W.firstNode = function(){
    return until(this, 'firstChild', arguments);
  };


  /*
  * Выборка последнего из детей-узлов
  * object Wish ([ string selector, list = false ])
  */
  W.lastNode = function(){
    return until(this, 'lastChild', arguments);
  };


  /*
  * Выборка родителя-узла
  * object Wish ([ string selector, list = false ])
  */
  W.parentNode = function(){
    return until(this, 'parentNode', arguments);
  };


  /*
  * Выборка предыдущего соседа-узла
  * object Wish ([ string selector, list = false ])
  */
  W.prevNode = function(){
    return until(this, 'previousSibling', arguments);
  };


  /*
  * Выборка следующего соседа-узла
  * object Wish ([ string selector, list = false ])
  */
  W.nextNode = function(){
    return until(this, 'nextSibling', arguments);
  };





  /*
  * Отфильтрует существующую коллекцию Wish по селектору или свойству
  * object Wish ( string selector || object property )
  */
  W.filter = function(arg){
    var dft = [];

    if (typeof arg == 'string'){
      this.each(function(){
        if (this.matches && this.matches(arg)){
          dft.push(this);
        }
      });
    }
    else if (typeof arg == 'object'){
      this.each(function(){
        var that = this;

        $.loop(arg, function(i, val){
          if (that[i] && that[i] == val){
            dft.push(that);
          }
        });
      });
    }

    return $(dft);
  };



  /*
  * Первый элемент коллекции Wish ЭТО ...?
  * bool ( string selector )
  */
  W.is = function(selector){
    var obj = this.nodeList[0];

    if (obj && obj.matches){
      return obj.matches(selector);
    }

    return und;
  };



  /*
  * Регистрирует определенный обработчик события
  * object Wish ( string event, function [, bubble = false ])
  */
  W.on = function(type, fn, bubble){
    return this.each(function(){
      if (this.addEventListener){
        this.addEventListener(type, fn, !!bubble);
      }
    });
  };



  var target = function(selector, fn, e){
    var obj = e.target;

    do {
      if (obj.matches && obj.matches(selector)){
        return fn.call(obj, e);
      }
    }
    while ((obj = obj.parentNode));
  };



  /*
  * Регистрирует определенный обработчик события для группы селекторов в пределах указанного элемента
  * Обработчик сработает после добавления новых дочерних элементов, удовлетворяющих селектору
  * object Wish ( string event, string selector, function )
  */
  W.by = function(type, selector, fn){
    return this.on(type, target.bind(this, selector, fn));
  };


  /*
  * Удаляет обработчик события, который был зарегистрирован в .on()
  * object Wish ( string event, function [, bubble = false ])
  */
  W.off = function(type, fn, bubble){
    return this.each(function(){
      if (this.removeEventListener){
        this.removeEventListener(type, fn, !!bubble);
      }
    });
  };


  /*
  * Генерация и вызов собственного события (клик мыши или нажатие клавиши на клавиатуре)
  * object Wish ( string event, detail )
  */
  W.trigger = function(type, detail){
    return this.each(function(){
      if (this.dispatchEvent){
        var e = new Event(type, detail);
        this.dispatchEvent(e);
      }
    });
  };



  /*
  * Вызовет стандартный метод узла, передаст опции
  * object Wish ( string type [, options ])
  */
  W.method = function(type){
    var options = Array.prototype.slice.call(arguments, 1);
    return this.each(function(){
      if (this[type]){
        this[type].apply(this, options);
      }
    });
  };



  /*
  * Свойства узлов коллеции Wish
  * object Wish ( object {name: value, ...})
  * mixed ( string property )
  * object {[name1, ...], length: 1} ( undefind )

  *@ object
  * Должен быть передан в виде {name1: value, name2: value, ...}

  *@ string name
  * При передачи name, метод вернет значение это свойства у первого элемента коллекции объекта Wish

  *@ undefind
  * Вернет нативную ноду из первого элемента коллекции объета Wish
  */
  W.prop = function(arg){
    if (typeof arg == 'object'){
      return this.each(function(){
        var that = this;

        $.loop(arg, function(i, val){
          that[i] = val;
        });
      });
    }
    else {
      if (this.length){
        var prop = this.nodeList[0];
        return typeof arg == 'string' ? prop[arg] : prop;
      }
      return und;
    }
  };



  // Реализованы методы dataset для IE 11-
  /*
  var toDashed = function(type){
  return type.replace(/([A-Z])/g, function(u){
  return '-'+ u.toLowerCase();
  });
  };

  var data = function(that, type, val){
  if (val){
  if (that.dataset){
  that.dataset[type] = val;
  }
  else {
  that.setAttribute('data-'+ toDashed(type), val);
  }
  }
  else {
  if (that.dataset){
  return that.dataset[type];
  }
  else {
  return that.getAttribute('data-'+ toDashed(type));
  }
  }
  };
  */

 /*
 * Реализует возможность привязат собственные данные (переменные) к элементам на странице
 * object Wish ( object {name: value, ...})
 * sting ( string dataName )
 * object {[name1, ...], length: 1} ( undefind )

 *@ object
 * Должен быть передан в виде {name1: value, name2: value, ...}

 *@ string name
 * При передачи name, метод вернет значение это свойства у первого элемента коллекции объекта Wish

 *@ undefind
 * Вернет объект DOMStringMap, содержащий все data свойства у первого элемента коллекции объета Wish

 */
 W.data = function(arg){
   if (typeof arg == 'object'){
     return this.each(function(){
       var that = this;

       $.loop(arg, function(i, val){
         that.dataset[i] = val;
       });
     });
   }
   else {
     if (this.length){
       var data = this.nodeList[0].dataset;
       return typeof arg == 'string' ? data[arg] : data;
     }
     return und;
   }
 };




 // Реализация attr вынесена за пределы метода, что бы JavaScript при обращеннии к методу вызывал лишь ссылку, а не лапшу из if else
 var attr = function(i, val){
   if (val === false){
     if (this.hasAttribute(i)){
       this.removeAttribute(i);
     }
   }
   else {
     this.setAttribute(i, val);
   }
 };

 /*
 * Возвращает или изменяет css значения выбранных элементов в коллекции Wish
 * object Wish ( object {styleName1: value, ...})
 * string value ( string styleName )
 * object {[styleName1, ...], length: 1} ( undefind )

 *@ object
 * Может быть передан в виде {styleName1: value, styleName2: value, ...}

 *@ string styleName
 * При передачи styleName, метод вернет значение css свойства у первого элемента коллекции объекта Wish

 *@ undefind
 * Вернет псевдомассив DOMTokenList, содержащий все css свойства у первого элемента коллекции объета Wish
 */
 W.attr = function(arg){
   if (typeof arg == 'object'){
     return this.each(function(){
       $.loop(arg, attr.bind(this));
     });
   }
   else {
     if (this.length){
       return this.nodeList[0].getAttribute(arg);
     }
   }
 };




 // Реализация css вынесена за пределы метода, что бы JavaScript при обращеннии к методу вызывал лишь ссылку
 var css = function(i, val){
   if (this.style){
     this.style[i] = val;
   }
 };

 /*
 * Возвращает или изменяет css значения выбранных элементов в коллекции Wish
 * object Wish ( object {styleName1: value, ...})
 * string value ( string styleName )
 * object {[styleName1, ...], length: 1} ( undefind )

 *@ object
 * Может быть передан в виде {styleName1: value, styleName2: value, ...}

 *@ string styleName
 * При передачи styleName, метод вернет значение css свойства у первого элемента коллекции объекта Wish

 *@ undefind
 * Вернет объект CSSStyleDeclaration, содержащий все css свойства у первого элемента коллекции объета Wish
 */
 W.css = function(arg){
   if (typeof arg == 'object'){
     return this.each(function(){
       $.loop(arg, css.bind(this));
     });
   }
   else {
     var obj = this.nodeList[0];

     if (obj && obj.style){
       var style = win.getComputedStyle(obj);
       return typeof arg == 'string' ? style[arg] : style;
     }

     return und;
   }
 };




 /*
 * Возвращает или изменяет координаты выбранных элементов
 * object Wish ( object cords )
 * int value ( string cordsName )
 * object ClientRect {top: 0, right: 0, width: 0…} ( undefind )

 *@ object
 * Разместит узлы коллекции объета Wish в соответствии с указанными координатами относительно документа
 * Объект должен содержать иметь вид: {left: 0, top: 0}
 * left - горизонтальный отступ
 * top - отступ по вертикали

 *@ string
 * Вернет значение координаты, если передан один из параметров: left, top, right, bottom

 *@ undefind
 * Вернет объект ClientRect, содержащий все координаты у первого элемента коллекции объета Wish
 */
 W.position = function(arg){
   if (typeof arg == 'object'){
     var obj = doc.elementFromPoint(arg.left, arg.top);
     return $(obj);
   }
   else {
     if (this.length){
       var rect = this.nodeList[0].getBoundingClientRect();
       return typeof arg == 'string' ? rect[arg] : rect;
     }
     return und;
   }
 };




 // Релизованы методы classList для IE 10-
 /*
 var classList = {
 get: function(elem){
 return elem.className.split(/\s+/);
  },

  contains: function(elem, name){
  return this.get(elem).indexOf(name) >= 0;
  },

  add: function(elem, name){
  elem.className = elem.className +' '+ name;
  },

  remove: function(elem, name){
  var list = this.get(elem),
  item = list.indexOf(name);

  list.splice(item, 1);
  elem.className = list.join(' ');
  }
  };
  */

  // Реализация classes вынесена за пределы метода, что бы JavaScript при обращеннии к методу вызывал лишь ссылку, а не лапшу из if else
  var classes = function(i, val){
    if (val === true){
      this.classList.add(i);
    }
    else if (val === false){
      this.classList.remove(i);
    }
    else {
      this.classList.toggle(i);
    }
  };

  /*
  * Реализует возможность работы с классами элементов в коллекции Wish
  * object Wish ( object {className1: bool, ...})
  * exist className ? bool ( string dataName )
  * object {[className1, ...], length: 1} ( undefind )

  *@ object
  * Может быть передан в виде {className1: true, className2: false, className3: null}
  * true - класс className у элемента будет установлен
  * false - класс className у элемента будет удален
  * null - (toggle) если у елемента className уже есть, значит он будет уделен. И наоборот, если у елемента className нет, значит будет установлен

  *@ string className
  * При передачи className, метод проверит присутствует ли у первого элемента коллекции объета Wish className

  *@ undefind
  * Вернет псевдомассив DOMTokenList, содержащий все классы у первого элемента коллекции объета Wish
 */
 W.classes = function(arg){
   if (typeof arg == 'object'){
     return this.each(function(){
       $.loop(arg, classes.bind(this));
     });
   }
   else if (typeof arg == 'string'){
     if (this.length){
       return this.nodeList[0].classList.contains(arg);
     }
     return false;
   }
   else {
     if (this.length){
       return this.nodeList[0].classList;
     }
   }
 };






 var sure = function(that, type, arg){
   if (arg !== und){
     var obj = {};
     obj[type] = arg;
     type = obj;
   }
   return that.prop(type);
 };

 /*
 * Возвращает или изменяет html-содержимое выбранных элементов
 * object Wish ( string html )
 * string html ( undefind )
 */
 W.html = function(arg){
   return sure(this, 'innerHTML', arg);
 };


 /*
 * Возвращает или изменяет текстовое содержимое выбранных элементов
 * object Wish ( string text )
 * string text ( undefind )
 */
 W.text = function(arg){
   return sure(this, 'textContent', arg);
 };



 /*
 * Возвращает или изменяет значение ширины выбранных элементов
 * object Wish ( int width )
 * int width ( undefind )
 */
 W.width = function(arg){
   return sure(this, 'clientWidth', arg);
 };


 /*
 * Возвращает или изменяет значение высоты выбранных элементов
 * object Wish ( int height )
 * int height ( undefind )
 */
 W.height = function(arg){
   return sure(this, 'clientHeight', arg);
 };




 var gear = function(obj, that, fn){
   obj = obj instanceof Wish ? obj.nodeList : obj;

   if (obj instanceof Array){
     if (typeof obj == 'string'){
       obj = doc.createTextNode(obj);
     }

     return that.each(function(){
       var count = obj.length,
       i = 0;

       for (; i < count; ++i){
         fn.call(this, obj[i]);
       }
     });
   }
   else {
     return that.each(function(){
       fn.call(this, obj);
     });
   }
 };

 /*
 * ПЕРЕД каждым выбранным элементом коллекции Wish поместить объект
 * object Wish ( object )

 *@ object
 * Принимаемый object может быть объектом Wish, текстом или node или NodeList
 */
 W.before = function(obj){
   return gear(obj, this, function(inc){
     this.parentElement.insertBefore(inc, this);
   });
 };


 /*
 * Для каждого выбранного элемента коллекции Wish, в НАЧАЛО поместить объект
 * object Wish ( object )

 *@ object
 * Принимаемый object может быть объектом Wish, текстом или node или NodeList
 */
 W.prepend = function(obj){
   return gear(obj, this, function(inc){
     this.insertBefore(inc, this.firstElementChild);
   });
 };


 /*
 * Для каждого выбранного элемента коллекции Wish, в КОНЕЦ поместить объект
 * object Wish ( object )

 *@ object
 * Принимаемый object может быть объектом Wish, текстом или node или NodeList
 */
 W.append = function(obj){
   return gear(obj, this, function(inc){
     this.appendChild(inc);
   });
 };


 /*
 * ПОСЛЕ каждого выбранного элемента коллекции Wish поместить объект
 * object Wish ( object )

 *@ object
 * Принимаемый object может быть объектом Wish, текстом или node или NodeList
 */
 W.after = function(obj){
   return gear(obj, this, function(inc){
     this.parentElement.insertBefore(inc, this.nextElementSibling);
   });
 };



 /*
 * Каждый выбранный элемент коллекции Wish ЗАМЕНЕТ в объектом
 * object Wish ( object )

 *@ object
 * Принимаемый object может быть объектом Wish или node или NodeList
 */
 W.shift = function(obj){
   return gear(obj, this, function(inc){
     var elem = this.parentElement;

     if (elem.replaceChild){
       elem.replaceChild(inc, this);
     }
   });
 };



 /*
 * Каждый выбранный элемент коллекции Wish склонирует в новый объект Wish
 * object Wish ([ deep = false ])

 *@ deep
 * true, если дети узла должны быть клонированы или false для того, чтобы был клонирован только указанный узел.
 */
 W.clone = function(deep){
   var dft = [],
   obj;

   this.each(function(){
     obj = this.cloneNode(!!deep);
     dft.push(obj);
   });

   return $(dft);
 };



 /*
 * Удалит выбранные элементы коллекции Wish, вернет ссылку на удаленный объект
 * object Wish ( undefind )
 */
 W.remove = function(){
   return this.each(function(){
     this.parentNode.removeChild(this);
   });
 };



 $.w = $(win);
 $.d = $(doc);



 /*
 * Преобразует NodeList в Array
 * array ( nodeList )
 */
 $.inside = function(nodeList){
   return [].slice.call(nodeList);
 };


 /*
 * Вернет массив из уникальных значений
 * array ( array )
 */
 $.unique = function(obj){
   return obj.filter(function(val, i, that){
     return that.indexOf(val) === i;
   });
 };


 /*
 * Создаст новый элемент, вернет объект Wish
 * object Wish ( string nodeNane )
 */
 $.create = function(nodeNane){
   var obj = doc.createElement(nodeNane);
   return $(obj);
 };



 /* Декораторы функций
 * Подробнее о декораторах функций в JavaScript можно прочитать тут: https://habrahabr.ru/post/60957/

 * Функция callback будет ограничена в частоте выполнения — не чаще, чем один раз в wait миллисекунд. Если с момента последнего вызова прошло меньшее времени и был произведен еще один, то он будет проигнорирован
 function ( int time wait, function callback [, trailing = false ])

 trailing = false
 ||||||||||||||||||||||||| (пауза) |||||||||||||||||||||||||
 X    X    X    X    X    X        X    X    X    X    X    X

 trailing = true
 ||||||||||||||||||||||||| (пауза) |||||||||||||||||||||||||
 X    X    X    X    X             X    X    X    X    X
 */
 $.throttle = function(wait, callback, trailing){
   var timeout;

   return function(){
     var that = this,
     args = arguments,

     later = function(){
       timeout = null;

       if (trailing){
         callback.apply(that, args);
       }
     };

     if (!timeout){
       timeout = win.setTimeout(later, wait);
       callback.apply(that, args);
     }
   };
 };



 /*
 Выполнение функции callback будет откладываться на delay миллисекунд, если за это время функция будет вызвана еще раз, то предыдущий вызов будет отменен, а выполнение текущего опять отложится на время delay
 function ( int time delay, function callback [, begin = false ])

  begin = false
  ||||||||||||||||||||||||| (пауза) |||||||||||||||||||||||||
                          X                                 X
  begin = true
  ||||||||||||||||||||||||| (пауза) |||||||||||||||||||||||||
  X                                 X
  */
  $.debounce = function(delay, callback, begin){
    var timeout;

    return function(){
      var that = this,
      args = arguments,

      later = function(){
        timeout = null;

        if (!begin){
          callback.apply(that, args);
        }
      };

      win.clearTimeout(timeout);
      timeout = win.setTimeout(later, delay);

      if (begin && !timeout){
        callback.apply(that, args);
      }
    };
  };





  var syne = function(obj){
    var data = null;

    if (obj.data){
      data = new FormData();

      $.loop(obj.data, function(i, val){
        data.append(i, val);
      });
    }

    return {
      url: obj.url,
      method: obj.method.toUpperCase(),
      data: data
    };
  },

  XHR = function(obj, fail, done){
    obj = syne(obj);

    this.xhr = new XMLHttpRequest();
    this.xhr.open(obj.method, obj.url, true);

    this.xhr.onload = function(){
      if (this.status == 200){
        if (done){
          done(this.responseText, this);
        }
      }
      else {
        if (fail){
          fail(this.statusText, this);
        }
      }
    };

    if (fail){
      this.xhr.onerror = fail;
    }

    this.xhr.send(obj.data);
    return this;
  };


  /*
  * Осуществляет XMLHttpRequest запрос к серверу
  * object then ( object )
  * Вернет объект с двумя методами .done( callback ) или .fail( callback )
  * .done( function (ansver, object this ){} ), в случае успеха (HTTP 200) в аргумент callback функции передаст ответ в виде строки
  * .fail( function (statusText, object this){} ), в случае неудачи (ответ, отличный от HTTP 200), в аргумент callback функции передаст текст ошибки

  *@ object
  * Должен иметь вид: {
  url: url,
  method: 'get', 'post', 'put', 'delete', ...
  [, object data ]
  }
  * url - URL адрес для отправки запроса
  * method - HTTP-метод, такой как «GET», «POST», «PUT», «DELETE» и т.д. Игнорируется для URL-адресов, отличных от HTTP (S).
  * Указание method регистронезависимо.
  * data - object, содержащий данные для отправки в виде {name1: value, ...}
  */
  $.ajax = function(obj, done, fail){
    return new XHR(obj, done, fail);
  };



  var loc = win.localStorage,
  storage = function(i, val){
    return val === false ? loc.removeItem(i) : loc.setItem(i, val);
  };

  /*
  * Положить или получить данные в долговременном хранилище localStorage
  * bool ( object {name: value, ...} )
  * string value ( string localName )
  * object Storage ( void )

  *@ object
  * Поместит данные в хранилищ пользователя.
  * Должен быть передан в виде {name1: value, name2: value, ...}

  *@ string localName
  * При передачи localName, метод вернет хранимое значение

  *@ undefind
  * Вернет объект Storage, содержащий все хранимые значения
  */
  $.storage = function(arg){
    if (loc){
      if (typeof arg == 'object'){
        return $.loop(arg, storage);
      }
      else {
        return typeof arg == 'string' ? loc.getItem(arg) : win.localStorage;
      }
    }
  };


  /*
  * Перечисляет свойства переданного объекта, без цепочки прототипа, передает ключ и значение в callback функцию
  * void ( object, callback function(key, value){} )
  */
  $.loop = function(obj, callback){
    if (obj){
      var keys = Object.keys(obj),
      count = keys.length,
      i = 0,
      inc;

      for (; i < count; ++i){
        inc = keys[i];
        callback(inc, obj[inc], i);
      }
    }
  };
})();
