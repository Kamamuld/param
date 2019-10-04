import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

import Icon from "../Icon";
import Tooltip from "../Tooltip";

import styles from './index.scss';


const MODES = {
  NORMAL: "normal",
  PLUS: "plus",
};

/** General input container */
class Input extends Component {

  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  state = {
    focus: false,
    isCaretUp: this.props.isCaretUp,
    type: this.props.type
  };

  componentDidMount() {
    const {
      autoFocus,
      value,
      disabled,
      readOnly,
    } = this.props;

    if (autoFocus && !disabled && !readOnly) {
      this._onFocus();
      value && this.input.current.setSelectionRange(value.length * 2, value.length * 2);
    }
  }

  isMoreThanMax = () => typeof this.props.max !== 'undefined' && this.props.value >= this.props.max;

  isLessThanMin = () => typeof this.props.min !== 'undefined' && this.props.value <= this.props.min;

  renderArrowBox = ({isArrowPositionLeft, isMorePosition, content}) => {
    const arrBoxCls = classNames(styles['caret-box'], styles['is-column'], {
        [styles['is-right-border']]: typeof isArrowPositionLeft !== 'undefined' ? isArrowPositionLeft : !isMorePosition
    });

    return (
      <div className={arrBoxCls}>
        {content.map ? content.map((cb, i) => cb({i})) : content()}
      </div>
    );
  };

  renderArrow = (content, isMorePosition) => ({i = 1} = {}) => {
    const {maxDisabledTooltipContent, minDisabledTooltipContent} = this.props;
    const isDisabled = isMorePosition
      ? this.isMoreThanMax()
      : this.isLessThanMin();

    const disabledMsg = isMorePosition
      ? maxDisabledTooltipContent
      : minDisabledTooltipContent;

    const arrCls = classNames(styles.caretWrapper, styles['wrap-hook'], {
      [styles[`arrowColor-${this.props.arrowColor}`]]: !isDisabled,
      [styles['arrowColor-disabled']]: isDisabled,
    });

    return (
      <Tooltip
        content={disabledMsg}
        disabled={!isDisabled && !!(maxDisabledTooltipContent || minDisabledTooltipContent)}
      >
        <div
          key={i}
          className={arrCls}
          onClick={this._onArrowClick({isMore: isMorePosition, isDisabled})}
        >
          {content}
        </div>
      </Tooltip>
    );
  };

  renderPlusBtn = (isMorePosition) => {
    return this.renderArrowBox({
      isMorePosition,
      content: this.renderArrow(
        <Icon
          cursor="pointer"
          icon={isMorePosition ? 'plus' : 'minus'}
          size="md"
          position="center"
          classname={styles.caret}
        />,
        isMorePosition
      )
    });
  };

  renderArrowsBtn = (isArrowPositionLeft) => {
      return this.renderArrowBox({
        isArrowPositionLeft,
        content: [
          this.renderArrow(
            <Icon
              cursor="pointer"
              icon="caret-up"
              size="xxs"
              position="center"
              classname={styles.caret}
            />,
            true
          ),
          this.renderArrow(
            <Icon
              cursor="pointer"
              icon="caret-up"
              size="xxs"
              position="center"
              classname={`${styles.caret} ${styles['caret-down']}`}
            />
          )
        ]
      });
  };

  renderClearBtn = () => (
    <div
      className={`${styles['caret-box']} ${styles['without-border']} ${styles['wrap-hook']}`}
      onClick={!!this.props.value ? this._onClear : undefined}
    >
      { !!this.props.value &&
        <Icon
          cursor="pointer"
          icon="close"
          size="xxs"
          position="center"
        />
      }
    </div>
  );

  renderEye = () => {
    const { type } = this.state;

    return (
      <div
        className={`${styles['caret-box']} ${styles['wrap-hook']}`}
        onClick={this._changeType}
      >
        <Icon
          cursor="pointer"
          icon={ type === 'password' ? 'eye-blocked' : 'eye'}
          size="sm"
          position="center"
        />
      </div>
    );
  };

