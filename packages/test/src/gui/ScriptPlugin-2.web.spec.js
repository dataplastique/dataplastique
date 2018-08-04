import { Spirit, boot } from 'dataplastique';
import expect_equalnode from './edbml/expect-equalnode.edbml.js';

/*
 * Declare structures to match expected DOM subtree after update operation.
 * @param {string} id Used to calculate the `data-plastique-id` (so that we can 
 *                    simply copy-paste these strings from the EDBML file and 
 *                    not worry about replacing all these `guid` attributes).
 * @returns {Array<Element>}
 */
function getscenarios(id) {
	return [
		// Scenario 0
		`<div guid="table">
			<div guid="row0">
				<div guid="A"></div>
				<div guid="B"></div>
				<div guid="C"></div>
				<div guid="D"></div>
				<div guid="E"></div>
				<div guid="F"></div>
				<div guid="G"></div>
			</div>
			<div guid="row1">
				<div guid="cell11"></div>
				<div guid="cell12"></div>
				<div guid="cell13"></div>
			</div>
			<div guid="row2">
				<div guid="cell21"></div>
				<div guid="cell22"></div>
				<div guid="cell23"></div>
			</div>
			<div guid="row3">
				<div guid="cell31">Cell is here</div>
				<div guid="cell32"></div>
				<div guid="cell33"></div>
			</div>
			<div guid="row4">
				<div guid="cell41"></div>
				<div guid="cell42"></div>
				<div guid="cell43"></div>
			</div>
			<div guid="row5">
				<div guid="cell51"></div>
				<div guid="cell52"></div>
				<div guid="cell53"></div>
			</div>
		</div>`,

		// Scenario 1
		`<section>Section was added</section>
		<div guid="table" class="addedclassname">
			<div guid="row0">
				<div guid="A"></div>
				<div guid="B"></div>
				<div guid="C"></div>
				<div guid="D"></div>
				<div guid="E"></div>
				<div guid="F"></div>
				<div guid="G"></div>
			</div>
			<div guid="row1">
				<div guid="cell11"></div>
				<div guid="cell12">Text was added</div>
				<div guid="cell13">Text was added</div>
			</div>
			<div guid="row2">
				<div guid="cell21"></div>
				<div guid="cell22"></div>
				<div guid="cell23">Text was added</div>
			</div>
			<div guid="row3">
				<div guid="cell32"></div>
				<div guid="cell31">Cell was moved</div>
				<div guid="cell33"></div>
			</div>
			<section>
				<div guid="row4">
					<div guid="cell41"></div>
					<div guid="cell42"></div>
					<div guid="cell43"></div>
					<div guid="cell44">Cell was added</div>
					<div guid="cell45">Cell was added</div>
				</div>
				<div guid="row5">
					<div guid="cell51"></div>
					<div guid="cell52"></div>
					<div guid="cell53"></div>
				</div>
			</section>
		</div>`,

		// Scenario 2
		`<div guid="table">
			<div guid="row1">
				<div guid="cell11"></div>
				<div guid="cell12">Text was changed</div>
				<div guid="cell13">
					<div guid="row5">
						<section>
							<div guid="cell51"></div>
							<div guid="cell52"></div>
							<div guid="cell53"></div>
						</section>
					</div>
				</div>
			</div>
			<div guid="row2">
				<div guid="cell21">
					<div guid="cell23">Text was changed and cell was moved</div>
				</div>
				<div guid="cell22"></div>
			</div>
			<div guid="row3">
				<div guid="cell31">Cell was moved back</div>
				<div guid="cell32"></div>
				<div guid="cell33"></div>
			</div>
			<div guid="row4">
				<div guid="cell41"></div>
				<div guid="cell42"></div>
				<div guid="cell43"></div>
			</div>
		</div>`,

		// Scenario 3
		`<div guid="table" title="addedtitle">
			<div guid="row2">
				<div guid="cell21">
					<div guid="cell23">
						<div guid="row1">
							<div guid="cell11">Row was moved</div>
							<div guid="cell12"></div>
							<div guid="cell13">
								<div guid="row5">
									<div guid="cell51">
										<div guid="row3">
											<div guid="cell31">Row was moved</div>
											<section>
												<div guid="cell32"></div>
												<div guid="cell33"></div>
											</section>
											<section></section>
										</div>
										<div guid="row4">
											<div guid="cell41"></div>
											<div guid="cell42">
												<div guid="cell22">Cell was moved</div>
											</div>
											<div guid="cell43"></div>
										</div>
									</div>
									<div guid="cell52"></div>
									<div guid="cell53"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`,

		// Scenario 4
		`<div guid="row1" class="addedclassname">
			<div guid="row2">
				<div guid="row3">
					<div guid="row4">
						<div guid="row5">
							<div guid="table">
								<div guid="cell11">
									<div guid="cell51"></div>
									<div guid="cell52"></div>
									<div guid="cell53"></div>
								</div>
							</div>
							<section>
								<div guid="cell12"></div>
								<div guid="cell13"></div>
								<div guid="cell21"></div>
								<div guid="cell22"></div>
								<div guid="cell23"></div>
								<div guid="cell31"></div>
								<div guid="cell32"></div>
								<div guid="cell33"></div>
							</section>
						</div>	
					</div>	
				</div>	
			</div>
		</div>
		<div guid="cell41"></div>
		<div guid="cell42"></div>
		<div guid="cell43"></div>`,

		// Scenario 5
		`<article>
			<section class="head">
				<div class="docs">
					<h1><p>Collection</p></h1>
				</div>
				<pre class="code"></pre>
			</section>
			<section data-line="0" class="intro" >
				<div class="docs">
					<div class="desc"></div>
				</div>
				<pre class="code">
				</pre>
			</section>
			<section data-line="2" >
				<div class="docs">
					<div class="desc">
						<p>Base collection.</p>
					</div>
				</div>
				<pre class="code">
				</pre>
			</section>
		</article>`,

		// Scenario 6
		`<article>
			<section class="head">
				<div class="docs">
					<h1><p>Model</p></h1>
				</div>
				<pre class="code"></pre>
			</section>
			<section data-line="0" class="intro" >
				<div class="docs">
					<div class="desc"></div>
				</div>
				<pre class="code">
				</pre>
			</section>
			<section data-line="2" >
				<div class="docs">
					<div class="desc">
						<p>Base model.</p>
					</div>
				</div>
				<pre class="code">
				</pre>
			</section>
		</article>`
	].map(html => {
		const temp = document.createElement('template');
		temp.innerHTML = html.replace(/guid="/g, `data-plastique-id="${id}-`);
		return temp.content;
	});
}

/**
 * Extract child elements.
 * @param {Node} node
 * @returns {Array<Element>}
 */
function elements(node) {
	return [...node.childNodes].filter(n => n.nodeType === Node.ELEMENT_NODE);
}

/**
 * Remove empty textnodes and sync class attribute before comparing DOM.
 * @param {Element} elm
 * @returns {Element}
 */
function strip(elm) {
	const empty = [];
	[...elm.childNodes].forEach(node => {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
				strip(node);
				break;
			case Node.TEXT_NODE:
				if (node.data.trim() === '') {
					empty.push(node);
				}
				break;
		}
	});
	empty.forEach(node => node.remove());
	if (elm.className === '') {
		elm.removeAttribute('class');
	}
	return elm;
}

/**
 * Confirm that the spirits DOM subtree matches the given scenario,
 * @param {Spirit} spirit
 * @param {Array<Element>} scenarios
 * @param {number} key
 */
function expectequalnodes(spirit, scenarios, key) {
	const sources = elements(spirit.element).map(strip);
	const targets = elements(scenarios[key]).map(strip);
	const similar = sources.length === targets.length;
	if (!similar) {
		console.error(
			`Broken scenario ${key}: Unexpected elements count: `,
			`Expected ${targets.length}, found ${sources.length}`
		);
	}
	expect(similar).toBe(true);
	sources.forEach((source, index) => {
		const target = targets[index];
		const equals = source.isEqualNode(target);
		if (!equals) {
			console.error(`Broken scenario ${key}: Unexpected DOM structure
				Expected\n${target.outerHTML},
				Found\n${source.outerHTML}`);
		}
		expect(equals).toBe(true);
	});
}

/**
 * Confirm that all identified elements are the same as they used to be.
 * @param {Spirit} spirit
 * @param {number} key
 */
function expectrecycleids(spirit, key) {
	const olds = expectrecycleids.oldnodes;
	const news = spirit.dom.guids();
	expectrecycleids.oldnodes = news;
	if (olds) {
		olds.forEach(elm => {
			const guid = elm.getAttribute('data-plastique-id');
			if (spirit.dom.guid(guid)) {
				const same = news.includes(elm);
				if (!same) {
					console.error(`Broken scenario ${key}: False identity in ${guid}`);
				}
				expect(same).toBe(true);
			}
		});
	}
}

/**
 *
 */
export default function() {
	/*
	 * Further ScriptPlugin specs.
	 */
	describe('gui.ScriptPlugin (part 2)', function likethis() {
		it('must boot before we begin', () => {
			boot();
			expect(true).toBe(true);
		});

		it('matches expected output', () => {
			const spirit = Spirit.summon();
			const scenes = getscenarios(spirit.$id);
			spirit.script.load(expect_equalnode);
			[...Array(scenes.length).keys()].forEach(key => {
				spirit.script.run(key);
				expectequalnodes(spirit, scenes, key);
				expectrecycleids(spirit, scenes, key);
			});
		});
	});
}
