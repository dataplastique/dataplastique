import { Spirit } from '@dataplastique/gui';
import { isFunction } from '@dataplastique/util';

const ASCENDING = 'ascending';
const DESCENDING = 'descending';
const CONTINUE = 0;
const STOP = 1;
const SKIP = 2;
const SKIP_CHILDREN = 4;

/**
 * Crawling up and down the DOM.
 * TODO: Support SKIP directive.
 * TODO: method `descendBelow` and 'ascendAbove' to skip start element
 */
export default class Crawler {
	/**
	 * Constructor.
	 * @param {string} type Identifies the crawler
	 */
	constructor(type) {
		this.type = type || null;
		this.direction = null;
		this.global = false;
		this._stopped = false;
	}

	/**
	 * Crawl DOM ascending.
	 * @param {Spirit|Node} start
	 * @param {CrawlerClient} client
	 */
	ascend(start, client) {
		this._stopped = false;
		this.direction = ASCENDING;
		let onelm = Type.isFunction(client.onelement);
		let onspi = Type.isFunction(client.onspirit);
		let elm = Spirit.is(start) ? start.element : start;
		crawlascending(this, elm, client, onelm, onspi);
	}

	/**
	 * Crawl DOM ascending, transcend into ancestor frames.
	 * @param {Spirit|Node} start
	 * @param {CrawlerClient} client
	 */
	ascendGlobal(start, client) {
		this.global = true;
		this.ascend(start, client);
		this.global = false;
	}

	/**
	 * Crawl DOM descending.
	 * @param {Spirit|Node} start
	 * @param {CrawlerClient} client
	 */
	descend(start, client) {
		this._stopped = false;
		this.direction = DESCENDING;
		let onelm = Type.isFunction(client.onelement);
		let onspi = Type.isFunction(client.onspirit);
		let elm = Spirit.is(start) ? start.element : start;
		elm = elm.nodeType === Node.DOCUMENT_NODE ? elm.documentElement : elm;
		crawldescending(this, elm, client, onelm, onspi, true);
	}

	/**
	 * Crawl DOM descending, transcend into iframes.
	 * @param {Spirit|Node} start
	 * @param {CrawlerClient} client
	 */
	descendGlobal(start, client) {
		this.global = true;
		this.descend(start, client);
		this.global = false;
	}
}

/**
 * Interface constants.
 * TODO: As constants :/
 */
Object.assign(Crawler, {
	ASCENDING: ASCENDING,
	DESCENDING: DESCENDING,
	CONTINUE: CONTINUE,
	STOP: STOP,
	SKIP: SKIP,
	SKIP_CHILDREN: SKIP_CHILDREN
});

// Scoped ......................................................................

/**
 * Iterate nodes descending.
 * @param {Crawler} crawler
 * @param {Element} elm
 * @param {CrawlerClient} client
 * @param {boolean} onelm
 * @param {boolean} onspi
 * @param {boolean} [start]
 */
function crawldescending(crawler, elm, client, onelm, onspi, start) {
	let next;
	let directive = handleElement(crawler, elm, client, onelm, onspi);
	switch (directive) {
		case STOP:
			crawler._stopped = true;
			break;
		case CONTINUE:
		case SKIP_CHILDREN:
			if (directive !== SKIP_CHILDREN) {
				if (elm.childElementCount) {
					crawldescending(crawler, elm.firstElementChild, client, onelm, onspi);
				} else if (crawler.global && elm.localName === 'iframe') {
					console.log('TODO: transcend crawler descending');
					/*
					 * TODO: Make iframe transcend work even without spirit support.
					 *
					if (IframeSpirit.is(elm)) {
						win = elm.ownerDocument.defaultView;
						if (Type.isFunction(client.transcend)) {
							client.transcend(
								spirit.contentWindow, 
								spirit.xguest, 
								spirit.$instanceid
							);
						}
					}
					*/
				}
			}
			if (!crawler._stopped) {
				if (!start && (next = elm.nextElementSibling)) {
					crawldescending(crawler, next, client, onelm, onspi);
				}
			}
			break;
	}
}

/**
 * Iterate nodes ascending.
 * @param {Crawler} crawler
 * @param {Element} elm
 * @param {CrawlerClient} client
 * @param {boolean} onelm
 * @param {boolean} onspi
 */
function crawlascending(crawler, elm, client, onelm, onspi) {
	do {
		if (elm.nodeType === Node.DOCUMENT_NODE) {
			console.log('TODO: transcend crawler ascending');
			elm = null;
		}
		if (elm) {
			let directive = handleElement(crawler, elm, client, onelm, onspi);
			switch (directive) {
				case STOP:
					elm = null;
					break;
				default:
					elm = elm.parentNode;
					break;
			}
		}
	} while (elm);
}

/**
 * Handle element and/or spirit for crawler client.
 * @param {Crawler} crawler
 * @param {Element} element
 * @param {CrawlerClient} client
 * @param {boolean} onelm
 * @param {boolean} onspi
 * @returns {number} directive
 */
function handleElement(crawler, element, client, onelm, onspi) {
	let spirit;
	let directive = CONTINUE;
	if (client) {
		if (onelm) {
			directive = client.onelement(element);
		}
		if (!directive && (spirit = Spirit.get(element))) {
			directive = spirit.oncrawler(crawler);
			if (!directive && onspi) {
				directive = client.onspirit(spirit);
			}
		}
	}
	return directive || CONTINUE;
}
