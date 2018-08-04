# Stateless "functional" API

Something like this would come in handy.


```js
@import edbml from './redering.edbml.js';

channeling('my-element', ({ script, dom, event, css }) => ({
	onconstruct() {
		script.load(edbml);
	},
	onattach() {
		script.run(dom.q('#defaultcontent'));
	}
}));

channeling('my-element', MySpirit, ({ script, dom, event, css }) => ({
	onconstruct() {
		script.load(edbml);
	},
	onattach() {
		script.run(dom.q('#defaultcontent'));
	}
}));
