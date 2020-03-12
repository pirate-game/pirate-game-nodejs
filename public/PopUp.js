class PopUp extends React.Component {
  render() {
    return <div id={this.props.id} className={this.props.className+" popUp"} style={this.props.style}>{this.props.children}</div>;
  }
};
