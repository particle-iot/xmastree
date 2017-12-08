import { createFactory } from 'react';
import createClass from 'create-react-class';
import { div, label, select, option } from 'react-dom-factories';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import PlayBtn from '../buttons/play.js';

const playBtn = createFactory(PlayBtn);


export default createClass({
	displayName: 'AnimationPicker',
	propTypes: {
		viewname: PropTypes.string.isRequired,
		onAnimationPlayToggle: PropTypes.func.isRequired,
		onAnimationSelected: PropTypes.func.isRequired,
		animation: PropTypes.shape({
			id: PropTypes.number.isRequired,
			count: PropTypes.number.isRequired,
			isPlaying:PropTypes.bool.isRequired
		}).isRequired
	},
	onChange: function(event){
		const { onAnimationSelected } = this.props;
		const id = parseInt(event.target.value, 10);
		onAnimationSelected(id);
	},
	onClick: function(event){
		const { onAnimationPlayToggle } = this.props;
		onAnimationPlayToggle();
	},
	renderAnimations: function(){
		const { animation } = this.props;

		return range(animation.count).map(n => option({
			key: `ani${n}`,
			value: n,
			children: n + 1
		}));
	},
	render: function(){
		const { onChange, onClick } = this;
		const { viewname, animation } = this.props;
		const className = `${viewname}-animation-picker`;

		return div({ className },
			label(null, 'Animation:'),
			playBtn({ onClick, isPaused: animation.isPlaying }),
			div({ className: `${viewname}-animation-list` },
				select({ value: animation.id, onChange },
					this.renderAnimations()
				)
			)
		);
	}
});
