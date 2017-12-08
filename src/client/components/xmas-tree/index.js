import isFn from 'lodash/isFunction';
import { createFactory } from 'react';
import createClass from 'create-react-class';
import { div } from 'react-dom-factories';
import PropTypes from 'prop-types';
import createXmastreeApi from '../../lib/xmastree-api.js';
import isShallowEqual from '../../lib/shallow-equal.js';
import { Statuses } from '../../lib/status.js';
import AnimationPicker from './animation-picker.js';
import DevicePicker from './device-picker.js';
import SongPicker from './song-picker.js';
import Tree from './tree.js';

const songPicker = createFactory(SongPicker);
const devicePicker = createFactory(DevicePicker);
const animationPicker = createFactory(AnimationPicker);
const tree = createFactory(Tree);
const {
	STATUS_DEVICES_FETCH, STATUS_DEVICES_FETCH_OK, STATUS_DEVICES_FETCH_FAIL,
	STATUS_DEVICE_QUALIFY, STATUS_DEVICE_QUALIFY_OK, STATUS_DEVICE_QUALIFY_FAIL,
	STATUS_TREESTATE_FETCH, STATUS_TREESTATE_FETCH_OK, STATUS_TREESTATE_FETCH_FAIL,
	STATUS_SONG_SET, STATUS_SONG_SET_OK, STATUS_SONG_SET_FAIL,
	STATUS_SONG_PLAYTOGGLE, STATUS_SONG_PLAYTOGGLE_OK, STATUS_SONG_PLAYTOGGLE_FAIL,
	STATUS_ANIMATION_SET, STATUS_ANIMATION_SET_OK, STATUS_ANIMATION_SET_FAIL,
	STATUS_ANIMATION_PLAYTOGGLE, STATUS_ANIMATION_PLAYTOGGLE_OK, STATUS_ANIMATION_PLAYTOGGLE_FAIL,
	STATUS_LISTEN, STATUS_LISTEN_OK, STATUS_LISTEN_FAIL
} = Statuses;


