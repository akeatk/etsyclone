import React from 'react';

class StaticImg extends React.Component{
  constructor(props){
    super(props);
    this.state={ready:false};

    this.imgRatio=null;
    this.ratio = parseInt(props.width) / parseInt(props.height);

    this.img = new Image();
    this.img.onload = ()=>{
      this.imgRatio = this.img.width / this.img.height;
      this.setState({ready:true})
    }
    this.img.src = this.props.src;


    this.divStyle={
      minWidth:props.width,
      maxWidth:props.width,
      width:props.width,
      minHeight:props.height,
      maxHeight:props.height,
      height:props.height
    };

  }
  render(){
    if(!this.state.ready)
      return null;
    if(this.imgRatio < this.ratio)
      return (
        <div id='tall-image'
          className={(this.props.round ? 'round prof-img ' : 'prof-img ')+this.props.className}
          style={this.divStyle} onClick={this.props.onClick}>
          <img src={this.props.src} style={{width:this.props.width}}/>
        </div>
      );
    return (
      <div id='flat-image'
        className={(this.props.round ? 'round prof-img ' : 'prof-img ')+this.props.className}
        style={this.divStyle} onClick={this.props.onClick}>
        <img src={this.props.src} style={{height:this.props.height}}/>
      </div>
    );
  }
}

export default StaticImg;
