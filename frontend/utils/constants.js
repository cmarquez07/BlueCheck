import { useIsMobile } from './functions.jsx'

const isMobile = useIsMobile();

export const DEFAULT_MAP_COORDS = isMobile ? [41.40, 2.15] : [41.76, 2.20];
export const DEFAULT_MAP_ZOOM = isMobile ? 7 : 9;
export const MAP_WHEEL_ZOOM = isMobile? false : true;