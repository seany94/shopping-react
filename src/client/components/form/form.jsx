import React from 'react';

import styles from './style.scss'

class Form extends React.Component {
  constructor() {
    super();
    this.changeHandler = this.changeHandler.bind( this );
    this.clickHandler = this.clickHandler.bind( this );
    this.sortHandler = this.sortHandler.bind( this );
    this.state = {
        word : "",
        search : "",
        list : [],
    };
}

changeHandler(event){
    if(event.target.value.length > 9){
        alert("WARNING ERROR!! INPUT TOO LONG!!!")
    }
    this.setState({search: event.target.value});
}

clickHandler(event){
    // console.log(event.target.value)
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

    render() {
        // console.log(this.state.list)
        const items = this.state.list.map(item => {return <Item item={item}></Item>})
        return (
          <div>
              <input onChange={this.changeHandler} value={this.state.search} maxlength="10"/>
              <button onClick={this.clickHandler} value={this.state.search}>search</button>
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
                            <p className="card-text"><small className="text-muted">Price: ${this.props.item.salePrice} Availability: Available <button onClick={this.props.add} value={this.props.item}>Add item to cart</button></small></p>
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