var React = require('react');
var ReactDOM = require('react-dom');
var Page = require('./components/Page');
var WordList = require('./components/WordList');
var APPLICATION_PROPERTIES = require('./properties');

ReactDOM.render(
    <Page pageTitle="Dictionary" pageSubtitle={"version: " + APPLICATION_PROPERTIES.version}>
        <WordList src={APPLICATION_PROPERTIES.base_url + "words"}
                  pollInterval={2000}/>
    </Page>,
    document.getElementById('content')
);


