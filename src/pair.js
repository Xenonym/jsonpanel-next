import {isPlainObject} from './util';
import Panel from './panel';

class Pair {
  constructor(key, val, valTransformer) {
    this.key = key;
    this.val = val;
    this.valTransformer = valTransformer;
  }

  static create(key, val, valTransformer) {
    if (isPlainObject(val) || Array.isArray(val)) {
      return new ExpandablePair(key, val, valTransformer);
    }

    return new SimplePair(key, val, valTransformer);
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
    const valStr = super.getValInnerMarkup();
    // Truncate the array / object preview using val-inner class.
    // eg. { key: "val" } -> {<span class="val-inner">key: "val"</span>}
    const valMatch = valStr.match(/^([{[])(.*)([}\]])$/);
    return `${valMatch[1]}<span class="val-inner">${valMatch[2]}</span>${valMatch[3]}`;
  }

  createTagInnerMarkup() {
    return `<a class="expander" href="#">${super.createTagInnerMarkup()}</a>`;
  }

  render() {
    super.render();
    this.el
      .querySelector('.expander')
      .addEventListener('click', evt => this.onKeyClick(evt));
  }

  get expanded() {
    return this.el.classList.contains('expanded');
  }

  expand() {
    // Open new panel
    Panel.renderToEl(this.el, {
      data: this.val,
      valTransformer: this.valTransformer
    });
    this.el.classList.add('expanded');
  }

  collapse() {
    this.el.querySelectorAll('.panel').forEach(e => e.remove());
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
