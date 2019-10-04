import React, { Component } from 'react';
import propTypes from 'prop-types';

import styles from './index.scss';


class Spinner extends Component {
    static displayName = 'Button';

    static propTypes = {
        type: propTypes.oneOf(['Default', 'Diamond']),
        top: propTypes.number,
        left: propTypes.number,
        size: propTypes.oneOf(['small', 'medium', 'big']),
    };

    static defaultProps = {
        type: 'Default',
        size: 'medium',
    };

    renderDefault = () => <div data-cid="spinner" className={`${styles.defaultSpinner} ${styles[this.props.size]}`} />;

    renderDiamond = () =>
        <div className={styles.diamondLoader}>
            <div className={styles.row}>
                <div className={`${styles.arrow} ${styles['outer-18']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-17']}`} />
                <div className={`${styles.arrow} ${styles['outer-16']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-15']}`} />
                <div className={`${styles.arrow} ${styles['outer-14']}`} />
            </div>
            <div className={styles.row}>
                <div className={`${styles.arrow} ${styles['outer-1']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-2']}`} />
                <div className={`${styles.arrow} ${styles['inner-6']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['inner-5']}`} />
                <div className={`${styles.arrow} ${styles['inner-4']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-13']}`} />
                <div className={`${styles.arrow} ${styles['outer-12']}`} />
            </div>
            <div className={styles.row}>
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-3']}`} />
                <div className={`${styles.arrow} ${styles['outer-4']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['inner-1']}`} />
                <div className={`${styles.arrow} ${styles['inner-2']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['inner-3']}`} />
                <div className={`${styles.arrow} ${styles['outer-11']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-10']}`} />
            </div>
            <div className={styles.row}>
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-5']}`} />
                <div className={`${styles.arrow} ${styles['outer-6']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-7']}`} />
                <div className={`${styles.arrow} ${styles['outer-8']}`} />
                <div className={`${styles.arrow} ${styles.down} ${styles['outer-9']}`} />
            </div>
        </div>;

    render() {
        const loaderStyles = {style: {}};

        if (this.props.top) loaderStyles.style.top = `${this.props.top}px`;
        if (this.props.left) loaderStyles.style.left = `${this.props.left}px`;

        return (
            <div className={styles.wrapper} {...loaderStyles}>
                {this[`render${this.props.type}`]()}
            </div>
        );
    }
}

export default Spinner;