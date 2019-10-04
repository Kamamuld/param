import React, { Component } from 'react';
import { bool, func, oneOf, string } from 'prop-types';
import classNames from 'classnames';

import style from './index.scss';


class Icon extends Component {
  static displayName = 'Icon';

  static propTypes = {
    icon: string,
    clickHandler: func,
    cursor: oneOf(['default', 'pointer']),
    dataCid: string,
    size: oneOf(['xxxs', 'xxs', 'xs', 'md', 'sm', 'lg', 'gr', 'gi']),
    classname: string,
    position: oneOf(['left', 'sm-left', 'center', 'sm-right', 'right']),
    color: oneOf(['red', 'gray', 'orange']),
    hexColor: string,
  };

  static defaultProps = {
    cursor: 'default',
    position: 'center',
    size: 'md',
    clickHandler: e => e.preventDefault()
  };

  render() {

    const {
      dataCid,
      icon,
      clickHandler,
      cursor,
      size,
      classname,
      position,
      color,
      hexColor
    } = this.props;

    if (!icon) return null;

    const classes = classNames(
      'icon',
      style['icon'],
      style[`i-${icon}`],
      style[`i-ico_size_${size}`],
      style[cursor],
      style[position],
      {
        [classname]: classname,
        [style[`is-${color}`]]: color,
      }
    );

    const customStyle = {style: {color: hexColor}};

    return (
      <i
        className={classes}
        data-cid={dataCid}
        onClick={clickHandler}
        {...customStyle}
      />
    );
  }
}

export default Icon;
