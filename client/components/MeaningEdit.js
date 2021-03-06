var React = require('react');
var InlineEdit = require('react-inline-edit');

module.exports = React.createClass({

  getInitialState: {
    text: '',
    editing: false
  },

  render: function(){
    return (
      <div>
        <InlineEdit
          tagName='div'
          className='name-field'
          onChange={this.onChange}
          onEnterKey={this.onSave}
          onEscapeKey={this.onCancel}
          text={this.state.text}
          placeholder='Your Name'
          autoFocus={true}
          maxLength={200}
          editing={this.state.editing}
        />
        <button onClick={this.enableEditing}>
          Enable Editing
        </button>
      </div>
    );
  },

  onSave: function() {
    // logic to save this.state.text here
    this.replaceState(this.getInitialState())
  },

  onCancel: function() {
    this.replaceState(this.getInitialState())
  },

  onChange: function(text) {
    // in order to render the updated text,
    // you need to pass it as a prop to contentEditable.
    // This gives you increased flexibility.
    this.setState({ text: text });
  },

  enableEditing: function(){
    // contenteditable field set to edit mode.
    this.setState({ editing: true });
  }

});