import React from 'react'
import { LayersControl,LayerGroup } from 'react-leaflet'
import Province from './Province'
const CombineLayer = () => {
  return (
    <LayersControl position='topright'>
      <LayersControl.Overlay name='Thailand'>
            <Province/>
      </LayersControl.Overlay>

    </LayersControl>
  )
}

export default CombineLayer