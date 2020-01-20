import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import styled from 'styled-components';

const StyledDiv = styled.div`
	display: none;

	@media screen and (max-width: 1200px) {
		display: block;
	}
`;

const BackofficeBurgerMenu = ({onClick}) => {
	return (
		<StyledDiv className='burger-menu' onClick={onClick} />
	)
}

registerComponent('BackofficeBurgerMenu', BackofficeBurgerMenu)
