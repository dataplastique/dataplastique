import { Tick } from '@dataplastique/util';

export default function() {
	describe('util.Tick', function likethis() {
		it('should trigger on frame', done => {
			Tick.nextFrame(timestamp => {
				expect(timestamp).toEqual(jasmine.any(Number));
				done();
			});
		});
	});
}
