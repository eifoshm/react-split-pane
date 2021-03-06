'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Pane from './Pane';
import Resizer from './Resizer';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({

    getInitialState() {
        return {
            active: false,
            resized: false
        };
    },


    getDefaultProps() {
        return {
            split: 'vertical',
            minSizeLeft: 0,
            minSizeRight: 0,
            height: '100%',
            width: '100%',
            resizerChildNode: null,
            allowResize: true
        };
    },


    componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onResize);
        this.setInitialWindowSize();
        const ref = this.refs.pane1;
        if (ref && this.props.defaultSize && !this.state.resized) {
            ref.setState({
                size: this.props.defaultSize
            });
            this.paneSize = parseInt(this.props.defaultSize);
        }
    },


    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onResize);
    },

    componentWillReceiveProps(nextProps) {
        const ref = this.refs.pane1;
        const size = nextProps.size;
        if (size) {
            ref.setState({
                size: size
            });
            this.paneSize = parseInt(size);
        }
    },

    setInitialWindowSize() {
        this.initialWindowSize = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        };
    },

    onResize(event) {
        if (!this.paneSize) {
            return false;
        }
        const ref = this.refs.pane1;
        let newSize;
        if (this.props.split === 'vertical') {
            newSize = (window.innerWidth / this.initialWindowSize.innerWidth) * this.paneSize
        } else {
            newSize = (window.innerHeight / this.initialWindowSize.innerHeight) * this.paneSize
        }
        if (newSize < this.props.minSizeLeft) {
            newSize = this.props.minSizeLeft;
        }
        ref.setState({
            size: newSize + "px"
        });
    },

    onMouseDown(event) {
        if (!this.props.allowResize) {
            return false;
        }
        let position = this.props.split === 'vertical' ? event.clientX : event.clientY;

        const splitPane = this.refs.splitPane;
        const resizer = this.refs.resizer;
        const splitPaneBoundingRect = ReactDOM.findDOMNode(splitPane).getBoundingClientRect();
        const resizerBoundingRect = ReactDOM.findDOMNode(resizer).getBoundingClientRect();

        const widthSplitPane = splitPaneBoundingRect.width;
        const heightSplitPane = splitPaneBoundingRect.height;
        const splitPaneSize = this.props.split === 'vertical' ? widthSplitPane : heightSplitPane;

        const widthResizer = resizerBoundingRect.width;
        const heightResizer = resizerBoundingRect.height;
        const resizerSize = this.props.split === 'vertical' ? widthResizer : heightResizer;

        if (typeof this.props.onDragStarted === 'function') {
            this.props.onDragStarted();
        }

        this.setState({
            active: true,
            position: position,
            splitPaneSize: splitPaneSize,
            resizerSize: resizerSize
        });
    },


    onMouseMove(event) {
        if (!this.props.allowResize) {
            return false;
        }
        if (this.state.active) {
            const ref = this.refs.pane1;
            if (ref) {
                const node = ReactDOM.findDOMNode(ref);
                if (node.getBoundingClientRect) {
                    const width = node.getBoundingClientRect().width;
                    const height = node.getBoundingClientRect().height;
                    const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    const size = this.props.split === 'vertical' ? width : height;
                    const position = this.state.position;

                    const newSize = size - (position - current);
                    this.setState({
                        position: current,
                        resized: true
                    });

                    if (newSize >= this.props.minSizeLeft &&
                        this.state.splitPaneSize - this.state.resizerSize - newSize >= this.props.minSizeRight) {
                        if (this.props.onChange) {
                          this.props.onChange(newSize);
                        }
                        ref.setState({
                            size: newSize + "px"
                        });
                        this.paneSize = newSize;
                    }
                }
            }
        }
    },


    onMouseUp() {
        if (!this.props.allowResize) {
            return false;
        }

        if (typeof this.props.onDragFinished === 'function') {
            this.props.onDragFinished();
        }

        this.setState({
            active: false
        });
    },


    merge: function (into, obj) {
        for (let attr in obj) {
            into[attr] = obj[attr];
        }
    },


    render() {

        const split = this.props.split;

        let style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden'
        };

        style.userSelect = this.state.active ? 'none' : 'auto';

        if (split === 'vertical') {
            this.merge(style, {
                flexDirection: 'row',
                height: this.props.height,
                position: 'absolute',
                left: 0,
                right: 0,
                width: this.props.width
            });
        } else {
            this.merge(style, {
                flexDirection: 'column',
                height: this.props.height,
                minHeight: this.props.height,
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: this.props.width
            });
        }

        const children = this.props.children;
        const classes = ['SplitPane', split, this.props.className];
        const prefixed = VendorPrefix.prefix({styles: style});
        let resizerChild = this.props.resizerChildNode;
        if (this.props.resizerChildNode) {
            resizerChild = React.cloneElement(resizerChild, {
                disabled: !this.props.allowResize
            });
        }
        return (
            <div className={classes.join(' ')} style={prefixed.styles} ref="splitPane">
                <Pane ref="pane1" key="pane1" split={split} className={this.props.paneClassName}>{children[0]}</Pane>
                <Resizer ref="resizer" key="resizer" onMouseDown={this.onMouseDown} child={resizerChild} split={split} />
                <Pane ref="pane2" key="pane2" split={split} className={this.props.paneClassName}>{children[1]}</Pane>
            </div>
        );
    }
});
