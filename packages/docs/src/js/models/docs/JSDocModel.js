import DocModel from './DocModel';
import { Model } from 'dataplastique';
import { Collection } from 'dataplastique';

/**
 * JavaScript document.
 */
export default class JSDocModel extends DocModel {
	type = 'text/javascript';
	static model() {
		return {
			title: String,
			chapters: Collection.$of(ChapterModel)
		};
	}
}

// Scoped ......................................................................

/**
 * Hello.
 */
class ChapterModel extends Model {
	static model() {
		return {
			title: String,
			tabs: String,
			sections: Collection.$of(SectionModel)
		};
	}
}

/**
 * Hello.
 */
class SectionModel extends Model {
	static model() {
		return {
			line: Number,
			tabs: String,
			head: String,
			desc: String,
			code: String,
			tags: Collection.$of(TagModel)
		};
	}
}

/**
 * Modelling a JSDoc `@whatever` statement.
 */
class TagModel extends Model {
	static model() {
		return {
			text: String,
			desc: String,
			name: String,
			type: String
		};
	}
}
