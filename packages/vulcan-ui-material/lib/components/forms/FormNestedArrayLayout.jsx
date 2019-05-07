import React from 'react';
import PropTypes from 'prop-types';
import { replaceComponent } from 'meteor/vulcan:core';

import Typography from '@material-ui/core/Typography';

const FormNestedArrayLayout = ({ hideLabel = false, label, content, children }) => (
	<div>
		{hideLabel === false ?
			<Typography
				component="label"
				variant="caption"
				style={{ fontSize: 16 }}
			>
				{label}
			</Typography>
			: null}
		<div>{content || children}</div>
	</div>
);

FormNestedArrayLayout.propTypes = {
  hasErrors: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  label: PropTypes.node,
	hideLabel: PropTypes.bool,
	content: PropTypes.node,
};
replaceComponent({
	name: 'FormNestedArrayLayout',
	component: FormNestedArrayLayout,
});
