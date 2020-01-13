/*!
 * jsonpanel-next v1.0.1
 * (c) 2020 Tan Zhen Yong
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
    Panel.renderToEl(this.el, {
      data: this.val,
      valTransformer: this.valTransformer
    });
    this.el.classList.add('expanded');
  };

  ExpandablePair.prototype.collapse = function collapse () {
    this.el.querySelectorAll('.panel').forEach(function (e) { return e.remove(); });
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

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".jsonpanel {\n  box-sizing: border-box;\n  white-space: nowrap;\n  font-family: monospace;\n  padding: 1em;\n  line-height: 1.4; }\n  .jsonpanel * {\n    margin: 0;\n    padding: 0; }\n  .jsonpanel .panel {\n    display: inline-block;\n    vertical-align: top; }\n  .jsonpanel .list {\n    list-style-type: none;\n    padding: 0.5em 0; }\n  .jsonpanel ul:before {\n    content: '{'; }\n  .jsonpanel ul:after {\n    content: '}'; }\n  .jsonpanel ol:before {\n    content: '['; }\n  .jsonpanel ol:after {\n    content: ']'; }\n  .jsonpanel .key {\n    margin-left: 1em;\n    font-weight: bold; }\n  .jsonpanel .pair.simple {\n    max-width: 600px;\n    padding-left: 30px;\n    text-indent: -30px;\n    white-space: normal; }\n  .jsonpanel .pair .val:after {\n    content: \",\"; }\n  .jsonpanel .pair:last-child .val:after {\n    display: none; }\n  .jsonpanel .val-inner {\n    display: inline-block;\n    max-width: 28em;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    vertical-align: top; }\n  .jsonpanel .expander {\n    display: block;\n    text-decoration: none;\n    color: black; }\n    .jsonpanel .expander:hover {\n      transition: background-color 0.3s ease;\n      background-color: #D3DFF0; }\n    .jsonpanel .expander .key:before {\n      content: \"+\";\n      margin-right: 0.5em; }\n  .jsonpanel .expanded {\n    position: relative; }\n    .jsonpanel .expanded > .expander .key:before {\n      content: \"-\"; }\n    .jsonpanel .expanded > .expander .val {\n      opacity: 0; }\n    .jsonpanel .expanded > .panel {\n      margin-left: 2em; }\n  .jsonpanel .boolean {\n    color: red; }\n  .jsonpanel .string {\n    color: green; }\n  .jsonpanel .number {\n    color: blue; }\n  .jsonpanel .array .val-inner,\n  .jsonpanel .object .val-inner {\n    color: #a5a5a5; }\n\n@-webkit-keyframes fadeInText {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@keyframes fadeInText {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n.list {\n  -webkit-animation-name: fadeInText;\n          animation-name: fadeInText;\n  -webkit-animation-iteration-count: 1;\n          animation-iteration-count: 1;\n  -webkit-animation-timing-function: ease-in;\n          animation-timing-function: ease-in;\n  -webkit-animation-duration: 0.4s;\n          animation-duration: 0.4s;\n  -webkit-animation-fill-mode: forwards;\n          animation-fill-mode: forwards; }\n\n.val {\n  opacity: 1;\n  transition: opacity 0.4s ease; }\n";
styleInject(css);

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
