import '@app';
import './styles/index.scss';

const context = require.context('./images/content', false, /^\.\/(product|category)_/);
context.keys().forEach(context);
