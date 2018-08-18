import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import moment from 'moment';

const isEmptyValue = value => (typeof value === 'undefined' || value === null || value === '' || Array.isArray(value) && value.length === 0);

class DateComponent2 extends PureComponent {

  state = {
    year: null,
    month: null,
    day: null,
  }

  updateDate = (date) => {
    const { value, path } = this.props;
    let newDate;
    this.setState(date, () => {
      const { year, month, day } = this.state;
      if (isEmptyValue(value)) {
        if (year && month && day) {
          // wait until we have all three values to update the date
          newDate = moment().year(year).month(month).date(day);
          this.props.updateCurrentValues({ [path]: newDate.toDate() });
        }
      } else {
        // update current date
        newDate = moment(this.props.value);
        if (year) newDate.year(year);
        if (month) newDate.month(month);
        if (day) newDate.date(day);
        this.props.updateCurrentValues({ [path]: newDate.toDate() });
      }
    });
  }

  render() {

    const { path, value } = this.props;
    const months = moment.months();
    const mDate = !isEmptyValue(value) && moment(value);

    const monthProperties = {
      label: 'Month',
      name: `${path}.month`,
      layout: 'vertical',
      options: months.map((m, i) => ({ label: m, value: m })),
      value: mDate && mDate.format('MMMM') || '',
      onChange: (name, value) => {
        this.updateDate({ month: value });
      }
    }

    const dayProperties = {
      label: 'Day',
      name: `${path}.day`,
      layout: 'vertical',
      maxLength: 2,
      value: mDate && mDate.format('DD') || '',
      onBlur: (e) => {
        this.updateDate({ day: e.target.value });
      }
    }

    const yearProperties = {
      label: 'Year',
      name: `${path}.year`,
      layout: 'vertical',
      maxLength: 4,
      value: mDate && mDate.format('YYYY') || '',
      onBlur: (e) => {
        this.updateDate({ year: e.target.value });
      }
    }

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9" style={{ display: 'flex', alignItems: 'center' }}>
          <div><Components.FormComponentSelect inputProperties={monthProperties} datatype={[{ type: String }]} /></div>
          <div style={{ marginLeft: 10, width: 60 }}><Components.FormComponentText inputProperties={dayProperties} /></div>
          <div style={{ marginLeft: 10, width: 80 }}><Components.FormComponentText inputProperties={yearProperties} /></div>
        </div>
      </div>
    );
  }
}

export default DateComponent2;

registerComponent('FormComponentDate2', DateComponent2);