  renderCaret = () => {
    const { isCaretUp } = this.state;

    return (
      <div
        className={`${styles['caret-box']} ${styles['wrap-hook']}`}
        onClick={this.onClickCaret}
      >
        <Icon
          cursor="pointer"
          icon="caret-up"
          size="xxs"
          position="center"
          classname={isCaretUp ? styles.caret : `${styles.caret} ${styles['caret-down']}`}
        />
      </div>
    );
  };

  renderIcon = (customIcon, onClickCustom, isPrefix) => {
    const customClassName = classNames(
      styles['caret-box'],
      styles['wrap-hook'],
      {
        [styles['is-right-border']]: isPrefix
      }
    );

    return (
      <div
        className={customClassName}
        onClick={onClickCustom ? onClickCustom : undefined}
      >
        <Icon
          cursor="pointer"
          icon={customIcon}
          size="sm"
          position="center"
        />
      </div>
    );
  };

  getModeNumberInput = (isArrowPositionLeft, isRightPosition) => {
    let fn = null;
    if (this.props.type !== 'number') return fn;

    switch(this.props.mode) {
      case MODES.NORMAL: {
        const cond = (isRightPosition && !isArrowPositionLeft) || isArrowPositionLeft;
        fn = cond && this.renderArrowsBtn(isArrowPositionLeft);
        break;
      }
      case MODES.PLUS: {
        fn = this.renderPlusBtn(isRightPosition);
        break;
      }
      default: {
        break;
      }
    }

    return fn;
  };

  render(props = {}) {
    const { focus, type } = this.state;
    const {
      id,
      name,
      value,
      placeholder,
      withCaret,
      tabIndex,
      withClear,
      autoFocus,
      onKeyUp,
      onPaste,
      readOnly,
      maxLength,
      textOverflow,
      disabled,
      autocomplete,
      required,
      error,
      className,
      noLeftBorderRadius,
      noRightBorderRadius,
      size,
      alignText,
      isArrowPositionLeft,
      mode,
      min,
      max,
      withEye,
      prefixIcon,
      suffixIcon,
      onClickPrefix,
      onClickSuffix
    } = this.props;

    const inputClassName = classNames(
      styles.input,
      styles[`is-${alignText}`],
      {
        [className]: className,
        [styles.withoutPadding]: mode === MODES.PLUS,
      }
    );

    const classNameWrapper = classNames(
      styles['input-wrapper'],
      {
        [styles.disabled]: disabled,
        [styles['has-focus']]: focus,
        [styles['has-error']]: error,
        [styles[`size-${size}`]]: size,
        [styles.noLeftBorderRadius]: noLeftBorderRadius,
        [styles.noRightBorderRadius]: noRightBorderRadius
      }
    );

    const inputElement = (
      <input
        style={{textOverflow}}
        ref={this.input}
        className={inputClassName}
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={this._onChange}
        onKeyPress={this._onKeyPress}
        maxLength={maxLength}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onKeyDown={this._onKeyDown}
        onPaste={onPaste}
        placeholder={placeholder}
        tabIndex={tabIndex}
        autoFocus={autoFocus}
        onClick={this._onClick}
        onKeyUp={onKeyUp}
        readOnly={readOnly}
        type={type}
        required={required}
        autoComplete={autocomplete}
        min={min}
        max={max}
        {...omit(props, 'className')}
      />);

    return (<div className={classNameWrapper}>
      {prefixIcon && this.renderIcon(prefixIcon, onClickPrefix, true)}
      {this.getModeNumberInput(isArrowPositionLeft)}
      {inputElement}
      {withClear && !disabled && this.renderClearBtn()}
      {withEye && !disabled && this.renderEye()}
      {this.getModeNumberInput(isArrowPositionLeft, true)}
      {withCaret && this.renderCaret()}
      {suffixIcon && this.renderIcon(suffixIcon, onClickSuffix, false)}
    </div>);
  }

  focus = () => {
    this._onFocus();
    this.input && this.input.current.focus();
  };

  blur = () => {
    this.input && this.input.current.blur();
  };

  select = () => {
    this.input && this.input.current.select();
  };

