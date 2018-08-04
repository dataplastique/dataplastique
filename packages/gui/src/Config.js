import { Model } from '@dataplastique/edb';
import { ConfigurationError } from '@dataplastique/util';

let config = null;

/**
 * TODO: Figure out a way to make this thing universally accessible!
 * General configuration via `boot(options)`. We'll define this as a
 * Model in orer to automatically catch any typos and invalid properties.
 */
export default class Config extends Model {
	/**
	 * Configuration interface. The desciption of these props are given down below.
	 * @param {IMap} map
	 * @returns {Object}
	 */
	static model(map) {
		return {
			debug: Boolean, // TODO: default `false`
			xhtml: Boolean // TODO: default `false`
		};
	}

	/**
	 * Initialize configuration.
	 * @param {Object} object
	 */
	static init(object) {
		if (config) {
			throw new ConfigurationError('Configuration dysfunction');
		} else {
			config = new Config(object);
		}
	}

	/**
	 * Development mode enabled? Rarely the case in production, that is.
	 * @type {boolean}
	 */
	static get debug() {
		return config.debug;
	}

	/**
	 * Expect all EDBML scripts to return well-formed XHTML markup?
	 * This has no practical implications unless `debug` is enabled.
	 * @type {boolean}
	 */
	static get xhtml() {
		return config.xhtml;
	}
}
