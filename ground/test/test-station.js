import test from 'unit.js';
import mockSpawn from 'mock-spawn';
import child_process from 'child_process';

let mySpawn = mockSpawn();
child_process.spawn = mySpawn;

mySpawn.sequence.add(mySpawn.simple(1, '', 'No supported devices found'));
mySpawn.sequence.add(mySpawn.simple(0, '', 'Found 1 device(s)'));

import { Station } from '../lib/station';

describe('lib/station', () => {
	it('should test checkRadio', done => {
    var signal = 'SIGTERM', proc;
    mySpawn.setSignals({SIGTERM:true}); //Allows proc.kill

    let station = new Station();
    station.checkRadio()
      .then(test.value(station.radioDevConnected).isFalse())
      .then(station.checkRadio())
      .then( () => { test.value(station.radioDevConnected).isTrue()})
      .then(done());
	});
});
