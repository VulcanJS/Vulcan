import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select, number, object } from '@storybook/addon-knobs';
import { wrapInParent } from '../helpers';
import { Components } from 'meteor/vulcan:core';
import { lorem } from '../helpers';

/*

Material UI Bonus Components Stories

*/

/*

TooltipButton

*/

const tooltipButton = storiesOf('MUI/Bonus/TooltipButton', module);
tooltipButton.addDecorator(withKnobs);

tooltipButton
  .add('Default', () => {
    const doWrap = boolean('Wrap in parent', false);
    const title = text('title', 'Click button to continue');
    const titleId = text('titleId', null);
    const titleValues = object('titleValues', {});
    const label = text('label', 'Click me');
    const labelId = text('labelId', null);
    const type = select('type', [null, 'simple', 'fab', 'button', 'submit', 'icon'], 'button');
    const size = select('size', [null, 'icon', 'xsmall', 'small', 'medium', 'large']);
    const variant = select('variant', [null, 'text', 'outlined', 'contained'], 'contained');
    const color = select('color', [null, 'default', 'inherit', 'primary', 'secondary'], 'primary');
    const placement = select(
      'placement',
      [
        null,
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
      ],
      null
    );
    const icon = text('icon', 'MaterialIcon1');
    const loading = boolean('loading', null);
    const disabled = boolean('disabled', null);
    const enterDelay = number('enterDelay', null);
    const leaveDelay = number('leaveDelay', null);
    const parent = select('parent', [null, 'default', 'popover'], null);

    const button = (
      <Components.TooltipButton
        title={title}
        titleId={titleId}
        titleValues={titleValues}
        label={label}
        labelId={labelId}
        type={type}
        size={size}
        variant={variant}
        color={color}
        placement={placement}
        icon={icon}
        loading={loading}
        disabled={disabled}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
        parent={parent}
      />
    );

    return wrapInParent(button, doWrap);
  })

  .add('Icon', () => {
    const doWrap = boolean('Wrap in parent', false);

    const button = <Components.TooltipButton title="Click button to continue" type="icon" icon="MaterialIcon1" />;

    return wrapInParent(button, doWrap);
  })

  .add('Fab', () => {
    const doWrap = boolean('Wrap in parent', false);

    const button = <Components.TooltipButton title="Click button to continue" type="fab" icon="MaterialIcon1" color="secondary" />;

    return wrapInParent(button, doWrap);
  })

  .add('Button', () => {
    const doWrap = boolean('Wrap in parent', false);

    const button = <Components.TooltipButton title="Click me" type="button" />;

    return wrapInParent(button, doWrap);
  })

  .add('Other', () => {
    const doWrap = boolean('Wrap in parent', false);

    const button = <Components.TooltipButton title="Explanation of static text">Hover over static text</Components.TooltipButton>;

    return wrapInParent(button, doWrap);
  });

const modalProps = {
  title: 'My Modal',
  header: 'My Header',
  footer: 'My Footer',
};
storiesOf('MUI/Modaltrigger').add('ModalTrigger/Button type', () => (
  <Components.ModalTrigger modalProps={modalProps} type="button" label="Click Me">
    <div>{lorem}</div>
  </Components.ModalTrigger>
));
