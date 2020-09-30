import GeoJSON from 'geojson';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import { getDistricts } from '../../data/districts';
import L from '../../common/logger';

/**
 * Finds district the given point belongs to.
 *
 * @param point geographical coordinates of the point to find the district for
 * @returns name of the district which contains the point or null if not found
 */
export function findDistrict(point: {
  lat: number;
  lng: number;
}): string | null {
  const districts: GeoJSON.GeoJSON = getDistricts() as GeoJSON.GeoJSON;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  L.info((districts as GeoJSON.FeatureCollection).features.length.toString());
  const feature: GeoJSON.Feature | null = (districts as GeoJSON.FeatureCollection).features
    .filter(
      (f) => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
    )
    .find((f) =>
      booleanPointInPolygon(
        [point.lng, point.lat],
        f.geometry as GeoJSON.Polygon
      )
    );

  return feature ? feature.properties.Name : null;
}
