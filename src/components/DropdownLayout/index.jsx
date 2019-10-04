import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from "react-onclickoutside";
import merge from "lodash/merge";

import getPositionRelativeTo from "../getPositionRelativeTo/getPositionRelativeTo";

import styles from './index.scss';

const minWidthOfDp = 230;
const maxWidthOfDp = 230;


/**
 * General DropDown
 */
class DropdownLayout extends Component {
  static displayName = 'Dropdown Layout';

  constructor(props) {
    super(props);
    this.refLayout = React.createRef();
    this.state = {
      show: false,
      isUp: false,
      isRight: false,
    }
  }

  static propTypes = {
    size: propTypes.oneOf(['xs', 'sm', 'md', 'lg']),
    classname: propTypes.string,
    triggerRef: propTypes.any,
    isUp: propTypes.bool,
    isRight: propTypes.bool,
    maxHeight: propTypes.number,
    minWidth: propTypes.number,
    maxWidth: propTypes.number,
    isStrongPos: propTypes.bool,
    portalTargetId: propTypes.string,
    portalRelativeParentId: propTypes.string,
  };

  static defaultProps = {
    size: "md",
    isUp: false,
    isRight: false,
    maxWidth: maxWidthOfDp
  };

  handleClickOutside = () => {
    this.props.changeVisibility();
  };

  componentDidMount() {
    const { triggerRef, isUp, isRight, isStrongPos } = this.props;
    const { clientWidth, clientHeight } = document.documentElement;

    let isDownPos, isRightPos;
    if (!isStrongPos) {
      const sizeDpTrigger = triggerRef.current.getBoundingClientRect();
      const sizeDpLayout = this.refLayout.current.getBoundingClientRect();

      isDownPos = sizeDpTrigger.top + sizeDpLayout.height < clientHeight;
      isRightPos = sizeDpTrigger.left + minWidthOfDp > clientWidth;
    }

    this.setState({
      show: true,
      isUp: !isStrongPos && !isDownPos || isUp,
      isRight: !isStrongPos && isRightPos || isRight
    })
  }

  render() {
    const {
      size, children, classname, triggerRef, maxHeight, minWidth, portalTargetId, portalRelativeParentId, maxWidth
    } = this.props;
    const { show, isUp, isRight } = this.state;

    if (!children || !triggerRef) return null;

    const classNameLayout = classNames(
      styles['dp-layout'],
      {
        [styles['show']]: show,
        [styles['is-up']]: isUp,
        [styles['is-right']]: isRight,
        // [styles[size]]: size,
        [classname]: classname,
      }
    );

    const headerStyle = {style: { maxWidth }};

    if (maxHeight) headerStyle.style.maxHeight = maxHeight;
    if (minWidth) headerStyle.style.minWidth = minWidth;

    if (portalTargetId) {
        merge(headerStyle.style, getPositionRelativeTo({
            renderRef: this.refLayout,
            portalRelativeParentId: portalRelativeParentId,
            isUp,
            isRight,
            triggerRef,
        }));
    }

    return (
      <div
        ref={this.refLayout}
        className={classNameLayout}
        {...headerStyle}
      >
        {children}
      </div>
    );
  }
}

export default onClickOutside(DropdownLayout);
