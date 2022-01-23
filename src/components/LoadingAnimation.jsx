import React from 'react';
import {useLottie} from 'lottie-react'
import loadingBlob from '../loading_blob.json'

const LoadingAnimation = ({}) => {

    const options = {
        animationData: loadingBlob,
        loop: true,
        autoplay:true,
        speed: 1.5,
      }
    const { View } = useLottie(options)

  return View;
};



export default LoadingAnimation;
