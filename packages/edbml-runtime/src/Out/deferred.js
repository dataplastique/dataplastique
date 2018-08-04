/*
 * The EDBML compiler has converted all the "namespace prefixed" attributes 
 * to these other attributes so we don't have to deal with the lack of HTML 
 * case sensitivity (and can skip proper namespace declarations in XHTML).
 */
const [EVENTS, ELEMENTS, SPIRITS] = [
	'data-plastique-on', // matches `on:type`
	'data-plastique-elm', // matches `do:elm`
	'data-plastique-gui' // matches `do:gui`
];

/**
 * Map deferred calls into separate domains based on element attributes.
 * TODO: Return more `null` instead of these empty Maps when not needed!
 * @param {Map<string, Element>} guids - Elements with a specified `guid`
 * @param {Map<string, Function>} defers - All the deferred functions we know
 * @returns {Array<Map>} - mapping events, elements and spirits in that order
 */
export function mapdefer(guids, defers) {
	guids = translate(guids);
	return [
		isolateevents(isolate(EVENTS, guids), defers),
		isolate(ELEMENTS, guids, defers),
		isolate(SPIRITS, guids, defers)
	];
}

// Scoped ......................................................................

/**
 * Quickly identifies reserved HTML attributes.
 * @type {Set<string>}
 */
const reserved = new Set([EVENTS, ELEMENTS, SPIRITS]);

/**
 * Remove from element all reserved attributes and transfer them to a Map.
 * @param {Map<string, Element>} guids
 * @returns {Map<string, Map<string, string>>}
 */
function translate(guids) {
	const result = new Map();
	guids.forEach((elm, guid) => extractall(elm, guid, result));
	return result;
}

/**
 * Transfer reserved attribute of given type to unique Map.
 * @param {string} type - Reserved attribute name
 * @param {Map<string, Map<string, string>>} guids
 * @param {Map<string, Function>} [defers]
 * @returns {Map<string, Function|string>}
 */
function isolate(type, guids, defers) {
	const result = new Map();
	guids.forEach((map, guid) => {
		if (map.has(type)) {
			const key = map.get(type);
			const val = defers ? defers.get(key) : key;
			result.set(guid, val);
		}
	});
	return result;
}

/**
 * @param {Element} elm
 * @param {string} guid
 * @param {Map<string, Map>} result
 */
function extractall(elm, guid, result) {
	const atts = elm.attributes;
	for (let i = atts.length - 1; i >= 0; i--) {
		extractone(elm, guid, result, atts.item(i));
	}
}

/**
 * @param {Element} elm
 * @param {string} guid
 * @param {Map<string, Map>} result
 * @param {Attr} att
 */
function extractone(elm, guid, result, { name, value }) {
	if (reserved.has(name)) {
		recordone(guid, result, name, value);
		elm.removeAttribute(name);
	}
}

/**
 * @param {string} guid
 * @param {Map<string, Map>} result
 * @param {string} name
 * @param {string} value
 */
function recordone(guid, result, name, value) {
	getrecord(guid, result).set(name, value);
}

/**
 * @param {string} guid
 * @param {Map<string, Map>} result
 * @returns {Map}
 */
function getrecord(guid, result) {
	return result.get(guid) || result.set(guid, new Map()).get(guid);
}

// Event callbacks .............................................................

/**
 * From the map of elements with deferred callbacks, find the
 * ones that deal with events and transfer them to a new map.
 * Note that the `data-plastique-on` attribute may index more
 * than one event, so we will need to parse them individually.
 * @param {Map<string, string>} guids
 * @param {Map<string, Function>} defers
 * @returns {Map<string, Map<string, Function>>}
 */
function isolateevents(guids, defers) {
	if (guids.size) {
		const lookup = ([type, key]) => [type, change(key)];
		const change = key => changefun(defers.get(key));
		guids.forEach((key, guid) => {
			guids.set(guid, new Map(splitup(key, defers, lookup)));
		});
	}
	return guids;
}

/**
 * The attribute is indexing multiple events separated by `;`.
 * @param {string} string
 * @param {Map<string, Function>} defers
 * @param {Function} lookup
 * @returns {Array<Array<string, Function>>}
 */
function splitup(string, defers, lookup) {
	return string
		.split(';')
		.map(sliceup)
		.map(lookup);
}

/**
 * The event listeners type and key are separated by `:`.
 * @param {string} part
 * @returns {Array<string, string>}
 */
function sliceup(part) {
	const i = part.lastIndexOf(':');
	return [part.substring(0, i), part.substring(i + 1)];
}

/**
 * Create callback function with special business logic for form elements.
 * Note that this special business logic is dependant on some supporting
 * code going on inside the project `dataplastique-edbml` (so at build time).
 * TODO: The `Parser.js` should figure out if this is a form field
 * TODO: always relay the (potential) CustomEvent data
 * TODO: Further special business logic for select elements
 * @param {Function} fun
 * @returns {Function}
 */
function changefun(fun) {
	return function(e) {
		if (/input|textarea/.test(this.localName)) {
			fun(e, this.value, this.checked);
		} else {
			fun(e);
		}
	};
}
