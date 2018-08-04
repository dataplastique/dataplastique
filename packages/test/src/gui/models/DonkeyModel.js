import { Model } from 'dataplastique';

/**
 * Donkey model.
 */
export default class DonkeyModel extends Model {
	static model() {
		return {
			name: String
		};
	}
}
