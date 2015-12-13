var React = require('react');
var utils = require('./../utils');

module.exports = React.createClass({
    render: function () {
        var meanings = this.props.value;
        var nodes = [];
        if (meanings) {
            nodes = meanings.map(function (meaning) {
                return (
                    <li key={utils.hashCode(meaning)}>
                        {meaning}
                    </li>
                )
            });
        }
        return (
            <ol>
                {nodes}
            </ol>
        );
    }
});