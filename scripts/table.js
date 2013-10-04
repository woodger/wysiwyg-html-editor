(function(){
  'use strict';

  var Table = function(p){
    this.p = p;

    return this;
  };



  E.table = function(p){
    return new Table(p);
  };




  /* Получение ячеек таблицы на линии по-горизонтали */
  var cellsFromRow = function(elem){
    var elemOffsetTop = elem.prop('offsetTop');
    var elemOffsetBottom = elemOffsetTop + elem.height();

    var cels = elem.parent('table').find('td');


    cels.each(function(){
      var that = $(this);
      var thatOffsetTop = that.prop('offsetTop');

      if (thatOffsetTop == elemOffsetTop){
        elem = elem.push(that);
      }
      else if (that.is('[rowspan]')){
        var thatOffsetBottom = thatOffsetTop + that.height();

        if (thatOffsetTop < elemOffsetTop && thatOffsetBottom >= elemOffsetBottom){
          elem = elem.push(that);
        }
      }
    });

    return elem;
  };



  var cellsFromCol = function(elem){
    var elemOffsetLeft = elem.prop('offsetLeft');
    var elemOffsetRight = elemOffsetLeft + elem.width();

    var cels = elem.parent('table').find('td');


    cels.each(function(){
      var that = $(this);
      var thatOffsetLeft = that.prop('offsetLeft');

      if (thatOffsetLeft == elemOffsetLeft){
        elem = elem.push(that);
      }
      else if (that.is('[colspan]')){
        var thatOffsetRight = thatOffsetLeft + that.width();

        if (thatOffsetLeft < elemOffsetLeft && thatOffsetRight >= elemOffsetRight){
          elem = elem.push(that);
        }
      }
    });

    return elem;
  };





  /* Очистить высоту элементов таблицы */
  Table.prototype.cleanStyle = function(prop, msn){
    var table = this.p.parent('table');

    if (!table.length){
      if (msn){
        E.notice.fail('Таблица не найдена');
      }
      return this;
    }


    var regexp = new RegExp('('+ prop +'.*?;|'+ prop +'.*)');
    var elem = table.find('tr, td');

    elem.each(function(){
      var that = $(this);
      var style = that.attr('style');

      if (style){
        style = style.replace(regexp, '');
        style = style.replace(/;,/g, ';');
        style = style.trim();


        that.attr({
          style: style ? style : false
        });
      }
    });

    if (msn){
      E.notice.done('Формат таблицы');
    }

    return this;
  };




  /* Удалить строку из таблицы */
  Table.prototype.unsetRow = function(msn, callback){
    var td = this.p.parent('td');

    if (!td.length){
      if (msn){
        E.notice.fail('Ячейка таблицы не найдена');
      }
      return this;
    }

    if (td.is('[rowspan]')){
      if (msn){
        E.notice.fail('Удалить строку из таблицы невозможно: выбрана объединенная ячейка');
      }
      return this;
    }


    var tr = td.parent('tr');
    var siblings = tr.childs();
    var nextTr = tr.next();
    var cells = cellsFromRow(td);


    if (siblings.filter('[rowspan]').length && !nextTr.length){
      if (msn){
        E.notice.fail('Удалить строку из таблицы невозможно: на линии объединенная ячейка, но следующая строка отсутствует');
      }
      return this;
    }


    /* Зафиксировать высоту строки */
    tr.attr({
      height: tr.height()
    });


    if (typeof(callback) == 'function'){
      var cellsCol = cellsFromCol(td),
      node = td.prop();

      cellsCol.each(function(i){
        if (this == node){
          i ? --i : ++i;

          /* Элемент на котором сфокусировать каретку после удаления */
          var elem = cellsCol.item(i);
          callback(elem);

          return false;
        }
      });
    }


    siblings.each(function(){
      var that = $(this);

      if (that.is('[rowspan]')){
        var thatOffset = that.position();
        var cellnextTr = nextTr.childs();


        cellnextTr.each(function(){
          var cell = $(this);
          var cellOffset = cell.position();

          if (cellOffset.left == thatOffset.right){
            cell.before(that);
          }
          else if (cellOffset.right == thatOffset.left){
            cell.after(that);
          }
        });
      }
    });


    cells.each(function(){
      var that = $(this);

      if (that.is('[rowspan]')){
        var rowspan = that.attr('rowspan');
        rowspan = parseInt(rowspan);

        that.attr({
          rowspan: --rowspan > 1 ? rowspan : false
        });
      }
    });


    tr.remove();


    if (msn){
      E.notice.done('Строка из таблицы успешно уделена');
    }

    return this;
  };




  /* Удалить столбец из таблицы */
  Table.prototype.unsetCol = function(msn, callback){
    var td = this.p.parent('td');

    if (!td.length){
      if (msn){
        E.notice.fail('Ячейка таблицы не найдена');
      }
      return this;
    }

    if (td.is('[colspan]')){
      if (msn){
        E.notice.fail('Удалить столбец из таблицы невозможно: выбрана объединенная ячейка');
      }
      return this;
    }

    var cells = cellsFromCol(td);


    if (typeof(callback) == 'function'){
      var cellsRow = cellsFromRow(td),
      node = td.prop();

      cellsRow.each(function(i){
        if (this == node){
          i ? --i : ++i;

          // Элемент на котором сфокусировать каретку после удаления
          var elem = cellsRow.item(i);
          callback(elem);

          return false;
        }
      });
    }


    cells.each(function(){
      var that = $(this);

      if (that.is('[colspan]')){
        var colspan = that.attr('colspan');
        colspan = parseInt(colspan);

        if (colspan == 1){
          that.remove();
        }
        else {
          that.attr({
            colspan: --colspan > 1 ? colspan : false
          });
        }
      }
      else {
        that.remove();
      }
    });

    if (msn){
      E.notice.done('Столбец из таблицы успешно уделен');
    }

    return this;
  };





  /* Объеденить таблицы */
  Table.prototype.uniteTable = function(msn){
    var prevTable = this.p.prev('table');
    var nextTable = this.p.next('table');
    var page = this.p.parent('.page');


    if (!prevTable.length){
      var prevPage = page.prev();

      prevTable = prevPage.last();

      if (!prevTable.is('table')){
        if (msn){
          E.notice.done('Верхняя таблица не найдена');
        }
        return this;
      }
    }


    if (!nextTable.length){
      var nextPage = page.next();

      nextTable = nextPage.first();

      if (!nextTable.is('table')){
        if (msn){
          E.notice.done('Нижняя таблица не найдена');
        }
        return this;
      }
    }


    var tbody = prevTable.find('tbody');

    if (!tbody.length){
      tbody = $.create('tbody');

      prevTable.find('tr').each(function(){
        tbody.append(this);
      });

      prevTable.append(tbody);
    }


    nextTable.find('tr').each(function(){
      tbody.append(this);
    });

    nextTable.remove();


    if (msn){
      E.notice.done('Таблицы успешно объеденены');
    }
  };




  /* Разбить таблицу */
  Table.prototype.severTable = function(msn){
    var td = this.p.parent('td');

    if (!td.length){
      if (msn){
        E.notice.fail('Ячейка таблицы не найдена');
      }
      return this;
    }

    var tr = td.parent('tr'),
    nextTr = tr.next(),
    rowIndex = tr.prop('rowIndex'),
    cells = cellsFromRow(td);


    if (td.is('[rowspan]')){
      if (msn){
        E.notice.fail('Разделение таблицы невозможно: выбрана объединенная ячейка');
      }
      return this;
    }

    if (!nextTr.length){
      if (msn){
        E.notice.fail('Разделение таблицы невозможно: выбрана последняя строка');
      }
      return this;
    }


    cells.each(function(){
      var that = $(this);

      if (that.is('[rowspan]')){
        var parentRow = that.parent('tr'),
        parentRowIndex = parentRow.prop('rowIndex'),

        rowspan = that.attr('rowspan'),
        rowspan = parseInt(rowspan),

        differ = rowIndex - parentRowIndex;

        if (differ === 0 || differ + 1 < rowspan){
          var thatOffset = that.position(),
          clone = that.clone(true),
          cloneRowspan = rowspan - differ - 1,
          thatRowspan = differ + 1;


          var meanly = function(){
            clone.attr({
              rowspan: cloneRowspan > 1 ? cloneRowspan : false
            });

            that.attr({
              rowspan: thatRowspan > 1 ? thatRowspan : false
            });
          };


          nextTr.childs().each(function(){
            var cell = $(this),
            cellOffset = cell.position();

            if (cellOffset.left == thatOffset.right){
              meanly();
              cell.before(clone);

              return false;
            } else if (cellOffset.right == thatOffset.left){
              meanly();
              cell.after(clone);

              return false;
            }
          });
        }
      }
    });


    var table = td.parent('table'),
    newTable = $.create('table'),
    tbody = $.create('tbody'),
    p = $.create('p');

    newTable.append(tbody);

    tr.next(true).each(function(){
      tbody.append(this);
    });

    table
    .after(newTable)
    .after(p);

    if (msn){
      E.notice.done('Таблица успешно разделена');
    }

    return this;
  };
})();
