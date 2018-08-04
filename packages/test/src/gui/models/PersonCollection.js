import { Collection } from 'dataplastique';
import PersonModel from './DonkeyModel';

/**
 * Person collection.
 */
export default class PersonCollection extends Collection {
	static collection() {
		return PersonModel;
	}
}
