import createClass from 'create-react-class';
import { div, h3, select, option } from 'react-dom-factories';
import PropTypes from 'prop-types';


export default createClass({
	displayName: 'DeviceList',
	propTypes: {
		viewname: PropTypes.string.isRequired,
		deviceList: PropTypes.array.isRequired,
		onDeviceSelected: PropTypes.func.isRequired
	},
	selectDevice: function(event){
		const { deviceList, onDeviceSelected } = this.props;
		const device = deviceList.find(d => d.id === event.target.value);

		if (device){
			onDeviceSelected(device);
		}
	},
	renderDevice: function(device){
		return option({ key: device.id, value: device.id }, device.name);
	},
	render: function(){
		const { viewname, deviceList } = this.props;
		const className = `${viewname}-device-list`;

		if (!deviceList.length){
			return div({ className: `${className} is-empty` },
				h3(null, 'you don\'t have any devices!')
			);
		}
		return div({ className },
			select({ onChange: this.selectDevice },
				option({ defaultValue: 'selected' }, 'select device'),
				deviceList.map(this.renderDevice)
			)
		);
	}
});
