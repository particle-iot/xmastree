import createClass from 'create-react-class';
import { div, svg, path, circle } from 'react-dom-factories';
import PropTypes from 'prop-types';

const treePath = [
	'M178.3736,266.6372C330.7029,215.334,400.7476,111.9492,443.6215,0c41.8527,',
	'112.5609,103.9447,210.44,263.2991,266.6372 c-45.2641,79.61-125.5262,',
	'59.458-125.5262,59.458c37.7459,111.9136,146.5599,154.7357,204.8157,158.5641',
	'c-39.4447,113.3971-145.3579,99.1026-145.3579,99.1026c60.0324,133.3552,',
	'182.7635,165.013,244.4605,165.171 c-61.9263,190.7062-330.3419,',
	'171.7777-330.3419,171.7777V1000H330.3419v-79.2894c0,0-271.2534,',
	'20.152-330.3419-171.7777 c59.7002-2.6049,181.4373-26.1571,244.294-165.1759c0,',
	'0-107.8199,13.3054-145.1914-99.0976 c79.276-7.4989,167.3672-55.2149,',
	'204.3777-158.5997C303.4803,326.0597,225.177,346.5531,178.3736,266.6372z'
].join('');

const leds = [
	{ x: 240.796, y: 895.6725 },
	{ x: 120.4598, y: 856.4958 },
	{ x: 34.4168, y: 771.2712 },
	{ x: 143.8444, y: 733.1332 },
	{ x: 226.228, y: 660.4416 },
	{ x: 219.2247, y: 559.4818 },
	{ x: 133.2037, y: 507.5061 },
	{ x: 250.776, y: 443.796 },
	{ x: 321.4875, y: 346.7856 },
	{ x: 215.991, y: 279.8877 },
	{ x: 310.3477, y: 224.0984 },
	{ x: 385.8235, y: 151.6637 },
	{ x: 444.0701, y: 78.0965 },
	{ x: 501.111, y: 150.4451 },
	{ x: 577.6108, y: 224.0984 },
	{ x: 671.5803, y: 278.6471 },
	{ x: 566.7077, y: 346.0845 },
	{ x: 636.7181, y: 443.4106 },
	{ x: 754.3602, y: 503.1346 },
	{ x: 667.5721, y: 559.2578 },
	{ x: 662.0113, y: 660.4416 },
	{ x: 744.3509, y: 732.4303 },
	{ x: 853.6206, y: 771.7997 },
	{ x: 760.4459, y: 856.5435 },
	{ x: 645.9586, y: 896.6617 }
];


export default createClass({
	displayName: 'Tree',
	propTypes: {
		className: PropTypes.string,
		showLEDs: PropTypes.bool,
		LEDColor: PropTypes.string,
		LEDRadius: PropTypes.number,
		showBackground: PropTypes.bool,
		isDisconnected: PropTypes.bool,
		isAnimating: PropTypes.bool,
		isBusy: PropTypes.bool,
	},
	getDefaultProps: function(){
		return {
			className: '',
			showLEDs: true,
			LEDColor: '#000',
			LEDRadius: 12.8466,
			showBackground: false,
			isDisconnected: false,
			isAnimating: false,
			isBusy: false
		};
	},
	getClassName: function(){
		const { isDisconnected, isAnimating, isBusy } = this.props;
		let className = this.props.className;

		if (isDisconnected){
			return className += ' is-disconnected';
		}

		if (isBusy){
			return className += ' is-busy';
		}

		if (isAnimating){
			return className += ' is-animating';
		}
		return className;
	},
	renderLED: function(led, i){
		const { LEDRadius: r, LEDColor: fill } = this.props;
		return circle({ key: `led${i}`, cx: led.x, cy: led.y, r, fill });
	},
	render: function(){
		const { showLEDs, showBackground } = this.props;
		let className = this.getClassName();

		return div({ className },
			svg({ viewBox: '0 0 885.3127 1000', xmlns: 'http://www.w3.org/2000/svg' },
				(showBackground && path({ d: treePath })),
				(showLEDs && leds.map(this.renderLED))
			)
		);
	}
});
