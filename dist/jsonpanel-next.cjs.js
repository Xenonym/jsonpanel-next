/*!
 * jsonpanel-next v2.0.0
 * (c) 2022 Tan Zhen Yong
 * Released under the MIT License.
 */

'use strict';

function isPlainObject(object) {
  return Object.prototype.toString.call(object) === '[object Object]';
}

function simpleClone(object) {
  return JSON.parse(JSON.stringify(object));
}

function getObjectWithDefaults(object, defaultObject) {
  const newObject = simpleClone(defaultObject);
  return Object.assign(newObject, object);
}

class Pair {
  constructor(key, value, valueTransformer) {
    this.key = key;
    this.value = value;
    this.valueTransformer = valueTransformer;
  }

  static create(key, value, valueTransformer) {
    if (isPlainObject(value) || Array.isArray(value)) {
      return new ExpandablePair(key, value, valueTransformer);
    }

    return new SimplePair(key, value, valueTransformer);
  }

  getKeyMarkup() {
    return `<span class="key">${this.key}</span>`;
  }

  get valueType() {
    return typeof this.value;
  }

  getValueInnerMarkup() {
    return JSON.stringify(this.value);
  }

  createTagInnerMarkup() {
    return `${this.getKeyMarkup()}: <span class="value ${
      this.valueType
    }">${this.getValueInnerMarkup()}</span>`;
  }

  get class() {
    return 'pair';
  }

  createTag() {
    const li = document.createElement('li');
    li.className = this.class;
    li.innerHTML = this.createTagInnerMarkup();
    return li;
  }

  render() {
    this.el = this.createTag();
  }
}

class SimplePair extends Pair {
  get class() {
    return `${super.class} simple`;
  }

  getValueInnerMarkup() {
    if (this.valueTransformer instanceof Function) {
      return this.valueTransformer(super.getValueInnerMarkup());
    }

    return super.getValueInnerMarkup();
  }
}

class ExpandablePair extends Pair {
  get valueType() {
    return Array.isArray(this.value) ? 'array' : 'object';
  }

  get class() {
    return `${super.class} expandable`;
  }

  getValueInnerMarkup() {
    const valueString = super.getValueInnerMarkup();
    // Truncate the array / object preview using value-inner class.
    // eg. { key: "value" } -> {<span class="value-inner">key: "value"</span>}
    const valueMatch = valueString.match(/^([{[])(.*)([}\]])$/);
    return `${valueMatch[1]}<span class="value-inner">${valueMatch[2]}</span>${valueMatch[3]}`;
  }

  createTagInnerMarkup() {
    return `<a class="expander" href="#">${super.createTagInnerMarkup()}</a>`;
  }

  render() {
    super.render();
    this.el
      .querySelector('.expander')
      .addEventListener('click', (evt) => this.onKeyClick(evt));
  }

  get expanded() {
    return this.el.classList.contains('expanded');
  }

  expand() {
    // Open new panel
    Panel.renderToEl(this.el, {
      data: this.value,
      valueTransformer: this.valueTransformer,
    });
    this.el.classList.add('expanded');
  }

  collapse() {
    for (const element of this.el.querySelectorAll('.panel')) element.remove();
    this.el.classList.remove('expanded');
  }

  onKeyClick(evt) {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }

    evt.stopPropagation();
    evt.preventDefault();
  }
}

var createPair = Pair.create;

class Panel {
  constructor(options) {
    this.options = options;
  }

  get selector() {
    return this.options.selector;
  }

  get data() {
    return this.options.data;
  }

  get valueTransformer() {
    return this.options.valueTransformer;
  }

  isArray() {
    return Array.isArray(this.data);
  }

  createListTag() {
    if (this.isArray()) {
      const ol = document.createElement('ol');
      ol.className = 'list';
      ol.start = 0;
      return ol;
    }

    const ul = document.createElement('ul');
    ul.className = 'list';
    return ul;
  }

  createListItem(key, value) {
    const pair = createPair(key, value, this.valueTransformer);
    pair.render();
    return pair.el;
  }

  render() {
    const list = this.createListTag();
    for (const [key, value] of Object.entries(this.data)) {
      list.append(this.createListItem(key, value));
    }

    const listWrap = document.createElement('div');
    listWrap.className = 'panel';
    listWrap.append(list);
    this.el = listWrap;
    return this;
  }

  static renderToEl(container, options) {
    const panel = new Panel(options);
    panel.render();

    container.append(panel.el);
    return panel;
  }
}

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

var css_248z = ".jsonpanel {\n  box-sizing: border-box;\n  white-space: nowrap;\n  font-family: monospace;\n  padding: 1em;\n  line-height: 1.4;\n}\n.jsonpanel * {\n  margin: 0;\n  padding: 0;\n}\n.jsonpanel .panel {\n  display: inline-block;\n  vertical-align: top;\n}\n.jsonpanel .list {\n  list-style-type: none;\n  padding: 0.5em 0;\n}\n.jsonpanel ul:before {\n  content: \"{\";\n}\n.jsonpanel ul:after {\n  content: \"}\";\n}\n.jsonpanel ol:before {\n  content: \"[\";\n}\n.jsonpanel ol:after {\n  content: \"]\";\n}\n.jsonpanel .key {\n  margin-left: 1em;\n  font-weight: bold;\n}\n.jsonpanel .pair.simple {\n  max-width: 600px;\n  padding-left: 30px;\n  text-indent: -30px;\n  white-space: normal;\n}\n.jsonpanel .pair .value:after {\n  content: \",\";\n}\n.jsonpanel .pair:last-child .value:after {\n  display: none;\n}\n.jsonpanel .value-inner {\n  display: inline-block;\n  max-width: 28em;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  vertical-align: top;\n}\n.jsonpanel .expander {\n  display: block;\n  text-decoration: none;\n  color: black;\n}\n.jsonpanel .expander:hover {\n  transition: background-color 0.3s ease;\n  background-color: #D3DFF0;\n}\n.jsonpanel .expander .key:before {\n  content: \"+\";\n  margin-right: 0.5em;\n}\n.jsonpanel .expanded {\n  position: relative;\n}\n.jsonpanel .expanded > .expander .key:before {\n  content: \"-\";\n}\n.jsonpanel .expanded > .expander .value {\n  opacity: 0;\n}\n.jsonpanel .expanded > .panel {\n  margin-left: 2em;\n}\n.jsonpanel .boolean {\n  color: red;\n}\n.jsonpanel .string {\n  color: green;\n}\n.jsonpanel .number {\n  color: blue;\n}\n.jsonpanel .array .value-inner,\n.jsonpanel .object .value-inner {\n  color: #a5a5a5;\n}\n\n@-webkit-keyframes fadeInText {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes fadeInText {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.list {\n  -webkit-animation-name: fadeInText;\n          animation-name: fadeInText;\n  -webkit-animation-iteration-count: 1;\n          animation-iteration-count: 1;\n  -webkit-animation-timing-function: ease-in;\n          animation-timing-function: ease-in;\n  -webkit-animation-duration: 0.4s;\n          animation-duration: 0.4s;\n  -webkit-animation-fill-mode: forwards;\n          animation-fill-mode: forwards;\n}\n\n.value {\n  opacity: 1;\n  transition: opacity 0.4s ease;\n}";
styleInject(css_248z);

const defaultOptions = {
  selector: '#jsonpanel',
  data: {},
};

function jsonpanelNext(options) {
  options = getObjectWithDefaults(options, defaultOptions);
  return Panel.renderToEl(
    window.document.querySelector(options.selector),
    options,
  );
}

module.exports = jsonpanelNext;
