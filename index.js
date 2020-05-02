const { Client } = require('tplink-smarthome-api');

const client = new Client();

client.startDiscovery({discoveryTimeout: 5000}).on('device-new', (device) => {
	device.cloud.getFirmwareList().then((fw) => {
		if (fw.fw_list.length == 1) {
			var url = fw.fw_list[0].fwUrl;
			console.log(device.alias + " needs an update: " + url);
			device.downloadFirmware(url);
			var fn = (result) => {
				if (result.ratio == 100 || result.status == 0) {
					console.log("done");
					return;
				}
				console.log(result.ratio);
				device.getDownloadState().then(fn);
			};
			device.getDownloadState().then(fn);
		}
	});
});

