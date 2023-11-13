import { useRef, useState } from 'react';
import { Map, MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from 'react-map-gl';
import settings from '../constants/settings'
import calculateRotation from '../functions/calculateRotation'

const Globe = () => {

  const mapRef = useRef<MapRef>(null);
  const [userInteracting, setUserInteracting] = useState<boolean>(false);


  const SpinGlobe = () => {
    const map = mapRef.current;
    if (map != null) {
      const newCenter = calculateRotation({ map, userInteracting });
      if (newCenter) {
        map.easeTo({ center: newCenter, duration: 1000, easing: (n) => n });
      }
    }
  };

  const handleUserInteraction = (event: MapLayerMouseEvent | ViewStateChangeEvent) => {
    if (event.type === 'mousedown') {
      setUserInteracting(true);
    } else {
      setUserInteracting(false);
      SpinGlobe();
    }
    console.log('user interaction:', userInteracting)
  };


  return (
    <div className='h-screen'>
      <Map
        {...settings}
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 2.3
        }}
        mapStyle={'mapbox://styles/moizghuman/clovisydx00tu01nz0lqieckj'}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        onLoad={() => SpinGlobe()}
        onMouseDown={e => handleUserInteraction(e)}
        onMouseUp={e => handleUserInteraction(e)}
        // onDragStart={e => handleUserInteraction(e)}
        // onDragEnd={e => handleUserInteraction(e)}
        onMoveEnd={() => SpinGlobe()}
      ></Map>
    </div>
  );
};

export default Globe;