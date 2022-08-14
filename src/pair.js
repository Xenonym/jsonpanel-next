import {isPlainObject} from './util.js';
import Panel from './panel.js';

class Pair {
  constructor(key, value, valueTransformer) {
    this.key = key;
    this.val = value;
    this.valTransformer = valueTransformer;
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

  get valType() {
    return typeof this.val;
  }

  getValInnerMarkup() {
    return JSON.stringify(this.val);
  }

  createTagInnerMarkup() {
    return `${this.getKeyMarkup()}: <span class="val ${
      this.valType
    }">${this.getValInnerMarkup()}</span>`;
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

  getValInnerMarkup() {
    if (this.valTransformer instanceof Function) {
      return this.valTransformer(super.getValInnerMarkup());
    }

    return super.getValInnerMarkup();
  }
}

class ExpandablePair extends Pair {
  get valType() {
    return Array.isArray(this.val) ? 'array' : 'object';
  }

  get class() {
    return `${super.class} expandable`;
  }

  getValInnerMarkup() {
    const valueString = super.getValInnerMarkup();
    // Truncate the array / object preview using val-inner class.
    // eg. { key: "val" } -> {<span class="val-inner">key: "val"</span>}
    const valueMatch = valueString.match(/^([{[])(.*)([}\]])$/);
    return `${valueMatch[1]}<span class="val-inner">${valueMatch[2]}</span>${valueMatch[3]}`;
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
      data: this.val,
      valTransformer: this.valTransformer,
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

export default Pair.create;
