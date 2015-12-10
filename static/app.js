
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
        this.removeFromServer();
    },
    removeFromServer: function() {
        console.log("deleting: " + this.props.word);
        $.ajax({
          url: "http://127.0.0.1:5000/delete/" + this.props.word,
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
                <WordRow word={words.words[i].word}
                         meanings={words.words[i].content.meaning}
                         key={words.words[i].word}
                         speaker={words.words[i].content.speaker}/>
            );
        }
        return (
            <div id="words">{rows}</div>
        );
    }
});

ReactDOM.render(
  <Page pageTitle="Dictionary" pageSubtitle="by Adam Balcerek">
      <WordList src="http://localhost:5000/words"
                pollInterval={2000}/>
  </Page>,
  document.getElementById('content')
);


