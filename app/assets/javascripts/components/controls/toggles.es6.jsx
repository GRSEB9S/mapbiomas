import React from 'react';
import _ from 'underscore';
import Toggle from 'react-toggle';

class TogglesControl extends React.Component {
  get ids() {
    return this.props.options.map((c) => c.id);
  }

  isChecked(id) {
    return this.ids.indexOf(id) != -1;
  }

  handleCheck(id, e) {
    if(e.target.checked && !this.isChecked(id)) {
      let ids = this.ids;
      ids.push(id);
      this.props.onChange(ids);
    } else if(!e.target.checked && this.isChecked(id)) {
      let ids = _.without(this.ids, id);
      this.props.onChange(ids);
    }
  }

  render() {
    let options = this.props.availableOptions.map((option) => {
      return (
        <li key={option.id} className="toggle">
          <label>{option.name}</label>
          <Toggle
            className={`custom-toggle ${option.slug}`}
            defaultChecked={this.isChecked(option.id)}
            icons={false}
            onChange={this.handleCheck.bind(this, option.id)} />
        </li>
      );
    });

    return (
      <div className={this.props.className}>
        <ul className="toggles-list">
          {options}
        </ul>
      </div>
    );
  }
}

export default TogglesControl;
