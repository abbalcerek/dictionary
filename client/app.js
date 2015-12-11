
ReactDOM.render(
    <Page pageTitle="Dictionary" pageSubtitle={"version: " + APPLICATION_PROPERTIES.version}>
        <WordList src={APPLICATION_PROPERTIES.base_url + "words"}
                  pollInterval={2000}/>
    </Page>,
    document.getElementById('content')
);


