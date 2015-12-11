var MeaningList = React.createClass({
    render: function () {
        var meanings = this.props.value;
        var nodes = [];
        if (meanings) {
            nodes = meanings.map(function (meaning) {
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