export default createClass({
	displayName: 'XMasTree',
	propTypes: {
		token: PropTypes.string.isRequired,
		apiUrl: PropTypes.string.isRequired,
		onDeviceAssigned: PropTypes.func.isRequired,
		onDeviceCleared: PropTypes.func.isRequired,
		onStatusSet: PropTypes.func.isRequired,
		device: PropTypes.object,
		viewname: PropTypes.string,
		showBusy: PropTypes.bool
	},
	getDefaultProps: function(){
		return { viewname: this.displayName.toLowerCase(), showBusy: false };
	},
	getInitialState: function(){
		return { song: null, animation: null, deviceList: null };
	},
	shouldComponentUpdate: function(nextProps, nextState){
		const { state, props } = this;

		if (!isShallowEqual(state, nextState)){
			return true;
		}
		return !isShallowEqual(props, nextProps);
	},
	componentWillMount: function(){
		const { apiUrl, token } = this.props;
		this.api = createXmastreeApi({ apiUrl, token });
	},
	componentDidMount: function(){
		const { device } = this.props;

		if (!device){
			this.fetchDeviceList();
		} else {
			this.attachToDevice(device);
		}
	},
	componentWillReceiveProps: function(nextProps){
		const { device } = nextProps;
		const ignoreKeys = ['showBusy'];

		if (isShallowEqual(this.props, nextProps, ignoreKeys)){
			return;
		}
		if (!device && !this.state.deviceList){
			this.fetchDeviceList();
		} else if (device && !this.props.device){
			this.attachToDevice(device);
		}
	},
	componentWillUnmount: function(){
		this.unregisterDeviceListeners();
	},
	setDeviceList: function(deviceList){
		this.setState({ deviceList });
		return this;
	},
	setTreeState: function(tree){
		const song = Object.assign({}, this.state.song, tree.song);
		const animation = Object.assign({}, this.state.animation, tree.animation);
		return this.setSong(song).setAnimation(animation);
	},
	setSong: function(song){
		this.setState({ song });
		return this;
	},
	setSongId: function(songId){
		const song = Object.assign({}, this.state.song, { id: songId });
		this.setSong(song);
		return this;
	},
	setSongIsPlaying: function(isPlaying){
		const song = Object.assign({}, this.state.song, { isPlaying });
		this.setSong(song);
		return this;
	},
	setAnimation: function(animation){
		this.setState({ animation });
		return this;
	},
	setAnimationId: function(animationId){
		const animation = Object.assign({}, this.state.animation, { id: animationId });
		this.setAnimation(animation);
		return this;
	},
	setAnimationIsPlaying: function(isPlaying){
		const animation = Object.assign({}, this.state.animation, { isPlaying });
		this.setAnimation(animation);
		return this;
	},
	setStatus: function(status){
		const { onStatusSet } = this.props;
		onStatusSet(status);
		return this;
	},
	setUnregisterDeviceListeners: function(fn){
		this.unregisterDeviceListeners();
		this._unregisterDeviceListeners = fn || null;
		return this;
	},
	unregisterDeviceListeners: function(){
		if (isFn(this._unregisterDeviceListeners)){
			this._unregisterDeviceListeners();
		}
	},
	fetchDeviceList: function(){
		this.setStatus(STATUS_DEVICES_FETCH);
		return this.api.fetchDeviceList()
			.then(deviceList => this
				.setStatus(STATUS_DEVICES_FETCH_OK)
				.setDeviceList(deviceList))
			.catch(error => this
				.setStatus(STATUS_DEVICES_FETCH_FAIL));
	},
	attachToDevice: function(device){
		return this.fetchTreestate(device)
			.then(() => this.listenToDeviceEvents(device));
	},
	fetchTreestate: function(device){
		this.setStatus(STATUS_TREESTATE_FETCH);
		return this.api.fetchTreestate({ device })
			.then(state => this
				.setStatus(STATUS_TREESTATE_FETCH_OK)
				.setAnimation(state.animation)
				.setSong(state.song))
			.catch(error => this
				.setStatus(STATUS_TREESTATE_FETCH_FAIL));
	},
	listenToDeviceEvents: function(device){
		const handlers = {
			onStateChange: this.setTreeState,
			onAnimationChange: this.setAnimationId,
			onSongChange: this.setSongId
		};

		this.setStatus(STATUS_LISTEN);
		this.setUnregisterDeviceListeners(null);

		return this.api.registerEventHandlers({ device, handlers })
			.then(unregFn => this
				.setStatus(STATUS_LISTEN_OK)
				.setUnregisterDeviceListeners(unregFn))
			.catch(error => this
				.setStatus(STATUS_LISTEN_FAIL));
	},
	onDeviceSelected: function(device){
		const { onDeviceAssigned } = this.props;

		this.setStatus(STATUS_DEVICE_QUALIFY);
		return this.api.qualifyDevice({ device })
			.then(device => {
				this.setStatus(STATUS_DEVICE_QUALIFY_OK);
				onDeviceAssigned(device);
			})
			.catch(error => {
				let status = STATUS_DEVICE_QUALIFY_FAIL.clone();

				if (error.code === 'firmware'){
					status.message = error.message;
				}
				this.setStatus(status);
			});
	},
	onSongSelected: function(songId){
		const { device } = this.props;
		const { id: prevSongId } = this.state.song;

		this.setStatus(STATUS_SONG_SET);
		this.setSongId(songId);

		return this.api.playSong({ device, songId })
			.then(value => this
				.setStatus(STATUS_SONG_SET_OK))
			.catch(error => this
				.setStatus(STATUS_SONG_SET_FAIL)
				.setSongId(prevSongId));
	},
	onSongPlayToggle: function(){
		const { device } = this.props;
		const { song } = this.state;
		const { id: songId, isPlaying } = song;
		let command;

		this.setStatus(STATUS_SONG_PLAYTOGGLE);
		this.setSongIsPlaying(!isPlaying);

		if (isPlaying){
			command = this.api.stopSong({ device });
		} else {
			command = this.api.playSong({ device, songId });
		}
		return command
			.then(() => this
				.setStatus(STATUS_SONG_PLAYTOGGLE_OK))
			.catch(error => this
				.setStatus(STATUS_SONG_PLAYTOGGLE_FAIL)
				.setSongIsPlaying(isPlaying));
	},
	onAnimationSelected: function(animationId){
		const { device } = this.props;
		const { id: prevAnimationId } = this.state.animation;

		this.setStatus(STATUS_ANIMATION_SET);
		this.setAnimationId(animationId);

		return this.api.playAnimation({ device, animationId })
			.then(value => this
				.setStatus(STATUS_ANIMATION_SET_OK))
			.catch(error => this
				.setStatus(STATUS_ANIMATION_SET_FAIL)
				.setAnimationId(prevAnimationId));
	},
	onAnimationPlayToggle: function(){
		const { device } = this.props;
		const { animation } = this.state;
		const { id: animationId, isPlaying } = animation;
		let command;

		this.setStatus(STATUS_ANIMATION_PLAYTOGGLE);
		this.setAnimationIsPlaying(!isPlaying);

		if (isPlaying){
			command = this.api.stopAnimation({ device });
		} else {
			command = this.api.playAnimation({ device, animationId });
		}
		return command
			.then(() => this
				.setStatus(STATUS_ANIMATION_PLAYTOGGLE_OK))
			.catch(error => this
				.setStatus(STATUS_ANIMATION_PLAYTOGGLE_FAIL)
				.setAnimationIsPlaying(isPlaying));
	},
	renderSongPicker: function(){
		const { onSongSelected, onSongPlayToggle } = this;
		const { viewname, device } = this.props;
		const { song } = this.state;

		if (!device || !song){
			return false;
		}
		return songPicker({ viewname, song, onSongSelected, onSongPlayToggle });
	},
	renderAnimationPicker: function(){
		const { onAnimationSelected, onAnimationPlayToggle } = this;
		const { viewname, device } = this.props;
		const { animation } = this.state;

		if (!device || !animation){
			return false;
		}
		return animationPicker({ viewname, animation, onAnimationSelected, onAnimationPlayToggle });
	},
	renderDevicePicker: function(){
		const { onDeviceSelected } = this;
		const { viewname, device, onDeviceCleared } = this.props;
		const { deviceList } = this.state;

		return devicePicker({ viewname, device, deviceList, onDeviceSelected, onDeviceCleared });
	},
	render: function(){
		const { viewname, device, showBusy } = this.props;
		const { animation } = this.state;

		return div({ className: `${viewname}-content-inner` },
			tree({
				className: `${viewname}-tree`,
				LEDRadius: 16,
				isDisconnected: !device,
				isAnimating: animation ? animation.isPlaying : false,
				isBusy: showBusy
			}),
			div({ className: `${viewname}-ctrls` },
				this.renderSongPicker(),
				this.renderAnimationPicker(),
				this.renderDevicePicker()
			)
		);
	}
});
