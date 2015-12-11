var APPLICATION_PROPERTIES = {
    author: "Adam Balcerek",
    version: 0.1,
    base_url: "http://localhost:5000/"
};
String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};
var MeaningList = React.createClass({displayName: "MeaningList",
    render: function () {
        var meanings = this.props.value;
        var nodes = [];
        if (meanings) {
            nodes = meanings.map(function (meaning) {
                return (
                    React.createElement("li", {key: meaning.hashCode()}, 
                        meaning
                    )
                )
            });
        }
        return (
            React.createElement("ol", null, 
                nodes
            )
        );
    }
});
var Page = React.createClass({displayName: "Page",
    render: function () {
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "page-header jumbotron"}, 
                    React.createElement("h1", null, this.props.pageTitle), 

                    React.createElement("p", null, React.createElement("em", null, this.props.pageSubtitle))
                ), 
                React.createElement("div", {nameClass: "page-content"}, 
                    this.props.children
                )
            )
        );
    }
});
var WordForm = React.createClass({displayName: "WordForm",
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
            React.createElement("form", {className: "word-form", 
                  onSubmit: this.handleSubmit}, 
                React.createElement("input", {type: "text", 
                       placeholder: "New word", 
                       value: this.state.word, 
                       onChange: this.handleChange}
                    ), 
                React.createElement("input", {type: "submit", value: "Find"})
            )
        );
    }
});
var WordList = React.createClass({displayName: "WordList",

    loadWordsFromServer: function () {
        $.ajax({
            url: this.props.src,
            dataType: 'jsonp',
            cache: false,
            success: function (data) {
                this.setState({data: data});
                console.log(data);
            }.bind(this)
        });
    },
    handleWordSubmit(wordString) {
        console.log(wordString)
        $.ajax({
            url: "http://localhost:5000/word/" + wordString,
            dataType: 'jsonp',
            type: 'PUT',
            success: function (data) {
                console.log(data);
                if (!this.state.data.words) {
                    this.setState(this.state.data.words = [data]);
                } else {
                    console.log("helo world");
                    var newWords = this.state.data.words;
                    console.log(this.state);
                    newWords.push(data);
                    this.setState({"data": {"words": newWords}});
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleRemoveWord: function (word) {
        console.log("deleting: " + word);
        $.ajax({
            url: APPLICATION_PROPERTIES.base_url + "delete/" + word,
            type: 'DELETE',
            dataType: 'jsonp',
            cache: false,
            success: function (data) {
                console.log("data before: ");
                console.log(data);
                this.setState({
                    data: {
                        words: this.state.data.words.filter(
                            function (wordObject) {
                                return wordObject.word != word
                            })
                    }
                });
                console.log("data after: ");
                console.log(data);
            }.bind(this)
        });
    },

    getInitialState: function () {
        return {data: {"words": []}};
    },
    componentDidMount: function () {
        this.loadWordsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function () {
        var words = this.state.data;
        var rows = [];
        for (var i = 0; i < words.words.length; i++) {
            rows.push(
                React.createElement("div", {className: "word-row-container"}, 
                    React.createElement(WordRow, {word: words.words[i].word, 
                             meanings: words.words[i].content.meaning, 
                             key: words.words[i].word, 
                             speaker: words.words[i].content.speaker, 
                             onRemove: this.handleRemoveWord})
                )
            );
        }
        return (
            React.createElement("div", {id: "words"}, 
                React.createElement(WordForm, {onWordSubmit: this.handleWordSubmit}), 
                rows
            )
        );
    }
});
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

ReactDOM.render(
    React.createElement(Page, {pageTitle: "Dictionary", pageSubtitle: "version: " + APPLICATION_PROPERTIES.version}, 
        React.createElement(WordList, {src: APPLICATION_PROPERTIES.base_url + "words", 
                  pollInterval: 2000})
    ),
    document.getElementById('content')
);


