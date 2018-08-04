/**
 * A non-bubbling kind of event that
 * exposes the lifecycle of a spirit.
 * TODO: Fountain of Life (optimize)
 */
export default class Life {
	/**
	 * @param {string} type
	 * @param {Spirit} target
	 */
	constructor(type, target) {
		this.target = target;
		this.type = type;
	}
}
