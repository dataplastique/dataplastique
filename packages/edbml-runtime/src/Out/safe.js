/*
 * Creates a basic (UNSAFE) map for escaping 
 * text that goes into HTML attribute context.
 */
const safemap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

/*
 * (UNSAFE) regular expression to figure out some basic 
 * entities that should be escaped in HTML attributes.
 */
const unsafexp = /[&<>'"]/g;

/**
 * Escape potentially unsafe string for use in HTML attribute context.
 * TODO(jmo@): This is UNSAFE! We'll need to look at the attribute name!
 * @see https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.232_-_Attribute_Escape_Before_Inserting_Untrusted_Data_into_HTML_Common_Attributes
 * @param {string} name TODO: This should determine how to escape the value!
 * @param {string} value
 * @returns {string}
 */
export function safeattr(name, value) {
	return String(value).replace(unsafexp, c => safemap[c]);
}
