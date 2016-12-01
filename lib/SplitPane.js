'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireDefault(_Pane);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireDefault(_Resizer);

var _reactVendorPrefix = require('react-vendor-prefix');

var _reactVendorPrefix2 = _interopRequireDefault(_reactVendorPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'SplitPane',
    getInitialState: function getInitialState() {
        return {
            active: false,
            resized: false
        };
    },
    getDefaultProps: function getDefaultProps() {
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
    componentDidMount: function componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onResize);
        this.setInitialWindowSize();
        var ref = this.refs.pane1;
        if (ref && this.props.defaultSize && !this.state.resized) {
            ref.setState({
                size: this.props.defaultSize
            });
            this.paneSize = parseInt(this.props.defaultSize);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onResize);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var ref = this.refs.pane1;
        var size = nextProps.size;
        if (size) {
            ref.setState({
                size: size
            });
            this.paneSize = parseInt(size);
        }
    },
    setInitialWindowSize: function setInitialWindowSize() {
        this.initialWindowSize = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        };
    },
    onResize: function onResize(event) {
        if (!this.paneSize) {
            return false;
        }
        var ref = this.refs.pane1;
        var newSize = void 0;
        if (this.props.split === 'vertical') {
            newSize = window.innerWidth / this.initialWindowSize.innerWidth * this.paneSize;
        } else {
            newSize = window.innerHeight / this.initialWindowSize.innerHeight * this.paneSize;
        }
        if (newSize < this.props.minSizeLeft) {
            newSize = this.props.minSizeLeft;
        }
        ref.setState({
            size: newSize + "px"
        });
    },
    onMouseDown: function onMouseDown(event) {
        if (!this.props.allowResize) {
            return false;
        }
        var position = this.props.split === 'vertical' ? event.clientX : event.clientY;

        var splitPane = this.refs.splitPane;
        var resizer = this.refs.resizer;
        var splitPaneBoundingRect = _reactDom2.default.findDOMNode(splitPane).getBoundingClientRect();
        var resizerBoundingRect = _reactDom2.default.findDOMNode(resizer).getBoundingClientRect();

        var widthSplitPane = splitPaneBoundingRect.width;
        var heightSplitPane = splitPaneBoundingRect.height;
        var splitPaneSize = this.props.split === 'vertical' ? widthSplitPane : heightSplitPane;

        var widthResizer = resizerBoundingRect.width;
        var heightResizer = resizerBoundingRect.height;
        var resizerSize = this.props.split === 'vertical' ? widthResizer : heightResizer;

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
    onMouseMove: function onMouseMove(event) {
        if (!this.props.allowResize) {
            return false;
        }
        if (this.state.active) {
            var ref = this.refs.pane1;
            if (ref) {
                var node = _reactDom2.default.findDOMNode(ref);
                if (node.getBoundingClientRect) {
                    var width = node.getBoundingClientRect().width;
                    var height = node.getBoundingClientRect().height;
                    var current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    var size = this.props.split === 'vertical' ? width : height;
                    var position = this.state.position;

                    var newSize = size - (position - current);
                    this.setState({
                        position: current,
                        resized: true
                    });

                    if (newSize >= this.props.minSizeLeft && this.state.splitPaneSize - this.state.resizerSize - newSize >= this.props.minSizeRight) {
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
    onMouseUp: function onMouseUp() {
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


    merge: function merge(into, obj) {
        for (var attr in obj) {
            into[attr] = obj[attr];
        }
    },

    render: function render() {

        var split = this.props.split;

        var style = {
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

        var children = this.props.children;
        var classes = ['SplitPane', split, this.props.className];
        var prefixed = _reactVendorPrefix2.default.prefix({ styles: style });
        var resizerChild = this.props.resizerChildNode;
        if (this.props.resizerChildNode) {
            resizerChild = _react2.default.cloneElement(resizerChild, {
                disabled: !this.props.allowResize
            });
        }
        return _react2.default.createElement(
            'div',
            { className: classes.join(' '), style: prefixed.styles, ref: 'splitPane' },
            _react2.default.createElement(
                _Pane2.default,
                { ref: 'pane1', key: 'pane1', split: split, className: this.props.paneClassName },
                children[0]
            ),
            _react2.default.createElement(_Resizer2.default, { ref: 'resizer', key: 'resizer', onMouseDown: this.onMouseDown, child: resizerChild, split: split }),
            _react2.default.createElement(
                _Pane2.default,
                { ref: 'pane2', key: 'pane2', split: split, className: this.props.paneClassName },
                children[1]
            )
        );
    }
});
module.exports = exports['default'];