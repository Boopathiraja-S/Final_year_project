import React from 'react';
import logo from '../assest/logoc.jpg';  // Corrected path

const Logo = () => (
    <img src={logo} alt='logo' className='w-28 h-12 sm:w-30 object-contain' />
);

export default Logo;
