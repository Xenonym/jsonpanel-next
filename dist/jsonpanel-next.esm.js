/*!
 * jsonpanel-next v1.0.0
 * (c) 2019 Tan Zhen Yong
 * Released under the MIT License.
 */

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function simpleClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getObjectWithDefaults(obj, defaultObj) {
  var newObj = simpleClone(defaultObj);
  return Object.assign(newObj, obj);
}

var Pair = function Pair(key, val, valTransformer) {
  this.key = key;
  this.val = val;
  this.valTransformer = valTransformer;
};

var prototypeAccessors = { valType: { configurable: true },class: { configurable: true } };

Pair.create = function create (key, val, valTransformer) {
  if (isPlainObject(val) || Array.isArray(val)) {
    return new ExpandablePair(key, val, valTransformer);
  }

  return new SimplePair(key, val, valTransformer);
};

Pair.prototype.getKeyMarkup = function getKeyMarkup () {
  return ("<span class=\"key\">" + (this.key) + "</span>");
};

prototypeAccessors.valType.get = function () {
  return typeof this.val;
};

Pair.prototype.getValInnerMarkup = function getValInnerMarkup () {
  return JSON.stringify(this.val);
};

Pair.prototype.createTagInnerMarkup = function createTagInnerMarkup () {
  return ((this.getKeyMarkup()) + ": <span class=\"val " + (this.valType) + "\">" + (this.getValInnerMarkup()) + "</span>");
};

prototypeAccessors.class.get = function () {
  return 'pair';
};

Pair.prototype.createTag = function createTag () {
  var li = document.createElement('li');
  li.className = this.class;
  li.innerHTML = this.createTagInnerMarkup();
  return li;
};

Pair.prototype.render = function render () {
  this.el = this.createTag();
};

Object.defineProperties( Pair.prototype, prototypeAccessors );

var SimplePair = /*@__PURE__*/(function (Pair) {
  function SimplePair () {
    Pair.apply(this, arguments);
  }

  if ( Pair ) SimplePair.__proto__ = Pair;
  SimplePair.prototype = Object.create( Pair && Pair.prototype );
  SimplePair.prototype.constructor = SimplePair;

  var prototypeAccessors$1 = { class: { configurable: true } };

  prototypeAccessors$1.class.get = function () {
    return ((Pair.prototype.class) + " simple");
  };

  SimplePair.prototype.getValInnerMarkup = function getValInnerMarkup () {
    if (this.valTransformer instanceof Function) {
      return this.valTransformer(Pair.prototype.getValInnerMarkup.call(this));
    }

    return Pair.prototype.getValInnerMarkup.call(this);
  };

  Object.defineProperties( SimplePair.prototype, prototypeAccessors$1 );

  return SimplePair;
}(Pair));

var ExpandablePair = /*@__PURE__*/(function (Pair) {
  function ExpandablePair () {
    Pair.apply(this, arguments);
  }

  if ( Pair ) ExpandablePair.__proto__ = Pair;
  ExpandablePair.prototype = Object.create( Pair && Pair.prototype );
  ExpandablePair.prototype.constructor = ExpandablePair;

  var prototypeAccessors$2 = { valType: { configurable: true },class: { configurable: true },expanded: { configurable: true } };

  prototypeAccessors$2.valType.get = function () {
    return Array.isArray(this.val) ? 'array' : 'object';
  };

  prototypeAccessors$2.class.get = function () {
    return ((Pair.prototype.class) + " expandable");
  };

  ExpandablePair.prototype.getValInnerMarkup = function getValInnerMarkup () {
    var valStr = Pair.prototype.getValInnerMarkup.call(this);
    // Truncate the array / object preview using val-inner class.
    // eg. { key: "val" } -> {<span class="val-inner">key: "val"</span>}
    var valMatch = valStr.match(/^([{[])(.*)([}\]])$/);
    return ((valMatch[1]) + "<span class=\"val-inner\">" + (valMatch[2]) + "</span>" + (valMatch[3]));
  };

  ExpandablePair.prototype.createTagInnerMarkup = function createTagInnerMarkup () {
    return ("<a class=\"expander\" href=\"#\">" + (Pair.prototype.createTagInnerMarkup.call(this)) + "</a>");
  };

  ExpandablePair.prototype.render = function render () {
    var this$1 = this;

    Pair.prototype.render.call(this);
    this.el
      .querySelector('.expander')
      .addEventListener('click', function (evt) { return this$1.onKeyClick(evt); });
  };

  prototypeAccessors$2.expanded.get = function () {
    return this.el.classList.contains('expanded');
  };

  ExpandablePair.prototype.expand = function expand () {
    // Open new panel
    Panel.renderToEl(this.el, {data: this.val});
    this.el.classList.add('expanded');
  };

  ExpandablePair.prototype.collapse = function collapse () {
    this.el
      .querySelectorAll('.panel')
      .forEach(function (e) { return e.parentNode.removeChild(e); });
    this.el.classList.remove('expanded');
  };

  ExpandablePair.prototype.onKeyClick = function onKeyClick (evt) {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }

    evt.stopPropagation();
    evt.preventDefault();
  };

  Object.defineProperties( ExpandablePair.prototype, prototypeAccessors$2 );

  return ExpandablePair;
}(Pair));

var createPair = Pair.create;

var Panel = function Panel(options) {
  this.options = options;
};

var prototypeAccessors$1 = { selector: { configurable: true },data: { configurable: true },valTransformer: { configurable: true } };

prototypeAccessors$1.selector.get = function () {
  return this.options.selector;
};

prototypeAccessors$1.data.get = function () {
  return this.options.data;
};

prototypeAccessors$1.valTransformer.get = function () {
  return this.options.valTransformer;
};

Panel.prototype.isArray = function isArray () {
  return Array.isArray(this.data);
};

Panel.prototype.createListTag = function createListTag () {
  if (this.isArray()) {
    var ol = document.createElement('ol');
    ol.className = 'list';
    ol.start = 0;
    return ol;
  }

  var ul = document.createElement('ul');
  ul.className = 'list';
  return ul;
};

Panel.prototype.createListItem = function createListItem (key, val) {
  var pair = createPair(key, val, this.valTransformer);
  pair.render();
  return pair.el;
};

Panel.prototype.render = function render () {
    var this$1 = this;

  var list = this.createListTag();
  Object.entries(this.data).forEach(function (ref) {
      var key = ref[0];
      var val = ref[1];

    list.append(this$1.createListItem(key, val));
  });

  var listWrap = document.createElement('div');
  listWrap.className = 'panel';
  listWrap.append(list);
  this.el = listWrap;
  return this;
};

Panel.renderToEl = function renderToEl (container, options) {
  var panel = new Panel(options);
  panel.render();

  container.append(panel.el);
  return panel;
};

Object.defineProperties( Panel.prototype, prototypeAccessors$1 );

var defaultOptions = {
  selector: '#jsonpanel',
  data: {}
};

function jsonpanelNext(options) {
  options = getObjectWithDefaults(options, defaultOptions);
  return Panel.renderToEl(
    window.document.querySelector(options.selector),
    options
  );
}

export default jsonpanelNext;
