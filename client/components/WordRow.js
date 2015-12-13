var React = require('react');
var MeaningList = require('./MeaningList');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="word">
                <div className="value">
                    <div className="row">
                        <div className=".col-xs-12">
                            <button className="word-value btn btn-lg btn-link"
                                    data-toggle="collapse"
                                    data-target={"#" + this.props.word + "meaning"}
                                    role="button">
                                <strong>{this.props.word}</strong>
                            </button>
                            <span className="glyphicon glyphicon-volume-up" onClick={this.onClickListener}></span>
                            <span className="glyphicon glyphicon-remove" onClick={this.onRemoveListener}></span>
                            <audio controls ref={(ref) => this.audio = ref} className="hidden">
                                <source src={this.props.speaker} type="audio/mpeg"/>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
                <div id={this.props.word + "meaning"} className="collapse">
                    <a href={"http://dictionary.reference.com/browse/" + this.props.word}>
                        <em>source</em>
                    </a>
                    <MeaningList value={this.props.meanings}/>
                </div>
            </div>
        );
    },
    onClickListener: function () {
        if (this.audio) {
            console.log(this.audio);
            this.audio.play();
        }
    },
    onRemoveListener: function () {
        this.props.onRemove(this.props.word);
    }
});