import React from 'react';
import { node, bool, oneOf, string } from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

import styles from './index.scss';


/**
 * General Buttons
 */
const ButtonLayout = (props) => {
  const {
    color,
    hover,
    active,
    disabled,
    children,
    matchParent,
    dataCid,
    icon,
    iconSize,
    iconPosition,
    withCaret,
    hasTwoRows,
    isCaretUp,
    size,
    style,
    noActive,
    className,
    innerClassName,
  } = props;

  const classNameBtn = classNames({
    [styles.button]: true,
    [styles[color]]: true,
    [styles.hover]: hover,
    [styles.active]: active,
    [styles.disabled]: disabled,
    [styles[size]]: size,
    [styles.fullwidth]: matchParent && withCaret,
    [styles['no-active']]: noActive,
  }, className, children.props.className);

  const innerClassNameBox = classNames(
    styles.inner,
    {
      [innerClassName]: innerClassName
    }
  );


  const renderIcon = () => (
    <Icon
      cursor="pointer"
      icon={ icon }
      size={ iconSize }
      position={ iconPosition }
    />
  );

  const renderCaret = () => (
    <div className={styles['caret-box']}>
      <Icon
        cursor="pointer"
        icon="caret-up"
        size="xxs"
        position="right"
        classname={ isCaretUp ? styles.caret : `${styles.caret} ${styles['caret-down']}` }
      />
    </div>
  );

  const renderWrapperForCaret = (withCaret, hasTwoRows, value, style) => {
    const ellipsisBtnStyle = style && style.background ? {
      style: {
        background: style.background
      }
    } : {};

    const boxClassName = hasTwoRows && value && typeof value === 'string' && value.split(' ').length > 1
      ? styles.hasTwoRows
      : styles.withCaret;

    return withCaret
      ? <div
          className={boxClassName}
          {...ellipsisBtnStyle}
        >
         { value }
        </div>
      : value
  };

  const styleElem = Object.assign({},
    style,
    children.props.style,
    { display: 'inline-block' });

  const disabledAction = disabled
    ? { onClick: e => e.preventDefault() }
    : {};

  if (matchParent) {
    styleElem.width = '100%';
  }

  if (React.Children.count(children) === 1) {

    return React.cloneElement(
      children,
      { className: classNameBtn, style: styleElem, ...disabledAction },
      <div
        data-cid={dataCid}
        className={innerClassNameBox}
      >
        { icon && iconPosition !== 'right' && renderIcon() }
        { renderWrapperForCaret(withCaret, hasTwoRows, children.props.children, style) }
        { icon && iconPosition === 'right' && renderIcon() }
        { withCaret && renderCaret() }
      </div>,
    );
  }

  return null;
};

ButtonLayout.defaultProps = {
  color: 'blue',
  type: 'button',
  size: 'md',
};

ButtonLayout.propTypes = {
  active: bool,
  children: node,
  disabled: bool,
  hover: bool,
  matchParent: bool,
  color: oneOf(['green', 'red', 'blue', 'secondary', 'third']),
  icon: string,
  iconSize: oneOf(['xxs', 'xs', 'md', 'sm', 'lg']),
  iconPosition: oneOf(['left', 'sm-left', 'center', 'sm-right', 'right']),
  type: oneOf(['button', 'submit', 'reset']),
  withCaret: bool,
  hasTwoRows: bool,
  isCaretUp: bool,
  size: oneOf(['xs', 'sm', 'md']),
};

ButtonLayout.displayName = 'ButtonLayout';

export default ButtonLayout;
