import React, { PureComponent } from 'react';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';
import moment from 'moment';

const isEmptyValue = value =>
  typeof value === 'undefined' ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

const isValidYear = year => year && year.toString().length === 4;
const isValidDay = day => day && day.toString().length <= 2;

class DateComponent2 extends PureComponent {

  /*

  Keep initial local state blank so that form state values are used instead

  */
  state = {}

  /*

  Transform the value received from props into
  three year/month/day properties, or else default to 
  empty strings for all three

  */
  getDateObject = value => {
    const mDate = !isEmptyValue(value) && moment(value);
    return mDate ? {
      year: mDate.format('YYYY'),
      month: mDate.format('MMMM'),
      day: mDate.format('D'),
    } : {
      year: '',
      month: '',
      day: '',
    };
  }

  updateDate = date => {
    const { value, path } = this.props;
    const newState = { ...this.state, ...date };
    const { year, month, day } = newState;

    let newDate;
    if (isEmptyValue(value)) { // if there is no date value yet
      if (isValidYear(year) && month && isValidDay(day)) {
        // wait until we have all three valid values to update the date in the form state
        newDate = moment()
          .year(year)
          .month(month)
          .date(day);
        this.props.updateCurrentValues({ [path]: newDate.toDate() });
        // clear our the local component state to avoid storing outdated or conflicting values
        this.setState({ year: undefined, month: undefined, day: undefined });
      } else {
        // otherwise only update local state
        this.setState(date);
      }
    } else {
      // there is currently a date value in the form state
      newDate = moment(this.props.value);

      // by default, update all three values in local state
      const updateStateObject = { ...date };

      // update all three values separately; clear local state when updating a value in form state
      if (isValidYear(year)) {
        newDate.year(year);
        updateStateObject.year = undefined;
      }
      if (month) {
        newDate.month(month);
        updateStateObject.month = undefined;
      }
      if (isValidDay(day)) {
        newDate.date(day);
        updateStateObject.day = undefined;
      }
      this.props.updateCurrentValues({ [path]: newDate.toDate() });
      this.setState(updateStateObject);
    }
  };

  render() {
    const { path, value, inputProperties, itemProperties, formCopmonents } = this.props;
    const s = this.state;
    const p = this.getDateObject(value);

    const Components = mergeWithComponents(formComponents);

    /*

    For values: if local *state* is defined we use that, else
    we use value from form state passed through *props* and 
    split into month/day/year via getDateObject()

    */
    const monthProperties = {
      name: `${path}.month`,
      options: moment.months().map((m, i) => ({ label: m, value: m })),
      value: typeof s.month === 'undefined' ? p.month : s.month,
      onChange: e => {
        this.updateDate({ month: e.target.value });
      },
    };

    const dayProperties = {
      name: `${path}.day`,
      maxLength: 2,
      value: typeof s.day === 'undefined' ? p.day : s.day,
      onChange: e => {
        this.updateDate({ day: e.target.value });
      },
    };

    const yearProperties = {
      name: `${path}.year`,
      maxLength: 4,
      value: typeof s.year === 'undefined' ? p.year : s.year,
      onChange: e => {
        this.updateDate({ year: e.target.value });
      },
    };

    return (
      <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
        <div style={{ display: 'flex' }}>
          <div>
            <label>
              <Components.FormattedMessage id="forms.month" />
            </label>
            <Components.FormComponentSelect
              inputProperties={monthProperties}
              datatype={[{ type: String }]}
            />
          </div>
          <div style={{ marginLeft: 10, width: 60 }}>
            <label>
              <Components.FormattedMessage id="forms.day" />
            </label>
            <Components.FormComponentText inputProperties={dayProperties} />
          </div>
          <div style={{ marginLeft: 10, width: 80 }}>
            <label>
              <Components.FormattedMessage id="forms.year" />
            </label>
            <Components.FormComponentText inputProperties={yearProperties} />
          </div>
        </div>
      </Components.FormItem>
    );
  }
}

export default DateComponent2;

registerComponent('FormComponentDate2', DateComponent2);
