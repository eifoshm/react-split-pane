import React from 'react';
import ReactDOM from 'react-dom';
import SplitPane from '../lib/SplitPane';


var Example = React.createClass({
    render: function() {
        var header = {
            width: '100%',
            background: 'grey',
            height: '200px'
        };
        return (
            <div>
            <div className="header"></div>
            <SplitPane split="vertical" minSize="50" defaultSize="100" height="400" width="70%">
                <div></div>
                <SplitPane split="horizontal" minSize="50">
                    <div></div>
                    <SplitPane split="vertical" minSize="50">
                        <div></div>
                        <div></div>
                    </SplitPane>
                </SplitPane>
            </SplitPane>
            </div>
        );
    }

});


ReactDOM.render(<Example />, document.getElementById("container"));