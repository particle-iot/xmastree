import createClass from 'create-react-class';
import { div, a, svg, path, g, rect, polygon } from 'react-dom-factories';
import PropTypes from 'prop-types';


export default createClass({
	displayName: 'ParticleLogo',
	propTypes: {
		className: PropTypes.string.isRequired,
		showStar: PropTypes.bool,
		starColor: PropTypes.string,
		showText: PropTypes.bool,
		textColor: PropTypes.string,
		href: PropTypes.string,
		target: PropTypes.string
	},
	getDefaultProps: function(){
		return {
			showStar: true,
			starColor: '#00aced',
			showText: true,
			textColor: '#000'
		};
	},
	renderSVG: function(){
		const { showStar, showText } = this.props;
		let viewBox ='0 0 3849.5 890';

		if (!showText){
			viewBox = '0 0 890 890';
		} else if (!showStar){
			viewBox = '1100 40 2770 770';
		}
		return svg({ viewBox, xmlns: 'http://www.w3.org/2000/svg' },
			this.renderText(),
			this.renderStar()
		);
	},
	renderStar: function(){
		const { showStar, starColor: fill } = this.props;

		if (!showStar){
			return false;
		}
		return g(null,
			polygon({ fill, points: '890,445 653.1,495.9 620.2,445 653.1,394.1' }),
			polygon({ fill, points: '759.7,130.3 556.2,445 759.7,759.6 445,556.2 130.3,759.6 333.8,445 130.3,130.3 445,333.7' }),
			polygon({ fill, points: '445,620.2 495.9,653.1 445,890 394.1,653.1' }),
			polygon({ fill, points: '445,0 495.9,236.9 445,269.8 394.1,236.9' }),
			polygon({ fill, points: '236.9,394.1 269.8,445 236.9,495.9 0,445' })
		);
	},
	renderText: function(){
		const { showText, textColor: fill } = this.props;

		if (!showText){
			return false;
		}
		return g(null,
			path({ fill, d: 'M1123.6,105.5H1332c149,0,251.5,76.7,251.5,207.9v1.9c0,142.8-122.9,216.6-264.1,216.6h-145.6v253.5h-50.3V105.5z M1322.4,485.3c125.8,0,210.9-66.1,210.9-167.1v-1.9c0-107.8-83.2-164.2-205.1-164.2h-154.3v333.2H1322.4z' }),
			path({ fill, d: 'M1599.3,641.2v-1.9c0-102.9,88.3-161.1,216.4-161.1c68.9,0,116.4,8.7,164,21.3v-21.3c0-100-61.1-151.4-163-151.4 c-60.2,0-109.7,16.5-155.3,39.8l-17.5-41.7c54.3-25.2,107.7-42.7,175.6-42.7c67,0,120.3,18.4,156.2,54.3c33,33,50.5,78.6,50.5,139.7 v308.6h-46.6v-82.5c-34,47.5-95.1,94.1-189.2,94.1C1698.3,796.5,1599.3,744.1,1599.3,641.2z M1980.7,599.5v-56.3 c-41.7-10.7-97-22.3-167.9-22.3c-104.8,0-163,46.6-163,115.5v1.9c0,71.8,67.9,113.5,143.6,113.5 C1894.3,751.9,1980.7,689.7,1980.7,599.5z' }),
			path({ fill, d: 'M2087.5,290.6h47.5v140.7c38.8-88.3,145.4-140.2,243.7-140.2v44.1h-4.8c-114.5,0-238.9,86.4-238.9,247.4v202.8h-47.5V290.6z' }),
			path({ fill, d: 'M2438.8,290V131.8h47.6V290H2660v43.7h-173.7v319.2c0,70.8,41.7,96.1,99,96.1c24.3,0,44.6-4.9,72.8-17.5v44.6 c-25.2,11.6-49.5,17.5-80.5,17.5c-76.7,0-138.8-41.7-138.8-135.9V333.6' }),
			path({ fill, d: 'M2809.6,545.4v-1.9c0-135.5,107.6-253,245.5-253c90.6,0,147.3,41.7,192.6,89.1l-33,34.1c-41.5-42.6-88.8-79.6-160.5-79.6 c-109.5,0-194.5,91.9-194.5,207.5v1.9c0,116.5,87.8,209.4,198.3,209.4c68,0,120.9-35.1,161.5-80.5l32.1,28.4 c-49.1,55.9-107.6,95.7-196.4,95.7C2916.3,796.5,2809.6,680.9,2809.6,545.4z' }),
			path({ fill, d: 'M3302.6,77.5h48v708h-48V77.5z' }),
			path({ fill, d: 'M3399.8,544.5v-1.9c0-140.2,98.3-252,228.6-252c135.1,0,221.1,109.9,221.1,253c0,8.5,0,11.4-1,18.9h-399.6 c8.5,120.3,94.5,190.4,188.9,190.4c74.6,0,125.6-33.2,165.3-75.8l32.1,28.4c-49.1,53.1-106.7,91-199.3,91 C3509.4,796.5,3399.8,695.1,3399.8,544.5z M3799.4,520.8c-6.6-97.6-62.3-187.6-172.9-187.6c-95.4,0-169.1,80.5-177.6,187.6H3799.4z' }),
			g(null,
				rect({ fill, x: '2712.6', y: '289.9', width: '48', height: '495.6' }),
				rect({ fill, x: '2712.6', y: '131.5', width: '48', height: '78.4' })
			)
		);
	},
	render(){
		const { href, target, className } = this.props;

		if (href){
			return a({ className, href, target },
				this.renderSVG()
			);
		}
		return div({ className },
			this.renderSVG()
		);
	}
});
