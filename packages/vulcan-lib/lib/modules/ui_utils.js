import pick from 'lodash/pick';

/**
 * Extract input props for the FormComponentInner
 * @param {*} props All component props
 * @returns Initial props + props specific to the HTML input in an inputProperties object
 */
export const getHtmlInputProps = props => {
  const { name, path, options, label, onChange, onBlur, value, disabled } = props;

  // these properties are whitelisted so that they can be safely passed to the actual form input
  // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
  const inputProperties = {
    ...props.inputProperties,
    name,
    path,
    options,
    label,
    onChange,
    onBlur,
    value,
    disabled,
  };

  return {
    ...props,
    inputProperties,
  };
};

/**
 * Extract input props for the FormComponentInner
 * @param {*} props All component props
 * @returns Initial props + props specific to the HTML input in an inputProperties object
 */
export const whitelistInputProps = props => {
  const whitelist = ['name', 'path', 'options', 'label', 'onChange', 'onBlur', 'value', 'disabled', 'placeholder'];
  return pick(props, whitelist);
};
