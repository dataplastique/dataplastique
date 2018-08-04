/**
 * Working with classes.
 */
export default class Class {
	/**
	 * Child class inherits from (or is equal to) Parent class?
	 * @param {Function} Child (constructor)
	 * @param {Function} Parent (constructor)
	 * @returns {boolean}
	 */
	static inherits(Child, Parent) {
		let does = false;
		while (Child && Child.name !== 'Empty' && !does) {
			if (Child === Parent) {
				does = true;
			} else {
				Child = Object.getPrototypeOf(Child);
			}
		}
		return does;
	}
}
