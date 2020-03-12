class PopUp extends React.Component {
  const popUpStyle = {
    
  };
  render() {
    var X = this.props.style;
    Object.assign(X, popUpStyle);
    return <div id={this.props.id} className={this.props.className} style={X}>{this.props.children}</div>;
  }
};
