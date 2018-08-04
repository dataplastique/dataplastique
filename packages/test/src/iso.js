import key from './util/Key.iso.spec';
import mapping from './util/Mapping.iso.spec';
import imapping from './util/IMapping.iso.spec';
import tick from './util/Tick.iso.spec';
import type from './util/Type.iso.spec';
import model from './edb/Model.iso.spec';
import model_proxy from './edb/Model.proxy.iso.spec';
import model_pipes from './edb/Model.pipes.iso.spec';
import model_output from './edb/Model.output.iso.spec';
import model_observers from './edb/Model.observers.iso.spec';
import collection from './edb/Collection.iso.spec';
import plugin from './edb/Plugin.iso.spec';
import tree from './edb/Tree.iso.spec';

[
	key,
	mapping,
	imapping,
	tick,
	type,
	model,
	model_proxy,
	model_pipes,
	model_output,
	model_observers,
	collection,
	plugin,
	tree
].forEach(test => test());
