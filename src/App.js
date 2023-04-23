
import React, { Component } from 'react'
import ParticlesBg from 'particles-bg';

import './App.css';
import clarifaiRequestOptions from './config/ClarifaiConfig';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false
		}
	}

	calculateFaceLocation = (data) => {
		const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box
		const image = document.getElementById('inputimage')
		const width = Number(image.width)
		const height = Number(image.height)
		
		return {
			leftCol: clarifyFace.left_col * width,
			topRow: clarifyFace.top_row * height,
			rightCol: width - clarifyFace.right_col * width,
			bottomRow: height - clarifyFace.bottom_row * height
		}
	}

	displayFaceBox = (box) => {
		this.setState( { box: box })
	}

	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState({  isSignedIn: false })
		} else if (route === 'home') {
			this.setState({  isSignedIn: true })
		}
		
		this.setState({ route: route })
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value })
	}

	onButtonSubmit = () => {
		const imageUrl = this.state.input 
		this.setState({ imageUrl: imageUrl })
		const options = clarifaiRequestOptions(imageUrl)

		fetch("https://api.clarifai.com/v2/models/" + options.modelId + "/outputs", options.requestOptions)
        .then(response => response.json())
		.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
		.catch(err => console.log(err))
		// .then(response => console.log())
	}

	render() {	
		const { isSignedIn, route, box, imageUrl } = this.state
		return (
			<div className="App">
				<ParticlesBg type="cobweb" bg={true} />
				<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
				{ route === 'home' ?
					<div> 
						<Logo />
						<Rank />
						<ImageLinkForm 
							onInputChange={ this.onInputChange } 
							onButtonSubmit={ this.onButtonSubmit } 
						/>
						<FaceRecognition box={ box } imageUrl={ imageUrl } />
				  	</div> :	
				  route === 'signin'  ?
					<Signin onRouteChange={this.onRouteChange}/> :
					<Register onRouteChange={this.onRouteChange}/>
				} 
				)
			</div>
		);
		}
}

export default App;
