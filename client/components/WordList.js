var WordList = React.createClass({

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
                <div className="word-row-container">
                    <WordRow word={words.words[i].word}
                             meanings={words.words[i].content.meaning}
                             key={words.words[i].word}
                             speaker={words.words[i].content.speaker}
                             onRemove={this.handleRemoveWord}/>
                </div>
            );
        }
        return (
            <div id="words">
                <WordForm onWordSubmit={this.handleWordSubmit}></WordForm>
                {rows}
            </div>
        );
    }
});