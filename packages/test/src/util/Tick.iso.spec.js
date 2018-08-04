import { Tick } from '@dataplastique/util';

export default function() {
	describe('util.Tick', function likethis() {
		let TYPE = 'tick-tock';

		it('should trigger on tick', done => {
			Tick.add(TYPE, {
				ontick: tick => {
					expect(tick.type).toBe(TYPE);
					Tick.remove(TYPE, this);
					done();
				}
			}).dispatch(TYPE);
		});

		it('should trigger on time', done => {
			Tick.add(TYPE, {
				ontick: tick => {
					expect(tick.type).toBe(TYPE);
					Tick.remove(TYPE, this);
					done();
				}
			}).dispatch(TYPE, 100);
		});

		it('should trigger once', done => {
			let counter = 0;
			Tick.one(TYPE, {
				ontick: tick => {
					if (++counter < 3) {
						Tick.dispatch(TYPE);
					}
				}
			}).dispatch(TYPE);
			setTimeout(() => {
				expect(counter).toBe(1);
				done();
			}, 200);
		});

		it('should also remove', done => {
			let success = true,
				handler = {
					ontick: () => {
						success = false;
					}
				};
			Tick.add(TYPE, handler)
				.remove(TYPE, handler)
				.dispatch(TYPE);
			setTimeout(() => {
				expect(success).toBe(true);
				done();
			});
		});

		it('should invoke on timeout', done => {
			Tick.time(function() {
				expect(true).toBe(true);
				done();
			}, 5);
		});

		it('should start and stop', done => {
			let counter = 0;
			Tick.add(TYPE, {
				ontick: tick => {
					if (++counter === 3) {
						Tick.stop(TYPE);
					}
				}
			}).start(TYPE, 5);
			setTimeout(() => {
				expect(counter).toBe(3);
				done();
			}, 200);
		});
	});
}
