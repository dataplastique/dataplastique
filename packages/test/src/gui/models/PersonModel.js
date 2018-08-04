import { Model } from 'dataplastique';
import DonkeyModel from './DonkeyModel';

/**
 * Person model.
 */
export default class PersonModel extends Model {
	static model(map) {
		return {
			name: String,
			age: Number,
			married: Boolean,
			pet: DonkeyModel
		};
	}
}
