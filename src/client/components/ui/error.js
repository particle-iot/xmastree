import createClass from 'create-react-class';
import { div, p, h3 } from 'react-dom-factories';
import PropTypes from 'prop-types';


export default createClass({
	displayName: 'Error',
	propTypes: {
		className: PropTypes.string,
		type: PropTypes.oneOf(['login', 'api', 'device']).isRequired,
		message: PropTypes.string.isRequired
	},
	render: function(){
		const { className, type, message } = this.props;

		return div({ className },
			h3(null, `${type} error`),
			p(null, message)
		);
	}
});