  onClickCaret = () => {
    this.setState({ isCaretUp: !this.state.isCaretUp });
    this.props.onClickCaret();
  };

  _onFocus = e => {
    const { onFocus, autoSelect, disabled, readOnly } = this.props;

    if (!disabled && !readOnly) {
      this.setState({ focus: true });
      onFocus && onFocus(e);

      if (autoSelect) {
        setTimeout(() => this.select());
      }
    }
  };

  _changeType = () => {
    this.setState({
      type: this.state.type === 'text' ? 'password' : 'text'
    });
  };

  _onArrowClick = ({isMore, isDisabled} = {}) => () => {
    if (isDisabled) return;
    const { value } = this.props;
    const target = { value };

    !!this.props.value
      ? isMore
        ? ++target.value : --target.value
      : isMore
        ? target.value = 1 : target.value = -1;

    this._onChange({ target })
  };

  _onBlur = e => {
    const { onBlur } = this.props;

    this.setState({
      focus: false
    });

    onBlur && onBlur(e);
  };

  _onClick = e => {
    this.props.onInputClicked && this.props.onInputClicked(e);
  };

  _onKeyDown = e => {
    this.props.onKeyDown && this.props.onKeyDown(e);

    if (e.keyCode === 13 /* enter */) {
      this.props.onEnterPressed && this.props.onEnterPressed(e);
    } else if (e.keyCode === 27 /* esc */) {
      this.props.onEscapePressed && this.props.onEscapePressed(e);
    }
  };

  _isInvalidNumber = value => !(/^[\d.,\-+]*$/.test(value));

  _onChange = e => {
    const { onChange, min, max } = this.props;
    const { type } = this.state;

    if (type === 'number') {
      if (this._isInvalidNumber(e.target.value)) return;

      if (typeof max !== 'undefined' && max < e.target.value) {
        e.target.value = max;
        this.select();
      }

      if (typeof min !== 'undefined' && min > e.target.value) {
        e.target.value = min;
        this.select();
      }
    }

    onChange && onChange(e);
  };

  _onKeyPress = e => {
    if (this.state.type === 'number' && this._isInvalidNumber(e.key)) {
      e.preventDefault();
    }
  };

  _onClear = () => {
    this.input.current.value = '';
    this.focus();

    this._onChange({
      target: {
        value: ''
      }
    });
  }
}

Input.displayName = 'Input';

Input.defaultProps = {
  autoSelect: true,
  size: 'normal',
  textOverflow: 'clip',
  maxLength: 64000,
  withClear: false,
  isArrowPositionLeft: false,
  isCaretUp: false,
  mode: MODES.NORMAL,
  arrowColor: 'gray'
};

Input.propTypes = {
  autoFocus: PropTypes.bool,
  autoSelect: PropTypes.bool,
  autocomplete: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  id: PropTypes.string,
  maxLength: PropTypes.number,
  tabIndex: PropTypes.number,
  textOverflow: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
  noLeftBorderRadius: PropTypes.bool,
  noRightBorderRadius: PropTypes.bool,
  onInputClicked: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onEnterPressed: PropTypes.func,
  onEscapePressed: PropTypes.func,
  placeholder: PropTypes.string,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPaste: PropTypes.func,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['small', 'normal', 'large', 'huge']),
  isCaretUp: PropTypes.bool,
  onClickCaret: PropTypes.func,
  withCaret: PropTypes.bool,
  withClear: PropTypes.bool,
  withEye: PropTypes.bool,
  alignText: PropTypes.oneOf(['left', 'center', 'right']),
  mode: PropTypes.oneOf([MODES.PLUS, MODES.NORMAL]),
  arrowColor: PropTypes.oneOf(['green', 'gray']),
  type: PropTypes.string,
  isArrowPositionLeft: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  prefixIcon: PropTypes.string,
  onClickPrefix: PropTypes.func,
  suffixIcon: PropTypes.string,
  onClickSuffix: PropTypes.func,
  maxDisabledTooltipContent: PropTypes.any,
  minDisabledTooltipContent: PropTypes.any,
};

export default Input;
