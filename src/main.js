import Panel from './panel';
import {getObjectWithDefaults} from './util';

const defaultOptions = {
  selector: '#jsonpanel',
  data: {}
};

export default function jsonpanelNext(options) {
  options = getObjectWithDefaults(options, defaultOptions);
  return Panel.renderToEl(
    window.document.querySelector(options.selector),
    options
  );
}
