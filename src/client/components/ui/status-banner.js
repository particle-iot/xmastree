import createClass from 'create-react-class';
import { div, p, a } from 'react-dom-factories';
import PropTypes from 'prop-types';


export default createClass({
	displayName: 'StatusBanner',
	propTypes: {
		className: PropTypes.string,
		repoUrl: PropTypes.string.isRequired,
		status: PropTypes.shape({
			type: PropTypes.string.isRequired,
			code: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired,
			className: PropTypes.func.isRequired
		}).isRequired
	},
	getDefaultProps(){
		return { className: '' };
	},
	renderFirmwareLink: function(){
		const { repoUrl, status } = this.props;

		if (status.type !== 'device-qualify-fail'){
			return false;
		}
		return a({ href: repoUrl, target: '_blank' }, 'Install Now');
	},
	render: function(){
		const { className, status } = this.props;
		const firmwareLink = this.renderFirmwareLink();
		let children = [status.message];

		if (firmwareLink){
			children.push(' ', firmwareLink);
		}
		return div({ className: `${className} ${status.className()}` },
			p(null, ...children)
		);
	}
});
