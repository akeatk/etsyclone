import React from 'react';
import {connect} from 'react-redux';
import {Link,withRouter,Redirect} from 'react-router-dom';
import {getItem} from '../../actions/item_actions';
import {createCartItem} from '../../actions/cart_item_actions';
import {showLogin} from '../../actions/ui_actions';
import {createReview,updateReview} from '../../actions/review_actions';
import ReviewStars from '../review_stars';
import StaticImg from '../static_img';


const mapStateToProps = (state,ownProps) => {
  let items=state.entities.items;
  let item= items ? items[ownProps.match.params.itemId] : null;
  let user= item ? state.entities.users[item.user_id] : null;
  return {
    items,
    item,
    user,
    users:state.entities.users,
    photos:state.entities.photos,
    currentUserId:state.session.currentUser,
    currentReviewId:state.entities.reviews.current,
    reviews:state.entities.reviews,
    reviewIds:state.entities.reviews.review_ids || [],
    reviewable:state.entities.reviews.purchase
  };
};

const MapDispatchToProps = dispatch => ({
  getItem: itemId=>dispatch(getItem(itemId)),
  createCartItem: cart_item=>dispatch(createCartItem(cart_item)),
  showLogin:()=>dispatch(showLogin()),
  createReview:review=>dispatch(createReview(review)),
  updateReview:review=>dispatch(updateReview(review))
});

