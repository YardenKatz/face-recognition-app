
import React, { Component } from 'react'
import ParticlesBg from 'particles-bg';

import './App.css';

import Navigation from './src/components/Navigation/Navigation';
import Logo from './src/components/Logo/Logo';
import Rank from './src/components/Rank/Rank';
import ImageLinkForm from './src/components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './src/components/FaceRecognition/FaceRecognition';
import Signin from './src/components/Signin/Signin';
import Register from './src/components/Register/Register';
import host from './config.js';

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	constructor() {
		super()
		this.state = initialState
	}

	loadUser = (data) => {
		this.setState( { user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
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
			this.setState(initialState)
		} else if (route === 'home') {
			this.setState({  isSignedIn: true })
		}
		
		this.setState({ route: route })
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value })
	}

	onPictureSubmit = () => {
		const imageUrl = this.state.input 
		this.setState({ imageUrl: imageUrl })

		fetch(host + '/imageurl', {
						method: 'post',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							imageUrl: imageUrl
						})
					})
			.then(response => response.json())
			.then(response => {
				if (response) {
					fetch(host + '/image', {
						method: 'put',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: this.state.user.id
						})
					})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user, {
							entries: count
						}))
					})
					.catch(console.log)
				}
				this.displayFaceBox(this.calculateFaceLocation(response))
			})
		.catch(err => console.log(err))
	}

	render() {	
		const { isSignedIn, route, box, imageUrl, user } = this.state
		return (
			<div className="App">
				<ParticlesBg type="cobweb" bg={true} />
				<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
				{ route === 'home' ?
					<div> 
						<Logo />
						<Rank name={user.name} entries={user.entries}/>
						<ImageLinkForm 
							onInputChange={ this.onInputChange } 
							onPictureSubmit={ this.onPictureSubmit } 
						/>
						<FaceRecognition box={box} imageUrl={imageUrl} />
				  	</div> :	
				  route === 'signin'  ?
					<Signin loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/> :
					<Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
				} 
			</div>
		);
		}
}

export default App;
