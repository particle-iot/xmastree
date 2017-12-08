import { createFactory } from 'react';
import createClass from 'create-react-class';
import { div, h3 } from 'react-dom-factories';
import PropTypes from 'prop-types';
import ClearBtn from '../buttons/clear.js';
import Devices from './device-list.js';

const clearBtn = createFactory(ClearBtn);
const devices = createFactory(Devices);


export default createClass({
	displayName: 'DevicePicker',
	propTypes: {
		viewname: PropTypes.string.isRequired,
		device: PropTypes.object,
		deviceList: PropTypes.array,
		onDeviceSelected: PropTypes.func.isRequired,
		onDeviceCleared: PropTypes.func.isRequired
	},
	renderActiveDevice: function(){
		const { viewname, device, onDeviceCleared } = this.props;
		const className = `${viewname}-device`;

		return div({ className },
			h3(null, `connected: ${device.name}`),
			clearBtn({ onClick: onDeviceCleared })
		);
	},
	renderDevices: function(){
		const { viewname, deviceList, onDeviceSelected } = this.props;

		if (!deviceList){
			return false;
		}
		return devices({ viewname, deviceList, onDeviceSelected });
	},
	render: function(){
		const { viewname, device } = this.props;
		const className = `${viewname}-device-picker`;

		return div({ className },
			(device
				? this.renderActiveDevice()
				: this.renderDevices())
		);
	}
});