class ShowItem extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loaded:false,
      showDescription:false,
      quantity:1,
      currentImg:0,
      editting:false,
      review:{
        id:null,
        item_id:null,
        body:'',
        score:3
      }
    };
    this.getLeftImg=this.getLeftImg.bind(this);
    this.getRightImg=this.getRightImg.bind(this);
    this.addToCart=this.addToCart.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.createReview=this.createReview.bind(this);
    this.updateReview=this.createReview.bind(this);
  }
  componentDidMount(){
    this.props.getItem(this.props.match.params.itemId)
      .then(()=>{
        if(this.props.currentReviewId){
          const i = this.props.currentReviewId;
          this.state.review.id=i;
          this.state.review.body=this.props.reviews[i].body;
          this.state.review.score=this.props.reviews[i].score;
        }
        this.state.review.item_id=this.props.item.id;
        this.setState({loaded:true});
        window.scrollTo(0, 0);
      },()=>this.props.history.push('/'));
  }
  componentWillReceiveProps(newProps){//componentDidUpdate
    if(newProps.currentUserId != this.props.currentUserId){
      this.props.getItem(this.props.match.params.itemId)
        .then(()=>{
          this.setState({loaded:true});
          window.scrollTo(0, 0);
        },()=>this.props.history.push('/'));
    }
    if(newProps.match.params.itemId !== this.props.match.params.itemId){
      this.setState({currentImg:0});
      this.props.getItem(newProps.match.params.itemId)
        .then(()=>{
            window.scrollTo(0, 0);
          },
          ()=>{
            window.scrollTo(0, 0);
            this.props.history.push('/');
          }
        );
    }
  }
  getLeftImg(){
    if(this.state.currentImg - 1 >= 0)
      this.setState({currentImg:this.state.currentImg - 1});
    else
      this.setState({currentImg:this.props.item.photo_ids.length - 1});
  }
  getRightImg(){
    if(this.state.currentImg + 1 < this.props.item.photo_ids.length)
      this.setState({currentImg:this.state.currentImg + 1});
    else
      this.setState({currentImg:0});
  }
  quantityOptions(quantity){
    let arr = [];
    for(let i = 1;i <= quantity;i++)
      arr.push(
        <option key={i}>
          {i}
        </option>
      );
    return arr;
  }
  addToCart(){
    if(!this.props.currentUserId){
      this.props.showLogin();
      return;
    }

    let cart_item = {};
    cart_item['quantity']=this.state.quantity;
    cart_item['item_id']=this.props.item.id;
    this.props.createCartItem(cart_item).then(()=>this.props.history.push('/cart'));
  }
  formatDate(date) {
    const months = {
      0: 'January',1: 'February',2: 'March',3: 'April',
      4: 'May',5: 'June',6: 'July',7: 'August',
      8: 'September',9: 'October',10: 'November',11: 'December',
    };
    const daysOfWeek = {
      0: 'Sunday',1: 'Monday',2: 'Tuesday',3: 'Wednesday',
      4: 'Thursday',5: 'Friday',6: 'Saturday',
    };
    const obj = new Date(date);
    const month = months[obj.getMonth()];
    const day = obj.getDate();
    const year = obj.getFullYear();
    return `${month} ${day}, ${year}`;
  }
  handleSubmit(e){
    const  func = this.state.editting ? this.props.updateReview : this.props.createReview;
    func(this.state.review).then(()=>this.setState({editting:false}));
  }
  createReview(e){
    this.props.createReview(this.state.review).then(()=>this.setState({editting:false}));
  }
  updateReview(e){
    this.props.updateReview(this.state.review).then(()=>this.setState({editting:false}));
  }
  render(){
    if(!this.state.loaded || !this.props.item || !this.props.user || !this.props.user.item_ids)
      return null;
    return (
    <div className='show-item'>
      <div className='header'>
        <div className='left-header'>
          <StaticImg src={this.props.user.photo_url || window.images.profileIcon}
             height='75px' width='75px' round={true} onClick={()=>this.props.history.push(`/people/${this.props.user.username}`)}/>
          <h1 onClick={()=>this.props.history.push(`/people/${this.props.user.username}`)}>
            {this.props.user.name}
          </h1>
        </div>
        <div className='right-header'>
          {this.props.user.item_ids.slice(0,4).map(itemId=>
            <Link key={itemId} to={`/listing/${itemId}`}>
              <StaticImg
                src={this.props.photos[this.props.items[itemId].photo_ids[0]].photo_url}
                height='75px' width='75px'/>
              </Link>
            )
          }
          <div className='item-count'
              onClick={()=>this.props.history.push(`/people/${this.props.user.username}`)}>
            <h3>{this.props.user.item_count}</h3>
            <h4>{this.props.user.item_ids.length === 1 ? 'item' : 'items' }</h4>
          </div>
        </div>
      </div>
      <div className='body'>
        <div className='left-body'>
          <div className='item-images'>
            <div>
              <div>
                <p className='arrow' onClick={this.getLeftImg}>{'<'}</p>
              </div>
            </div>
            <img src={this.props.photos[this.props.item.photo_ids[this.state.currentImg]].photo_url}/>
            <div className='right-arrow'>
              <div>
                <p className='arrow' onClick={this.getRightImg}>{'>'}</p>
              </div>
            </div>
          </div>
          <div className='item-description'>
            <h3>Description</h3>
            <p className={this.state.showDescription ? '' : 'cutoff'}>
              {this.props.item.description}
            </p>
          </div>
          <div className='item-reviews'>
            <div className='review-header'>
              <h3>Reviews</h3>
              <ReviewStars score={this.props.item.score}/>
              <h5>({this.props.item.num_scores})</h5>
            </div>
            <div className='reviews'>
              {this.props.currentReviewId && !this.state.editting ?
                ([0].map((i)=>{
                  const review = this.props.reviews[this.props.currentReviewId];
                  const user = this.props.users[review.user_id];
                  const item = this.props.item;
                  return (
                    <div key='o'>
                      <div className='reviewer-info'>
                        <StaticImg src={user.photo_url || window.images.profileIcon}
                          width='50px' height='50px' round={true}
                          onClick={()=>this.props.history.push(`/people/${user.username}`)}/>
                         <h1 onClick={()=>this.props.history.push(`/people/${user.username}`)}>{user.name}</h1>
                      </div>
                      <div className='review-info'>
                        <div>
                          <ReviewStars score={review.score}/>
                          <h3 onClick={()=>this.setState({editting:true})}>Edit Review</h3>
                          <p>{this.formatDate(review.updated_at)}</p>
                        </div>
                        <p>{review.body}</p>
                        <div>
                          <StaticImg src={this.props.photos[this.props.item.photo_ids[0]].photo_url}
                            width='50px' height='50px'
                            onClick={()=>this.props.history.push(`/listing/${item.id}`)}/>
                          <h2 onClick={()=>this.props.history.push(`/listing/${item.id}`)}>{item.name}</h2>
                        </div>
                      </div>
                    </div>
                  );
                })) :
                (
                  this.props.reviewable ?
                  <form onSubmit={this.handleSubmit}>
                    <h1>{this.state.editting ? 'Edit your review' : 'Leave a review'}</h1>
                    <div>
                      {[1,2,3,4,5].map(i=>{
                        return this.state.review.score < i ?
                          <img key={i} src={window.images.noStar}/> :
                          <img key={i} src={window.images.fullStar}/>
                      })}
                    </div>
                    <textarea value={this.state.review.body} onChange={(e)=>{
                        this.state.review.body=e.currentTarget.value;
                        this.setState({});
                      }}/>
                    <button type='submit'>Submit Review</button>
                  </form> : null
                )
              }
              {this.props.reviewIds.map(id=>{
                const review = this.props.reviews[id];
                const user = this.props.users[review.user_id];
                const item = this.props.items[review.item_id];
                return (
                  <div key={id}>
                    <div className='reviewer-info'>
                      <StaticImg src={user.photo_url || window.images.profileIcon}
                         width='50px' height='50px' round={true}/>
                       <h1>{user.name}</h1>
                    </div>
                    <div className='review-info'>
                      <div>
                        <ReviewStars score={review.score}/>
                        <p>{this.formatDate(review.updated_at)}</p>
                      </div>
                      <p>{review.body}</p>
                      <div>
                        <StaticImg src={this.props.photos[item.photo_ids[0]].photo_url}
                          width='50px' height='50px'/>
                        <h2>{item.name}</h2>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='right-body'>
          <div className='item-info'>
            <h1>{this.props.item.name}</h1>
            <h2>${parseFloat(this.props.item.price).toFixed(2)} per pet</h2>
            {(this.props.currentUserId == this.props.item.user_id) ?
              <h4 onClick={()=>this.props.history.push(`/listing/${this.props.match.params.itemId}/edit`)}>Edit page</h4> : null}
            {(this.props.currentUserId != this.props.item.user_id && this.props.item.quantity > 0) ?
              <form>
                Quantity
                <br/>
                <select defaultValue={1} onChange={(e)=>this.setState({quantity:e.currentTarget.value})}>
                  {this.quantityOptions(this.props.item.quantity)}
                </select>
                <h5 onClick={()=>this.addToCart()}>Add to Cart</h5>
              </form> : null }
            {this.props.item.quantity > 0 ? null : <h3>Out of Stock</h3>}
          </div>
          <div className='user-section'>
            <div className='user-info'>
              <StaticImg src={this.props.user.photo_url || window.images.profileIcon}
                 height='90px' width='90px' round={true} onClick={()=>this.props.history.push(`/people/${this.props.user.username}`)}/>
              <p onClick={()=>this.props.history.push(`/people/${this.props.user.username}`)}>
                {this.props.user.name}
              </p>
            </div>
            <div className='user-items'>
              {this.props.user.item_ids.map(itemId=>{
                  let name=this.props.items[itemId].name;
                  if(name.length > 45){
                    name=name.slice(0,45).split(' ');
                    name.pop();
                    name=name.join('-');
                  }
                  else
                    name=name.split(' ').join('-');
                  return (
                    <Link key={itemId} to={`/listing/${itemId}`}>
                      <div>
                        <StaticImg
                          src={this.props.photos[this.props.items[itemId].photo_ids[0]].photo_url}
                          height='185px' width='185px'/>
                        <h3>
                          {this.props.items[itemId].name.slice(0,25)}
                          {this.props.items[itemId].name.length > 25 ? '...' : null}
                        </h3>
                        <h4>${this.props.items[itemId].price}</h4>
                      </div>
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, MapDispatchToProps)(ShowItem));
