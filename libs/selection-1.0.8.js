(function() {
  'use strict';

  var Range = {
    get: function(selection) {
      var rng = document.createRange();

      if (selection) {
        rng.setStart(selection.anchorNode, selection.anchorOffset);
        rng.setEnd(selection.focusNode, selection.focusOffset);
      }

      return rng;
    },
    set: function(selection, rng) {
      selection.removeAllRanges();
      selection.addRange(rng);

      return rng;
    }
  },

  Selection = function() {
    return this.instance();
  },

  S = Selection.prototype,

  getNode = function(obj) {
    return obj instanceof Wish ? obj.prop() : obj;
  };

  S.instance = function() {
    var sel = window.getSelection();

    for (var i in sel) {
      if (i != undefined && typeof(sel[i]) != 'function') {
        this[i] = sel[i];
      }
    }

    if (this.anchorOffset > this.focusOffset) {
      this.anchorNode = sel.focusNode;
      this.anchorOffset = sel.focusOffset;
      this.focusNode = sel.anchorNode;
      this.focusOffset = sel.anchorOffset;
    }

    this.sel = sel;

    return this;
  };

  $.selection = function() {
    return new Selection();
  };

  S.highlight = function() {
    var rng = Range.get(this);
    Range.set(this.sel, rng);

    return this;
  };

  S.range = function(obj, start, end) {
    obj = getNode(obj);

    if (!obj) {
      return this;
    }

    var rng = Range.get();

    rng.setStart(obj, start);
    rng.setEnd(obj, end);
    Range.set(this.sel, rng);
    this.instance();

    return this;
  };

  S.insert = function(obj) {
    obj = getNode(obj);

    if (!obj) {
      return this;
    }

    var rng = Range.get(this);

    rng.insertNode(obj);
    rng.setStartBefore(obj);
    rng.setEndAfter(obj);
    Range.set(this.sel, rng);
    this.instance();

    return this;
  };

  S.wrap = function(obj) {
    obj = getNode(obj);

    if (!obj) {
      return this;
    }

    var rng = Range.get(this);

    if (!rng.collapsed) {
      rng.surroundContents(obj);
      rng.selectNodeContents(obj);
    }

    Range.set(this.sel, rng);
    this.instance();

    return this;
  };

  S.unwrap = function(obj) {
    obj = getNode(obj);

    if (!obj) {
      return this;
    }

    var rng = Range.get(this);
    rng.selectNodeContents(obj);

    var fragment = rng.extractContents();
    obj.remove();
    rng.insertNode(fragment);
    Range.set(this.sel, rng);
    this.instance();

    return this;
  };

  S.anchor = function() {
    var obj = this.anchorNode;
    return $(obj);
  };

  S.focus = function() {
    var obj = this.focusNode;
    return $(obj);
  };
})();
