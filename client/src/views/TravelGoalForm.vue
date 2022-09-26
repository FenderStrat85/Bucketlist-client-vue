<template>
  <div>
    <h1>I am the Travel Goal Form</h1>
    <div>
      <h4>Your Position</h4>
      latitude: {{ currentPosition.lat.toFixed(2) }}, Longitude:
      {{ currentPosition.lng.toFixed(2) }}
    </div>
    <div>
      <h4>Clicked Position</h4>
      <span v-if="otherPos">
        latitude: {{ otherPos.lat.toFixed(2) }}, Longitude:
        {{ otherPos.lng.toFixed(2) }}
      </span>
      <span v-else>Click the map to select a position</span>
    </div>
    <div ref="mapDiv" style="width: 100%; height: 80vh" />
  </div>
</template>

<script>
/* eslint-disable no-undef */
// needs above to allow google maps to load
import { ref, computed } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { onMounted, onUnmounted } from '@vue/runtime-core';
// import { useGeolocation } from '../constants/useGeolocation';
export default {
  setup() {
    // const { coords } = useGeolocation();
    const currentPosition = computed(() => ({
      lat: 51.5072,
      lng: 0.1276,
    }));
    const otherPos = ref(null);
    const loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    });
    const mapDiv = ref(null);
    let map = ref(null);
    let clickListener = null;
    onMounted(async () => {
      await loader.load();
      map.value = new google.maps.Map(mapDiv.value, {
        center: currentPosition.value,
        zoom: 7,
      });
      clickListener = map.value.addListener(
        'click',
        ({ latLng: { lat, lng } }) =>
          (otherPos.value = { lat: lat(), lng: lng() }),
      );
    });
    onUnmounted(async () => {
      if (clickListener) clickListener.remove();
    });
    return { currentPosition, mapDiv, otherPos, clickListener };
  },
};
</script>
