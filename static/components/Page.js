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