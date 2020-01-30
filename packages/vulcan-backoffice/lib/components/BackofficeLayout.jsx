import React, { useState, useEffect, useRef } from 'react';
import {
  getAuthorizedMenuItems,
  menuItemProps,
  registerComponent,
  withCurrentUser,
  Components,
} from 'meteor/vulcan:core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MenuItem = (
  { name, label, path, onClick, labelToken, LeftComponent, RightComponent },
  { intl }
) => {
  let Wrapper = React.Fragment;
  if (path) {
    const LinkToPath = ({ children }) => <Link to={path}>{children}</Link>;
    Wrapper = LinkToPath;
  }
  return (
    <Wrapper key={name}>
      <li
        //selected={path && router.isActive(path)}
        onClick={onClick}>
        {LeftComponent && <LeftComponent />}
        <span>{label || intl.formatMessage({ id: labelToken })}</span>
        {RightComponent && <RightComponent />}
      </li>
    </Wrapper>
  );
};

MenuItem.propTypes = {
  ...menuItemProps,
  // parent can pass another onClick callback
  // eg to close the menu
  afterClick: PropTypes.func,
};

const PageLayout = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow: hidden;
`

const MainWrapper = styled.div`
	margin: 16px;
`

const Layout = ({ children, currentUser }) => {
  const [open, setOpen] = useState(true)

  const backofficeMenuItems =
		getAuthorizedMenuItems(currentUser, 'vulcan-backoffice');

  const side = (
		<Components.VerticalNavigation
			links={backofficeMenuItems}
		/>
  );
  return (
    <PageLayout>
			<div>
				<Components.BackofficeNavbar
					onClick={ () => { setOpen(!open) }}
				/>
			</div>

      <Components.BackofficeVerticalMenuLayout
				side={side}
				main={
					<MainWrapper>
						{children}
					</MainWrapper>
				}
				open={open}
			/>
    </PageLayout>
  );
};

registerComponent({
  name: 'VulcanBackofficeLayout',
  component: Layout,
  hocs: [withCurrentUser],
});
