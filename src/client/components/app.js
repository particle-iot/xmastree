import set from 'lodash/set';
import { createFactory } from 'react';
import createClass from 'create-react-class';
import { div } from 'react-dom-factories';
import PropTypes from 'prop-types';
import View from './ui/view.js';
import Login from './login/index.js';
import XMasTree from './xmas-tree/index.js';

const view = createFactory(View);
const login = createFactory(Login);
const xmastree = createFactory(XMasTree);
const KEY_APP_STATE = 'appstate';


export default createClass({
	displayName: 'App',
	propTypes: {
		clientId: PropTypes.string.isRequired,
		apiUrl: PropTypes.string.isRequired,
		repoUrl: PropTypes.string.isRequired,
		appUrl: PropTypes.string.isRequired,
		db: PropTypes.object.isRequired
	},
	getInitialState: function(){
		const { db } = this.props;
		const state = db.get(KEY_APP_STATE);

		if (state){
			return state;
		}
		return { token: null, status: null, device: null };
	},
	componentWillUpdate: function(nextProps, nextState){
		const { db } = this.props;
		const state = Object.assign({}, nextState, { status: null });

		db.set(KEY_APP_STATE, state);
	},
	login: function(token){
		this.setState({ token: token });
	},
	logout: function(){
		const keys = Object.keys(this.state);
		const state = keys.reduce((out, k) => set(out, k, null), {});
		this.setState(state);
	},
	isLoggedIn: function(){
		return !!this.state.token;
	},
	onStatusSet: function(status){
		this.setState({ status });
	},
	onDeviceAssigned: function(device){
		this.setState({ device });
	},
	onDeviceCleared: function(device){
		this.setState({ device: null });
	},
	onError: function(error){
		this.onStatusSet(error);
	},
	render: function(){
		const isLoggedIn = this.isLoggedIn();
		const { onStatusSet, onDeviceAssigned, onDeviceCleared, onError } = this;
		const { clientId, apiUrl, repoUrl } = this.props;
		const { token, status, device } = this.state;
		const showBusy = status ? status.isInit() : false;

		return div({ className: 'app' },
			view({ status, repoUrl, isLoggedIn, onLogout: this.logout },
				(isLoggedIn
					? xmastree({ apiUrl, token, device, showBusy, onStatusSet, onDeviceAssigned, onDeviceCleared })
					: login({ clientId, apiUrl, repoUrl, onError, onSuccess: this.login })),
			)
		);
	}
});
