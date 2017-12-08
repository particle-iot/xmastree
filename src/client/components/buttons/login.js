import createClass from 'create-react-class';
import { button } from 'react-dom-factories';
import PropTypes from 'prop-types';


export default createClass({
	displayName: 'LoginButton',
	propTypes: {
		className: PropTypes.string,
		onClick: PropTypes.func.isRequired,
		children: PropTypes.node
	},
	getDefaultProps: function(){
		return {
			children: 'Log In'
		};
	},
	render: function(){
		const { className, onClick, children } = this.props;
		return button({ className, onClick }, children);
	}
});
