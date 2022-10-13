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
    <div class="pac-card" id="pac-card">
      <div>
        <div id="title">Autocomplete search</div>
        <div id="type-selector" class="pac-controls">
          <input
            type="radio"
            name="type"
            id="changetype-all"
            checked="checked"
          />
          <label for="changetype-all">All</label>

          <input type="radio" name="type" id="changetype-establishment" />
          <label for="changetype-establishment">establishment</label>

          <input type="radio" name="type" id="changetype-address" />
          <label for="changetype-address">address</label>

          <input type="radio" name="type" id="changetype-geocode" />
          <label for="changetype-geocode">geocode</label>

          <input type="radio" name="type" id="changetype-cities" />
          <label for="changetype-cities">(cities)</label>

          <input type="radio" name="type" id="changetype-regions" />
          <label for="changetype-regions">(regions)</label>
        </div>
        <br />
        <div id="strict-bounds-selector" class="pac-controls">
          <input type="checkbox" id="use-location-bias" value="" checked />
          <label for="use-location-bias">Bias to map viewport</label>

          <input type="checkbox" id="use-strict-bounds" value="" />
          <label for="use-strict-bounds">Strict bounds</label>
        </div>
      </div>
      <div id="pac-container">
        <input id="pac-input" type="text" placeholder="Enter a location" />
      </div>
    </div>
    <div id="map" style="width: 100%; height: 80vh"></div>
    <div id="infowindow-content">
      <span id="place-name" class="title"></span><br />
      <span id="place-address"></span>
    </div>
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
      libraries: ['places'],
      version: 'weekly',
    });
    let map = null;
    let clickListener = null;
    let card = null;
    // let marker = null;
    let input = null;
    let autocomplete = null;
    let biasInputElement = null;
    let strictBoundsInputElement = null;
    let options = null;
    onMounted(async () => {
      await loader.load().then(() => {
        map = new google.maps.Map(document.getElementById('map'), {
          center: currentPosition.value,
          zoom: 7,
        });
      });
      // clickListener = map.value.addListener(
      //   'click',
      //   ({ latLng: { lat, lng } }) =>
      //     (otherPos.value = { lat: lat(), lng: lng() }),
      // );
      card = document.getElementById('pac-card');
      input = document.getElementById('pac-input');
      biasInputElement = document.getElementById('use-location-bias');
      strictBoundsInputElement = document.getElementById('use-strict-bounds');
      options = {
        fields: ['formatted_address', 'geometry', 'name'],
        strictBounds: false,
        types: ['establishment'],
      };
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
      autocomplete = new google.maps.places.Autocomplete(input, options);
      // Bind the map's bounds (viewport) property to the autocomplete object,
      // so that the autocomplete requests use the current map bounds for the
      // bounds option in the request.
      autocomplete.bindTo('bounds', map);

      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById('infowindow-content');

      infowindow.setContent(infowindowContent);

      const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });

      autocomplete.addListener('place_changed', () => {
        infowindow.close();
        marker.setVisible(false);

        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent =
          place.formatted_address;
        infowindow.open(map, marker);
      });

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      function setupClickListener(id, types) {
        const radioButton = document.getElementById(id);

        radioButton.addEventListener('click', () => {
          autocomplete.setTypes(types);
          input.value = '';
        });
      }

      setupClickListener('changetype-all', []);
      setupClickListener('changetype-address', ['address']);
      setupClickListener('changetype-establishment', ['establishment']);
      setupClickListener('changetype-geocode', ['geocode']);
      setupClickListener('changetype-cities', ['(cities)']);
      setupClickListener('changetype-regions', ['(regions)']);

      biasInputElement.addEventListener('change', () => {
        if (biasInputElement.checked) {
          autocomplete.bindTo('bounds', map);
        } else {
          // User wants to turn off location bias, so three things need to happen:
          // 1. Unbind from map
          // 2. Reset the bounds to whole world
          // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
          autocomplete.unbind('bounds');
          autocomplete.setBounds({
            east: 180,
            west: -180,
            north: 90,
            south: -90,
          });
          strictBoundsInputElement.checked = biasInputElement.checked;
        }

        input.value = '';
      });

      strictBoundsInputElement.addEventListener('change', () => {
        autocomplete.setOptions({
          strictBounds: strictBoundsInputElement.checked,
        });

        if (strictBoundsInputElement.checked) {
          biasInputElement.checked = strictBoundsInputElement.checked;
          autocomplete.bindTo('bounds', map);
        }

        input.value = '';
      });
    });
    onUnmounted(async () => {
      if (clickListener) clickListener.remove();
    });
    return {
      currentPosition,
      otherPos,
      clickListener,
      card,
      input,
      biasInputElement,
      strictBoundsInputElement,
      options,
      autocomplete,
      map,
    };
  },
};
</script>
