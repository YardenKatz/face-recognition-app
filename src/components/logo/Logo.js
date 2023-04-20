import React from 'react'
import Tilt from 'react-parallax-tilt'
import './Logo.css'
import brain from './brain.png';	

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br-2 shadow-2 pa3' style={{ height: '155px', width: '150px'}}>
				<div>
					<img alt='logo' src={brain} style={{height: '120px'}}/>
				</div>
			</Tilt>
		</div>
	)
}
export default Logo