
var Page = React.createClass({
    render: function () {
        return (
            <div className="container">
                <div className="page-header jumbotron">
                    <h1>{this.props.pageTitle}</h1>
                    <p><em>{this.props.pageSubtitle}</em></p>
                </div>
                <div nameClass="page-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

var WordRow = React.createClass( {
    render: function() {
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
                                <source src={this.props.speaker} type="audio/mpeg" />
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
    onClickListener: function() {
        if (this.audio) {
            console.log(this.audio);
            this.audio.play();
        }
    },
    onRemoveListener: function() {
        //this.removeFromServer();
        this.props.onRemove(this.props.word);
    },
    removeFromServer: function() {
        console.log("deleting: " + this.props.word);
        $.ajax({
          url: APPLICATION_PROPERTIES.base_url + "delete/" + this.props.word,
          type: 'DELETE',
          dataType: 'jsonp',
          cache: false,
          success: function(data) {
              this.removeFromView();
              console.log(data);
          }.bind(this)
        });
    },
    removeFromView: function() {

    }
});

var MeaningList = React.createClass({
    render: function() {
        var meanings = this.props.value;
        var nodes = [];
        if (meanings) {
            nodes = meanings.map(function(meaning) {
                return (
                   <li key={meaning.hashCode()}>
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

var WordList = React.createClass({

    loadCommentsFromServer: function() {
        $.ajax({
          url: this.props.src,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
              console.log(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, <statu></statu>, err.toString());
          }.bind(this)
        });
    },
    handleWordSubmit(wordString) {
        console.log(wordString)
        $.ajax({
            url: "http://localhost:5000/word/" + wordString,
            dataType: 'jsonp',
            type: 'PUT',
            success: function(data) {
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
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleRemoveWord: function(word) {
        console.log("deleting: " + word);
        $.ajax({
          url: APPLICATION_PROPERTIES.base_url + "delete/" + word,
          type: 'DELETE',
          dataType: 'jsonp',
          cache: false,
          success: function(data) {
              this.setState({data: {words: this.state.data.words.filter(
                  function (wordObject) {return wordObject.word != word})
              }});
              console.log(data);
          }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: {"words": []}};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
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

var WordForm = React.createClass({
    getInitialState: function() {
        return {word: ''};
    },
    handleChange: function(e) {
        this.setState({word: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var word = this.state.word.trim();
        if (!word) {
          return;
        }
        this.props.onWordSubmit(word);
    this.setState({word: ''});
  },

    render: function() {

        return (
          <form className="word-form"
              onSubmit={this.handleSubmit}>
            <input type="text"
                   placeholder="New word"
                   value={this.state.word}
                   onChange={this.handleChange}
                />
            <input type="submit" value="Find" />
          </form>
        );
  }
});

ReactDOM.render(
  <Page pageTitle="Dictionary" pageSubtitle={"version: " + APPLICATION_PROPERTIES.version}>
      <WordList src={APPLICATION_PROPERTIES.base_url + "words"}
                pollInterval={2000}/>
  </Page>,
  document.getElementById('content')
);


