var React = require('react');

module.exports = React.createClass({
    getInitialState: function () {
        return {word: ''};
    },
    handleChange: function (e) {
        this.setState({word: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var word = this.state.word.trim();
        if (!word) {
            return;
        }
        this.props.onWordSubmit(word);
        this.setState({word: ''});
    },

    render: function () {

        return (
            <form className="word-form"
                  onSubmit={this.handleSubmit}>
                <input type="text"
                       placeholder="New word"
                       value={this.state.word}
                       onChange={this.handleChange}
                    />
                <input type="submit" value="Find"/>
            </form>
        );
    }
});