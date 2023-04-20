
import React, { Component } from 'react'
import ParticlesBg from 'particles-bg';

import './App.css';
import clarifaiRequestOptions from './config/ClarifaiConfig';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
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
		console.log(box)
		this.setState( { box: box })
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
		return (
			<div className="App">
				<ParticlesBg type="cobweb" bg={true} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm 
					onInputChange={ this.onInputChange } 
					onButtonSubmit={ this.onButtonSubmit } 
				/>
			 	<FaceRecognition box={ this.state.box } imageUrl={ this.state.imageUrl } />
			</div>
		);
		}
}

export default App;
