import React, { Component } from 'react';
import {node, bool, func, oneOf, string} from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import styles from './index.scss';
import {TooltipContainerStrategy} from "../Tooltip/TooltipContainerStrategy";


class Checkbox extends Component {
  static displayName = 'Checkbox';

  static propTypes = {
    checked: bool,
    disabled: bool,
    hasError: bool,
    onChange: func,
    dataCid: string,
    withMinus: bool,
    preventClick: bool,
  };

  static defaultProps = {
    checked: false,
    dataCid: "",
    onChange: e => e.stopPropagation()
  };

  _id = `${Checkbox.displayName.toLowerCase()}-${uniqueId()}`;

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  clickHandler = (e) => {
    if (this.props.preventClick) e.preventDefault();
    this.stopPropagation(e);

    if (this.props.preventClick && !this.props.disabled) {
      this.props.onChange && this.props.onChange()
    }
  };

  render() {

    const {
      id = this._id,
      checked,
      disabled,
      hasError,
      onChange,
      dataCid,
      withMinus
    } = this.props;

    const classname = classNames(
      checked ? styles.checked : styles.unchecked,
      {
        [styles.disabled]: disabled,
        [styles.hasError]: hasError,
        [styles.minus]: withMinus && checked
      }
    );

    return (
      <div
        className={classname}
        tabIndex={disabled ? null : 0}
        data-cid={dataCid}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={disabled ? null : onChange}
          className={styles.nativeCheckbox}
        />

        <label htmlFor={id}>
          <div
            onClick={this.clickHandler}
            onDoubleClick={this.clickHandler}
            onTouchStart={this.stopPropagation}
            onTouchEnd={this.stopPropagation}
            className={styles.checkbox}
            ref={this.checkbox}
          />
        </label>
      </div>
    );
  }
}

export default Checkbox;
