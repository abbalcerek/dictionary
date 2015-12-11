var WordRow = React.createClass({displayName: "WordRow",
    render: function () {
        return (
            React.createElement("div", {className: "word"},
                React.createElement("div", {className: "value"},
                    React.createElement("div", {className: "row"},
                        React.createElement("div", {className: ".col-xs-12"},
                            React.createElement("button", {className: "word-value btn btn-lg btn-link",
                                    "data-toggle": "collapse",
                                    "data-target": "#" + this.props.word + "meaning",
                                    role: "button"},
                                React.createElement("strong", null, this.props.word)
                            ),
                            React.createElement("span", {className: "glyphicon glyphicon-volume-up", onClick: this.onClickListener}),
                            React.createElement("span", {className: "glyphicon glyphicon-remove", onClick: this.onRemoveListener}),
                            React.createElement("audio", {controls: true, ref: (ref) => this.audio = ref, className: "hidden"},
                                React.createElement("source", {src: this.props.speaker, type: "audio/mpeg"}),
                                "Your browser does not support the audio element."
                            )
                        )
                    )
                ),
                React.createElement("div", {id: this.props.word + "meaning", className: "collapse"},
                    React.createElement("a", {href: "http://dictionary.reference.com/browse/" + this.props.word},
                        React.createElement("em", null, "source")
                    ),
                    React.createElement(MeaningList, {value: this.props.meanings})
                )
            )
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