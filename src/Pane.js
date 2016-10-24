'use strict';

import React from 'react';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({


    getInitialState() {
        return {};
    },


    render() {
        const split = this.props.split;
        const classes = ['Pane', split, this.props.className];

        let style = {
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'auto'
        };
        if (this.state.size) {
            if (split === 'vertical') {
                style.minWidth = this.state.size;
            } else {
                style.minHeight = this.state.size;
                style.display = 'flex';
            }
            style.flex = 'none';
        }
        const prefixed = VendorPrefix.prefix({styles: style});

        return (<div className={classes.join(' ')} style={prefixed.styles}>{this.props.children}</div>);
    }
});


