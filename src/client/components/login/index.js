import { createFactory } from 'react';
import createClass from 'create-react-class';
import { div, a } from 'react-dom-factories';
import PropTypes from 'prop-types';
import createOAuth from '../../lib/oauth-implicit.js';
import { Statuses } from '../../lib/status.js';
import LoginBtn from '../buttons/login.js';
import Logo from '../ui/logo.js';

const loginBtn = createFactory(LoginBtn);
const logo = createFactory(Logo);
const { STATUS_LOGIN_FAIL } = Statuses;


export default createClass({
	displayName: 'Login',
	propTypes: {
		apiUrl: PropTypes.string.isRequired,
		repoUrl: PropTypes.string.isRequired,
		clientId: PropTypes.string.isRequired,
		onSuccess: PropTypes.func.isRequired,
		onError: PropTypes.func.isRequired,
		viewname: PropTypes.string
	},
	getDefaultProps: function(){
		return { viewname: this.displayName.toLowerCase() };
	},
	componentWillMount: function(){
		const { apiUrl, clientId } = this.props;
		this.oauth = createOAuth({ apiUrl, clientId });
	},
	componentDidMount: function(){
		const res = this.oauth.getResponse();
		const { onSuccess, onError } = this.props;

		if (res.isOk()){
			onSuccess(res.token);
		} else if (res.isFailure()){
			onError(STATUS_LOGIN_FAIL.clone({ message: res.message }));
		}
	},
	onLogin: function(event){
		this.oauth.login();
	},
	render: function(){
		const { viewname, repoUrl } = this.props;

		return div({ className: `${viewname}-content-inner` },
			logo({ className: `${viewname}-logo`, showText: false }),
			a({
				className: `${viewname}-btn`,
				href: repoUrl,
				children: 'Setup Your Tree'
			}),
			loginBtn({
				className: `${viewname}-btn`,
				onClick: this.onLogin,
				children: 'Connect To Your Tree'
			})
		);
	}
});
