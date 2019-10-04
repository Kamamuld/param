import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonLayout from '../ButtonLayout';
import omit from 'lodash/omit';


class Button extends Component {
  static displayName = 'Button';

  static defaultProps = {
    ...ButtonLayout.defaultProps,
    type: 'button',
    dataCid: ""
  };

  render() {
    const { disabled, onClick, children, type, dataCid, id } = this.props;

    const buttonLayoutProps = omit(this.props, [
      'сhildren', 'onClick', 'type', 'dataCid'
    ]);

    return (
      <ButtonLayout {...buttonLayoutProps}>
        <button
          data-cid={dataCid}
          id={id}
          onClick={onClick}
          onDoubleClick={onClick}
          disabled={disabled}
          type={type}
        >
          {children}
        </button>
      </ButtonLayout>
    );
  }
}

Button.propTypes = {
  ...ButtonLayout.propTypes,
  children: PropTypes.node,
  type: PropTypes.string,
  onClick: PropTypes.func,
  dataCid: PropTypes.string,
  style: PropTypes.object
};

export default Button;
