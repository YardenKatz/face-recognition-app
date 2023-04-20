
import React from 'react'
import ParticlesBg from 'particles-bg';

import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';

function App() {
  return (
    <div className="App">
		<ParticlesBg type="cobweb" bg={true} />
    	<Navigation />
	  	<Logo />
		<Rank />
	  	<ImageLinkForm />
	  { /* <FaceRecognition /> */}
    </div>
  );
}

export default App;
