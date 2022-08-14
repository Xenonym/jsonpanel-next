import {isPlainObject} from './util.js';
import Panel from './panel.js';

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

export default Pair.create;
