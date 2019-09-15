import React from 'react';
import './App.css';
import axios from 'axios';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import $ from 'jquery';

class App extends React.Component {
  state = {
    finalRes: [],
  };

  //CDM is handing all the api Calls and constitution an array of objects containing respective albums along with userid

  componentDidMount () {
    let apiArr = [];
    let finalRes = [];
    axios
      .get ('https://jsonplaceholder.typicode.com/albums')
      .then (async res => {
        finalRes = res.data;
        res.data.forEach (element => {
          apiArr.push (
            axios.get (
              `https://jsonplaceholder.typicode.com/photos?albumId=${element.id}`
            )
          );
        });
        return axios.all (apiArr);
      })
      .then (el => {
        finalRes.forEach ((val, i) => {
          finalRes[i].albums = el.filter (v => {
            if (val.id === parseFloat (v.config.url.split ('=')[1]))
              return v.data;
          })[0].data;
        });
        this.setState ({finalRes});
      });
  }

  // animating scroll with JQUERY

  scroll (direction, el) {
    if (direction == -1) {
      let far =
        $ (el.currentTarget.nextElementSibling).width () / 2 * direction;
      let pos = $ (el.currentTarget.nextElementSibling).scrollLeft () + far;
      $ (el.currentTarget.nextElementSibling).animate ({scrollLeft: pos}, 1000);
    } else {
      let far =
        $ (el.currentTarget.previousElementSibling).width () / 2 * direction;
      let pos = $ (el.currentTarget.previousElementSibling).scrollLeft () + far;
      $ (el.currentTarget.previousElementSibling).animate (
        {scrollLeft: pos},
        1000
      );
    }
  }

  render () {
    return (
      <div style={{backgroundColor: '#eee'}}>

        {this.state.finalRes.length > 0
          ? this.state.finalRes.map ((v, i) => (
              <div key={i} className="everyBlock">

                <div className="header">
                  <div>{v.title}</div>
                  <div>
                    <span>id:{v.id}</span>
                    &nbsp;&nbsp;&nbsp;
                    <span>userId:{v.userId}</span>
                  </div>
                </div>

                <div style={{position: 'relative'}}>
                  <button
                    onClick={this.scroll.bind (null, -1)}
                    className="leftButton"
                  >
                    &#60;
                  </button>

                  <div className="image-container">

                    {v.albums.map ((val, index) => (
                      <div key={index} className="image-container-img">

                        <LazyLoadImage
                          alt={val.thumbnailUrl}
                          placeholderSrc={require ('./logo.svg')}
                          height={'100%'}
                          effect="blur"
                          src={val.url}
                          width={'100%'}
                          delayTime={900}
                        />

                        <div className="content-img">
                          <span>{val.title}</span>
                          <span>id:{val.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={this.scroll.bind (null, 1)}
                    className="rightButton"
                  >
                    &#62;
                  </button>
                </div>

              </div>
            ))
          : <div style={{textAlign: 'center'}}>
              Loading... <br />
              I have used

              <strong> React logo as place holder </strong>

              as placeholder from the api is the space image of lower resolution,so that it is easily distinguishable

            </div>}
      </div>
    );
  }
}

export default App;
