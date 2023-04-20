
import React, { Component } from 'react'
import ParticlesBg from 'particles-bg';

import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const clarifaiRequestOptions = (imageUrl) => {
	// Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = ENTER YOUR PAT HERE;
    const USER_ID = 'eza36f2gyx3k';       
    const APP_ID = 'my-first-application';
    const MODEL_ID = 'face-detection';   
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

	return  {
		modelId: MODEL_ID,
		requestOptions: requestOptions
	}
}


class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: ''
		}
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
		.then(console.log)
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
			 	<FaceRecognition imageUrl={ this.state.imageUrl } />
			</div>
		);
		}
}

export default App;
