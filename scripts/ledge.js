(function(){
  'use strict';

  window.E.ledge = {

    /* Установить многоточия в строке */
    feather: function(p){
      var text = p.text();

      if (!p.is('.ledge')){
        text = text.replace(/([^ $]+)(\d$)/, '$1 $2');
        return p.text(text);
      }

      var num = text.match(/\d+$/);
      var rubric = text.replace(/[\.…]{2,}.*| \d+$/, '');
      var left = $.create('span').text(rubric);

      p.html(null)
      .classes({ledge: true})
      .prepend(left);

      if (num){
        var span = $.create('span')
        .classes({tally: true})
        .text(num[0]);

        p.append(span);
      }
    },



    /* Искать многоточия внутри элемента */
    keep: function(elem){
      var root = this;

      elem.find('p').each(function(){
        var p = $(this);
        var text = p.text();

        if (/.+[\.…]{2,}/.test(text)){
          p.classes({ledge: true});
          root.feather(p);
        }
      });
    }
  };
})();
