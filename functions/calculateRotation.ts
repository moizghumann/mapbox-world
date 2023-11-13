import { MapRef } from "react-map-gl";

interface Props {
    map: MapRef,
    userInteracting: boolean,
}

const calculateRotation = ({ map, userInteracting }: Props) => {
    const secondsPerRevolution = 120;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;

    const zoom = map.getZoom();

    if (!userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;

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