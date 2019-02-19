import React from 'react';

import styles from './style.scss'

class Form extends React.Component {
  constructor() {
    super();
    this.changeHandler = this.changeHandler.bind( this );
    this.clickHandler = this.clickHandler.bind( this );
    this.sortHandler = this.sortHandler.bind( this );
    this.cartHandler = this.cartHandler.bind( this );
    this.state = {
        word : "",
        search : "",
        list : [],
        cart : [],
        price : [],
        totalPrice : 0,
        validation: false
    };
}

    changeHandler(event){
        if(event.target.value.length > 9){
            alert("WARNING ERROR!! INPUT TOO LONG!!!")
        }
        else if(event.target.value.length < 0){
            this.setState({validation: false});
        }
        else if(event.target.value.length > 0){
            this.setState({validation: true});
        }
        this.setState({search: event.target.value});
    }

    clickHandler(event){
        // console.log(event.target.value)
        if(this.state.validation == true){
            var that = this;
            that.setState({word: event.target.value});

            // what to do when we recieve the request
            var responseHandler = function() {
              const data = JSON.parse(this.responseText);
              // console.log(data.items)
              that.setState({search: "", list: data.items});
              // console.log(this.responseText)
            };

            // make a new request
            var request = new XMLHttpRequest();

            // listen for the request response
            request.addEventListener("load", responseHandler);

            // ready the system by calling open, and specifying the url
            request.open("GET", `http://127.0.0.1:3000/query?search=${event.target.value}`);

            // send the request
            request.send();
        }
        else if(this.state.validation == false){
            alert("Input field empty!")
        }

    }

    sortHandler(event){
        // console.log(event.target.value)
        if(event.target.value == 1){
            function compare(a,b) {
              if (a.salePrice < b.salePrice)
                return -1;
              if (a.salePrice > b.salePrice)
                return 1;
              return 0;
            }
            var sort = this.state.list.sort(compare);
            this.setState({list: sort});
        }
        else if(event.target.value == 2){
            function compare(a,b) {
              if (a.salePrice > b.salePrice)
                return -1;
              if (a.salePrice < b.salePrice)
                return 1;
              return 0;
            }
            var sort = this.state.list.sort(compare);
            this.setState({list: sort});
        }
        else if(event.target.value == 3){
            function compare(a,b) {
              if (a.name < b.name)
                return -1;
              if (a.name > b.name)
                return 1;
              return 0;
            }
            var sort = this.state.list.sort(compare);
            this.setState({list: sort});
        }
    }

    cartHandler(name, amt){
        // console.log(name, amt)
        var cart = {
            name: name,
            price: amt
        }
        const sum = this.state.price.reduce((total, a) => total + a);
        // console.log(sum)
        this.setState({cart: [cart, ...this.state.cart], price: [amt, ...this.state.price], totalPrice: sum});
    }

    render() {
        // console.log(this.state.list)

        const items = this.state.list.map(item => {return <Item item={item} add={this.cartHandler}></Item>})
        const cartItems = this.state.cart.map(item => {return <Cart item={item}></Cart>})
        return (
          <div>
              <input onChange={this.changeHandler} value={this.state.search} maxlength="10"/>
              <button onClick={this.clickHandler} value={this.state.search}>search</button>
                <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#exampleModal" ><i class="fas fa-shopping-cart"></i> Cart</button>

                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cart</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        {cartItems}
                        <strong>Total Price: {this.state.totalPrice}</strong>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Procceed Checkout</button>
                      </div>
                    </div>
                  </div>
                </div>
              <h3>List of search result related to {this.state.word}</h3>
              <ul>
                <select className="custom-select" onChange={this.sortHandler}>
                    <option selected>Sort Options</option>
                    <option value="1">Price ascending</option>
                    <option value="2">Price descending</option>
                    <option value="3">Name ascending</option>
                </select>
                {items}
              </ul>
          </div>
          );
    }
}

class Cart extends React.Component{
    render(){
        return(
            <div>
                <ul>
                    <strong>Name:</strong> {this.props.item.name}
                    <br/>
                    <strong>Price:</strong> ${this.props.item.price}
                </ul>
            </div>
        );
    }
}

class Item extends React.Component{
    render() {
        // console.log(this.props.item.salePrice)
        if(this.props.item.stock == "Available"){
            return (
                <div>
                    <div className="card">
                      <div className="row no-gutters">
                        <div className="col-md-4">
                        <img src={this.props.item.mediumImage}/>
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{this.props.item.name}</h5>
                            <p className="card-text">{this.props.item.shortDescription}</p>
                            <p className="card-text"><small className="text-muted">Price: ${this.props.item.salePrice} Availability: Available <button onClick={() => {this.props.add(this.props.item.name, this.props.item.salePrice)}}>Add item to cart</button></small></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                    </div>
                </div>
              );
        }
        else{
            return (
            <div>
                <div className="card">
                  <div className="row no-gutters">
                    <div className="col-md-4">
                    <img src={this.props.item.mediumImage}/>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{this.props.item.name}</h5>
                        <p className="card-text">{this.props.item.shortDescription}</p>
                        <p className="card-text"><small className="text-muted">Price: ${this.props.item.salePrice} Availability: Not Available</small></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                </div>
            </div>
          );
        }
    }
}

export default Form;