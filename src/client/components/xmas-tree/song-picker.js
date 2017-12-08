import { createFactory } from 'react';
import createClass from 'create-react-class';
import { div, label, select, option } from 'react-dom-factories';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import PlayBtn from '../buttons/play.js';

const playBtn = createFactory(PlayBtn);


export default createClass({
	displayName: 'SongPicker',
	propTypes: {
		viewname: PropTypes.string.isRequired,
		onSongPlayToggle: PropTypes.func.isRequired,
		onSongSelected: PropTypes.func.isRequired,
		song: PropTypes.shape({
			id: PropTypes.number.isRequired,
			count: PropTypes.number.isRequired,
			isPlaying:PropTypes.bool.isRequired
		}).isRequired
	},
	onChange: function(event){
		const { onSongSelected } = this.props;
		const id = parseInt(event.target.value, 10);
		onSongSelected(id);
	},
	onClick: function(event){
		const { onSongPlayToggle } = this.props;
		onSongPlayToggle();
	},
	renderSongs: function(){
		const { song } = this.props;

		return range(song.count).map(n => option({
			key: `sng${n}`,
			value: n,
			children: n + 1
		}));
	},
	render: function(){
		const { onChange, onClick } = this;
		const { viewname, song } = this.props;
		const className = `${viewname}-song-picker`;

		return div({ className },
			label(null, 'Song:'),
			playBtn({ onClick, isPaused: song.isPlaying }),
			div({ className: `${viewname}-song-list` },
				select({ value: song.id, onChange },
					this.renderSongs()
				)
			)
		);
	}
});
