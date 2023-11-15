import { MapRef } from "react-map-gl";

interface Props {
    map: MapRef,
    userInteracting: boolean,
}

const secondsPerRevolution = 100;
const maxSpinZoom = 5;
const slowSpinZoom = 2;

const calculateRotation = ({ map, userInteracting }: Props) => {

    const zoom = map.getZoom();

    if (!userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 10 / secondsPerRevolution;

        if (zoom > slowSpinZoom) {
            const zoomDiff = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDiff;
        }

        const center = map.getCenter();
        center.lng -= distancePerSecond;

        return center;
    }
};

export default calculateRotation;