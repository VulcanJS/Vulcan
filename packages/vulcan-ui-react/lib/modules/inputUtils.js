/**
 * Extract input props for the FormComponentInner
 * @param {*} props All component props
 * @returns Initial props + props specific to the HTML input in an inputProperties object
 */
export const getInputProps = props => {
  const { name, path, options, label, onChange, value, disabled } = props;

  // these properties are whitelisted so that they can be safely passed to the actual form input
  // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
  const inputProperties = {
    name,
    path,
    options,
    label,
    onChange,
    value,
    disabled,
    ...props.inputProperties,
  };

  return {
    ...props,
    inputProperties,
  };
};
