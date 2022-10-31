import { Loader } from '@googlemaps/js-api-loader';

export const loader = new Loader({
  apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
  version: 'weekly',
});
