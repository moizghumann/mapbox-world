import { useRef, useState } from 'react';
import { Layer, Map, MapLayerMouseEvent, MapRef, Source, ViewStateChangeEvent } from 'react-map-gl';
import calculateRotation from '../functions/calculateRotation'
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from '../constants/layers';
import mapboxgl from 'mapbox-gl';


const App = () => {

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
  }

  const handleUserInteraction = (event: MapLayerMouseEvent | ViewStateChangeEvent) => {
    if (event.type === 'mousedown') {
      setUserInteracting(true);
    } else {
      setUserInteracting(false);
      SpinGlobe();
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    if (event.features) {
      const feature = event.features[0];
      const clusterId = feature.properties?.cluster_id;

      const mapboxSource = mapRef.current?.getSource('earthquakes') as mapboxgl.GeoJSONSource;

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current?.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500
        });
      });
    }
  };

  return (
    <div className='h-screen'>
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 2.3
        }}
        mapStyle={'mapbox://styles/mapbox/dark-v11'}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        onLoad={() => SpinGlobe()}
        onMouseDown={e => handleUserInteraction(e)}
        onMouseUp={e => handleUserInteraction(e)}
        // onDragStart={e => handleUserInteraction(e)}
        // onDragEnd={e => handleUserInteraction(e)}
        onMoveEnd={() => SpinGlobe()}
        interactiveLayerIds={['clusters']}
        onClick={e => onClick(e)}

      >
        <Source
          id='earthquakes'
          type='geojson'
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
    </div>
  );
};

export default App;