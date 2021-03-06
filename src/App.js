import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo'
import ImageLinkForm  from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';
import Clarifai from 'clarifai'

const app = new Clarifai.App({apiKey: '2280267f608c487993f64a14e944c6fd'});

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area:800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route:'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation = (data) => {
    const clarficaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarficaiFace.left_col * width,
      topRow: clarficaiFace.top_row * height,
      rightCol: width - (clarficaiFace.right_col * width),
      bottomRow: height - (clarficaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (x) => {
    this.setState({box: x});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn:false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    app.models.predict('a403429f2ddf4b49b307e318f00e528b',
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles  className='particles'
                params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div> 
          : (
              route === 'signin' ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
