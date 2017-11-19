import marked from 'marked';
import TerminalRenderer from 'marked-terminal';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

export default function markdown(a) {
  const spaces = a.match(/\s*$/);
  return marked(a).trim() + spaces;
}
