import React, {Component} from 'react';
import propTypes from 'prop-types';
import ReactDOM from 'react-dom';
import merge from "lodash/merge";
import omit from "lodash/omit";
import debounce from "lodash/debounce";
import classNames from "classnames";

import DropdownLayout from '../DropdownLayout';

import styles from './index.scss';


/**
 * Dropdown
 */
class Dropdown extends Component {
  static displayName = 'Dropdown';

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      opened: false
    };
    this.el = document.createElement('div');
  }

  static propTypes = {
    dp: propTypes.object,
    children: propTypes.any,
    contentDp: propTypes.any,
    contentRender: propTypes.array,
    contentRenderBind: propTypes.array,
    isOpenDpChildren: propTypes.object,
    notHideWhenClick: propTypes.bool,
    matchParent: propTypes.bool,

    changeVisibilityOuter: propTypes.func,
    triggerEventCb: propTypes.func,
    openedOuter: propTypes.bool,
    preOpenCb: propTypes.func,
  };

  static defaultProps = {
    dp: {},
    isOpenDpChildren: {},
    notHideWhenClick: false
  };

  getChangeVisibilityFunc = () =>
    this.props.dp.changeVisibilityOuter
      ? this.props.dp.changeVisibilityOuter
      : this.changeVisibility;

  getOpenedState = () =>
    this.props.dp.openedOuter !== undefined
      ? this.props.dp.openedOuter
      : this.state.opened;

  stopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  changeVisibilityPersist = (e) => {
    if (this.props.dp && this.props.dp.preventClick) {
      e.preventDefault();
      this.stopPropagation(e);
    }

    this.getChangeVisibilityFunc()();
    return false;
  };

  changeVisibility = debounce(() => {
    if (this.props.dp.preOpenCb && !this.state.opened) this.props.dp.preOpenCb();
    this.setState({ opened: !this.state.opened });
  }, 100, {
    trailing: true,
    leading: false
  });

  contentClickHandler = (cb) => () => {
    cb && cb();
    this.props.dp.dpClickEventCb && this.props.dp.dpClickEventCb();
  };

  checkTypeForEnabledRow = (item) => {
      let isEnabled = true;

      if (typeof item.enabled === 'function') {
          isEnabled = item.enabled()
      } else if (typeof item.enabled === 'boolean') {
          isEnabled = item.enabled
      }

      return isEnabled;
  };

  renderContent = (contentRender, dpClick) => {
    const { contentRenderBind, contentRenderDataCid } = this.props;

    return (
      <div {...dpClick}>
        {contentRender.filter(item => !item.enabled || this.checkTypeForEnabledRow(item)).map(item => {
          const cb = item.cb && contentRenderBind
            ? item.cb.bind(this, ...contentRenderBind)
            : item.cb;

          const dpCls = classNames(styles['content-item'], {[item.className]: item.className});

          return (
            <div
              key={item.label}
              data-cid={contentRenderDataCid || ""}
              onClick={this.contentClickHandler(cb)}
              className={dpCls}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };

  renderDpLayout = () => {
    const { contentDp, dp, contentRender, notHideWhenClick } = this.props;

    const dpClick = notHideWhenClick ? {} : {onClick: this.getChangeVisibilityFunc()};
    const dpProps = contentDp && contentDp.map ? omit(dp, ['maxHeight']) : dp;

    return (
      <DropdownLayout
        opened={this.getOpenedState()}
        triggerRef={this.myRef}
        changeVisibility={this.getChangeVisibilityFunc()}
        {...dpProps}
      >
          { contentDp && contentDp.map
              ? contentDp.map((reactEl, index) => {
                  const cloneProps = !index ? {...dpClick, style: {
                    maxHeight: dp.maxHeight, overflowY: "auto"
                  }} : dpClick;
                  return React.cloneElement(reactEl, cloneProps)
                })
              : (contentRender && this.renderContent(contentRender, dpClick)) ||
                React.cloneElement(contentDp, dpClick)
          }
      </DropdownLayout>
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.dp.forceClose && !this.props.dp.forceClose) {
      this.setState({
         opened: false
      });
    }
  }

  componentDidMount() {
    const node = document.getElementById(this.props.dp.portalTargetId);
    if (node && this.props.dp && this.props.dp.portalTargetId) {
      node.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    const node = document.getElementById(this.props.dp.portalTargetId);
    if (node && this.props.dp && this.props.dp.portalTargetId) {
      node.removeChild(this.el);
    }
  }

  render() {
    const { children, isOpenDpChildren, matchParent, dp } = this.props;
    const opened = this.getOpenedState();

    const portalId = dp && dp.portalTargetId;

    const childrenProps = {
      onClick: this.changeVisibilityPersist,
      onDoubleClick: this.changeVisibilityPersist
    };

    if (isOpenDpChildren && opened) {
      merge(childrenProps, isOpenDpChildren)
    }

    const styleElem = { style: {}};
    if (matchParent) {
      styleElem.style.width = '100%';
      styleElem.style.maxWidth = '100%';
    }

    return (
      <div
        ref={this.myRef}
        className={styles['dp-wrapper']}
        onTouchStart={this.stopPropagation}
        onTouchEnd={this.stopPropagation}
        {...styleElem}
      >
        {React.cloneElement(children, childrenProps)}
        {opened && !portalId && this.renderDpLayout()}
        {opened && portalId && ReactDOM.createPortal(
            (<div>{this.renderDpLayout()}</div>),
            this.el,
        )}
      </div>
    );
  }
}

export default Dropdown;