import { Model, plugin, Plugin } from 'dataplastique';

class MyPlugin extends Plugin {
	get $observable() {
		return true;
	}
}
class MyOtherPlugin extends Plugin {
	onconstruct() {
		super.onconstruct();
		this.host.specialprop = true;
	}
	static lazy() {
		return false;
	}
}
@plugin('myplugin', MyPlugin)
@plugin('myotherplugin', MyOtherPlugin)
class MyModel extends Model {}

/**
 * Start testing.
 */
export default function() {
	/*
	 * Plugin specs.
	 * TODO: Test that the plugin is indeed wrapped by the proxy.
	 */
	describe('edb.Plugin', function likethis() {
		const hasproxy = plugin => !!plugin.$CONFIRM_PROXY;

		/*
		it('has proxies all the way down', () => {
			const mymodel = new MyModel();
			expect(hasproxy(mymodel.myplugin)).toBe(true);
		});
		it('is not proxified', () => {
			const mymodel = new MyModel();
			expect(hasproxy(mymodel.myotherplugin)).toBe(false);
		});
		*/
		it('can newup the plugin on demand', () => {
			const myplugin = new MyModel().myplugin; // demanded just now
			expect(MyPlugin.is(myplugin)).toBe(true);
		});
		it('correctly assigns the host', () => {
			const mymodel = new MyModel();
			expect(mymodel.myplugin.host).toBe(mymodel);
		});
		it('will newup non-lazy plugins automatically', () => {
			expect(new MyModel().specialprop).toBe(true);
		});
	});

	console.log('TODO: Plugin can protect itself from accidental assignments');

	/*
	describe('Plugin can protect itself from accidental assignments', () => {

		it('will throw upon registering twice for the same prefix', () => {
			try {
				MyModel.plugin('myplugin', MyOtherPlugin);
			} catch (exception) {
				expect(exception.message).toContain('is assigned');
			}
		});

		it('will however allow user to override registered prefix', () => {
			MyModel.pluginOverride('myplugin', MyOtherPlugin);
			let myplugin = new MyModel().myplugin;
			expect(MyOtherPlugin.is(myplugin)).toBe(true);
		});

		it('will throw upon assignement to a prefix (on an instance)', () => {
			let model = new MyModel();
			try {
				model.myplugin = '23';
			} catch (exception) {
				expect(exception.message).toContain('is reserved');
			}
		});
	});
	*/
}
