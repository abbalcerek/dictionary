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