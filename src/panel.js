import createPair from './pair';

export default class Panel {
  constructor(options) {
    this.options = options;
  }

  get selector() {
    return this.options.selector;
  }

  get data() {
    return this.options.data;
  }

  get valTransformer() {
    return this.options.valTransformer;
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

  createListItem(key, val) {
    const pair = createPair(key, val, this.valTransformer);
    pair.render();
    return pair.el;
  }

  render() {
    const list = this.createListTag();
    Object.entries(this.data).forEach(([key, val]) => {
      list.append(this.createListItem(key, val));
    });

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
