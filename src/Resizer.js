'use strict';

import React from 'react';


export default React.createClass({

    onMouseDown(event) {
        this.props.onMouseDown(event);
    },

    render() {
        const split = this.props.split;
        const classes = ['Resizer', split];
        const child = React.cloneElement(this.props.child, {
           disabled: this.props.disabled
        });
        return (
            <span className={classes.join(' ')} onMouseDown={this.onMouseDown}>
                {child}
            </span>
        );
    }
});


