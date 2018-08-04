import { Model } from 'dataplastique';

/**
 * Document base.
 */
export default class DocModel extends Model {
	static model() {
		return {
			type: String
		};
	}
}
