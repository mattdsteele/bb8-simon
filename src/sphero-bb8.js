import 'skatejs-web-components';
import { Component, emit } from 'skatejs';

class SpheroBB8 extends Component {
  set color({ red = 0, green = 0, blue = 0 }) {
		console.log(`Setting color ${red} ${green} ${blue}`);
		if (this.state.busy) {
			// Return if another operation pending
			return Promise.resolve();
		}
		this.state.busy = true;
		const did = 0x02; // Virtual device ID
		const cid = 0x20; // Set RGB LED Output command
		// Color command data: red, green, blue, flag
		const data = new Uint8Array([red, green, blue, 0]);
		this.sendCommand(did, cid, data).then(() => {
			this.state.busy = false;
		})
		.catch(exception => {
			console.log(exception);
		});
	};

  // Code based on https://github.com/WebBluetoothCG/demos/blob/gh-pages/bluetooth-toy-bb8/index.html
	sendCommand (did, cid, data) {
		// Create client command packets
		// API docs: https://github.com/orbotix/DeveloperResources/blob/master/docs/Sphero_API_1.50.pdf
		// Next sequence number
		const seq = this.state.sequence & 0xFF;
		this.state.sequence += 1;
		// Start of packet #2
		let sop2 = 0xFC;
		sop2 |= 1; // Answer
		sop2 |= 2; // Reset timeout
		// Data length
		const dlen = data.byteLength + 1;
		const sum = data.reduce((a, b) => {
			return a + b;
		});
		// Checksum
		const chk = ((sum + did + cid + seq + dlen) & 0xFF) ^ 0xFF;
		const checksum = new Uint8Array([chk]);
		const packets = new Uint8Array([0xFF, sop2, did, cid, seq, dlen]);
		// Append arrays: packet + data + checksum
		const array = new Uint8Array(packets.byteLength + data.byteLength + checksum.byteLength);
		array.set(packets, 0);
		array.set(data, packets.byteLength);
		array.set(checksum, packets.byteLength + data.byteLength);
		console.debug('Sending', array);
		return this.controlCharacteristic.writeValue(array).then(() => {
			console.debug('Command write done.');
		});
	}

  // Code based on https://github.com/WebBluetoothCG/demos/blob/gh-pages/bluetooth-toy-bb8/index.html
	async connect() {
    this.state = {
      aim: false,
      busy: false,
      sequence: 0
    };

		if (!navigator.bluetooth) {
			console.log('Web Bluetooth API is not available.\n' +
				'Please make sure the Web Bluetooth flag is enabled.');
			return;
		}

		console.log('Requesting BB-8…');

		const serviceA = '22bb746f-2bb0-7554-2d6f-726568705327';
		const serviceB = '22bb746f-2ba0-7554-2d6f-726568705327';
		const controlCharacteristicId = '22bb746f-2ba1-7554-2d6f-726568705327';
		const antiDosCharacteristicId = '22bb746f-2bbd-7554-2d6f-726568705327';
		const txPowerCharacteristicId = '22bb746f-2bb2-7554-2d6f-726568705327';
		const wakeCpuCharacteristicId = '22bb746f-2bbf-7554-2d6f-726568705327';
		const device = await navigator.bluetooth.requestDevice({
			'filters': [{ 'namePrefix': ['BB'] }],
			'optionalServices': [
				serviceA,
				serviceB
			]
		});

    try {
      const server = await device.gatt.connect();
      this.gattServer = server;
      const radioService = await this.gattServer.getPrimaryService(serviceA);
      this.radioService = radioService;
      // Get Anti DOS characteristic
      const characteristic = await this.radioService.getCharacteristic(antiDosCharacteristicId);
      // Send special string
      const  bytes = new Uint8Array('011i3'.split('').map(c => c.charCodeAt()));
      await characteristic.writeValue(bytes);
      console.log('Anti DOS write done.');
      // Get TX Power characteristic
      const txPowerChar = await this.radioService.getCharacteristic(txPowerCharacteristicId);
      console.log('> Found TX Power characteristic');
      const array = new Uint8Array([0x07]);
      await txPowerChar.writeValue(array);
      console.log('TX Power write done.');
      // Get Wake CPU characteristic
      const wakeCpuChar = await this.radioService.getCharacteristic(wakeCpuCharacteristicId);
      console.log('> Found Wake CPU characteristic');
      const wakeCpuArr = new Uint8Array([0x01]);
      await wakeCpuChar.writeValue(wakeCpuArr);
      console.log('Wake CPU write done.');
      // Get robot service
      const robotService = await this.gattServer.getPrimaryService(serviceB)
      // Commands are sent to the robot service
      this.robotService = robotService;
      // Get Control characteristic
      const controlChar = await this.robotService.getCharacteristic(controlCharacteristicId);
      console.log('> Found Control characteristic');
      // Cache the characteristic
      this.controlCharacteristic = controlChar;
    } catch(exception) {
			console.log(exception);
      throw exception;
    }
  }
}

customElements.define('sphero-bb8', SpheroBB8);
