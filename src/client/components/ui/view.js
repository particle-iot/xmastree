import { createFactory, cloneElement } from 'react';
import createClass from 'create-react-class';
import { main, section, nav, footer, div, p } from 'react-dom-factories';
import PropTypes from 'prop-types';
import LogoutBtn from '../buttons/logout.js';
import StatusBanner from './status-banner.js';
import Logo from './logo.js';

const statusBanner = createFactory(StatusBanner);
const logoutBtn = createFactory(LogoutBtn);
const logo = createFactory(Logo);


export default createClass({
	displayName: 'ViewLayout',
	propTypes: {
		status: PropTypes.object,
		isLoggedIn: PropTypes.bool,
		onLogout: PropTypes.func.isRequired,
		repoUrl: PropTypes.string.isRequired,
		children: PropTypes.element.isRequired
	},
	getDefaultProps(){
		return { isLoggedIn: false };
	},
	renderNav: function(viewname){
		const { isLoggedIn, onLogout } = this.props;

		if (!isLoggedIn){
			return false;
		}
		return nav({ className: `${viewname}-nav` },
			logoutBtn({
				className: `${viewname}-nav-logout`,
				onClick: onLogout,
			})
		);
	},
	renderFooter: function(viewname){
		const { isLoggedIn } = this.props;

		if (!isLoggedIn){
			return false;
		}
		return footer({ className: `${viewname}-footer` },
			p(null, 'powered by:'),
			logo({
				className: `${viewname}-footer-logo`,
				href: 'https://particle.io'
			})
		);
	},
	render(){
		const { repoUrl, status, children } = this.props;
		const viewname = children.type.displayName.toLowerCase();
		const child = cloneElement(children, { viewname });

		return div({ className: viewname },
			main(null,
				section({ className: `${viewname}-content` }, child)
			),
			this.renderNav(viewname),
			this.renderFooter(viewname),
			(status && statusBanner({
				className: `${viewname}-status`,
				repoUrl,
				status
			}))
		);
	}
});
