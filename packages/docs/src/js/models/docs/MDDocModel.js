import DocModel from './DocModel';

/**
 * Markdown document.
 */
export default class MDDocModel extends DocModel {
	type = 'text/markdown';
	static model() {
		return {
			title: String,
			markup: String
		};
	}
}
