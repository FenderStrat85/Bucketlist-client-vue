<template>
  <div>
    <h1>Add a travel goal!</h1>
    <form @submit.prevent="addTravelBucketListItem()">
      <div class="form-container">
        <label for="title">Title: </label>
        <input
          class="form-input"
          type="text"
          name="title"
          v-model="title"
          :placeholder="placeholders.title"
          required
        />
        <label for="about">About: </label>
        <textarea
          class="form-textarea"
          rows="5"
          type="text"
          name="about"
          v-model="about"
          :placeholder="placeholders.about"
          required
        />
        <span>What country?</span>
        <input
          class="form-input"
          type="text"
          name="country"
          v-model="country"
          :placeholder="placeholders.country"
        />
        <span>What city?</span>
        <input
          class="form-input"
          type="text"
          name="city"
          v-model="city"
          :placeholder="placeholders.city"
        />
        <div class="form-radio-container">
          <span>Have you completed this goal?</span>
          <input
            type="radio"
            id="completed"
            v-bind:value="true"
            v-model="completed"
          />
          <label for="completed">Completed</label>
          <input
            type="radio"
            id="notCompleted"
            v-bind:value="false"
            v-model="completed"
          />
          <label for="completed">Not Completed</label>
        </div>
      </div>
      <div class="photo-container">
        <div class="photo-input">
          <label class="photo-label" for="image">Add a photo</label>
          <input
            type="file"
            id="image"
            accept="image/png, image/jpg, image/jpeg"
            @change="handleFileUpload()"
          />
        </div>

        <div v-if="state.fileUploaded" id="image-display"></div>
      </div>

      <div id="map-display">
        <div class="pac-card" style="width: 70%" id="pac-card">
          <div>
            <div id="title">Select your location</div>
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
        <div id="map" style="width: 80%; height: 60vh"></div>
        <div id="infowindow-content">
          <span id="place-name" class="title"></span><br />
          <span id="place-address"></span>
        </div>
      </div>
      <div>
        <Transition name="bounce">
          <div v-if="state.newMapLocationSelected">
            <button class="button-login button-travel">Submit</button>
          </div>
          <div v-else>
            <button class="button-login" disabled>
              Complete the form first!
            </button>
          </div>
        </Transition>
      </div>
    </form>
    <div v-if="state.showErrorMessage">
      <h2>There has been an error submitting your goal</h2>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
// needs above to allow google maps to load
import { computed, reactive, ref } from 'vue';
import { onMounted, onUnmounted } from '@vue/runtime-core';
import { goalFormPlaceholders } from '../constants/formPlaceholders';
import gql from 'graphql-tag';
import { useMutation } from '@vue/apollo-composable';
import { categories, storeCategories } from '../constants/categories';
import { logErrorMessages } from '@vue/apollo-util';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { loader } from '../constants/googleMapsLoader';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { toastOptions } from '../constants/toastOptions';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      myLatLng: { lat: 0, lng: 0 },
      fileUploaded: false,
      showErrorMessage: false,
      newMapLocationSelected: false,
      imageToUpload: '',
      cloudinaryPhotoUrl: ''
    });
    const toast = useToast();
    const placeholders = goalFormPlaceholders;

    const title = ref('');
    const about = ref('');
    const completed = ref(false);
    const country = ref('');
    const city = ref('');

    const handleFileUpload = () => {
      const img = document.querySelector('#image');
      const reader = new FileReader();
      state.fileUploaded = true;
      reader.onload = () => {
        state.imageToUpload = reader.result;
        document.querySelector(
          '#image-display'
        ).style.backgroundImage = `url(${state.imageToUpload})`;
      };
      reader.readAsDataURL(img.files[0]);
      const formData = new FormData();
      formData.append('file', img.files[0]);
      formData.append(
        'upload_preset',
        process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET
      );

      fetch(process.env.VUE_APP_CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url !== '') {
            state.cloudinaryPhotoUrl = data.secure_url;
            toast.success('Image uploaded successfully', toastOptions);
          }
        })
        .catch((err) => console.error(err));
    };

    // Google maps code
    const startingPosition = computed(() => ({
      lat: 51.5072,
      lng: 0.1276
    }));
    let map = null;
    let clickListener = null;
    let card = null;
    let input = null;
    let autocomplete = null;
    let biasInputElement = null;
    let strictBoundsInputElement = null;
    let options = null;

    onMounted(async () => {
      await loader.load().then(() => {
        map = new google.maps.Map(document.getElementById('map'), {
          center: startingPosition.value,
          zoom: 7
        });
      });
      card = document.getElementById('pac-card');
      input = document.getElementById('pac-input');
      biasInputElement = document.getElementById('use-location-bias');
      strictBoundsInputElement = document.getElementById('use-strict-bounds');
      options = {
        fields: ['formatted_address', 'geometry', 'name'],
        strictBounds: false,
        types: ['establishment']
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

      state.myLatLng = startingPosition.value;

      // Sets up initial marker
      const marker = new google.maps.Marker({
        map,
        position: state.myLatLng,
        anchorPoint: new google.maps.Point(0, -29),
        clickable: true,
        draggable: true
      });
      marker.setPosition(state.myLatLng);
      map.addListener('click', (e) => {
        state.myLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        marker.setPosition(state.myLatLng);
        state.newMapLocationSelected = true;
      });

      autocomplete.addListener('place_changed', () => {
        infowindow.close();
        marker.setVisible(false);

        // set stored lat/lng values to that of the place. Can be overwritten by clicking on map
        const place = autocomplete.getPlace();
        state.myLatLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        state.newMapLocationSelected = true;

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
        map.addListener('click', (e) => {
          state.myLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          marker.setPosition(state.myLatLng);
          state.newMapLocationSelected = true;
        });

        // infowindowContent.children['place-name'].textContent = place.name;
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
            south: -90
          });
          strictBoundsInputElement.checked = biasInputElement.checked;
        }

        input.value = '';
      });

      strictBoundsInputElement.addEventListener('change', () => {
        autocomplete.setOptions({
          strictBounds: strictBoundsInputElement.checked
        });

        if (strictBoundsInputElement.checked) {
          biasInputElement.checked = strictBoundsInputElement.checked;
          autocomplete.bindTo('bounds', map);
        }

        input.value = '';
      });
    }),
      onUnmounted(async () => {
        if (clickListener) clickListener.remove();
      });

    const {
      mutate: addTravelBucketListItem,
      onDone,
      onError
    } = useMutation(
      gql`
        mutation addTravelBucketListItem(
          $travelItemInput: TravelBucketListInput
        ) {
          addTravelBucketListItem(travelItemInput: $travelItemInput) {
            _id
            userId
            category
            title
            about
            completed
            latitude
            longitude
            country
            city
            cloudinaryPhotoUrl
          }
        }
      `,
      () => ({
        variables: {
          travelItemInput: {
            category: categories.TRAVEL,
            title: title.value,
            about: about.value,
            completed: completed.value,
            latitude: state.myLatLng.lat,
            longitude: state.myLatLng.lng,
            country: country.value,
            city: city.value,
            cloudinaryPhotoUrl: state.cloudinaryPhotoUrl
          }
        }
      })
    );
    onDone((result) => {
      toast.success('Travel goal added successfully!', toastOptions);
      store.commit('addGoal', {
        category: storeCategories.TRAVEL,
        data: result.data.addTravelBucketListItem
      });
      router.push('/');
    });
    onError((e) => {
      logErrorMessages(e);
      // shows the full error from graphql
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });

    return {
      placeholders,
      title,
      about,
      completed,
      country,
      city,
      card,
      input,
      biasInputElement,
      strictBoundsInputElement,
      options,
      autocomplete,
      map,
      state,
      handleFileUpload,
      addTravelBucketListItem
    };
  }
};
</script>

<style>
#image-display {
  margin-top: 20px;
  width: 562px;
  height: 317px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border: 2px solid #472183;
  border-radius: 10px;
}

/*
 * Always set the map height explicitly to define the size of the div element
 * that contains the map.
 */
#map {
  height: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
}

/*
 * Optional: Makes the sample page fill the window.
 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#infowindow-content .title {
  font-weight: bold;
}

#infowindow-content {
  display: none;
}

#map #infowindow-content {
  display: inline;
}

.pac-card {
  background-color: #62b6b7;
  border: 0;
  border-radius: 5px;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
  margin: 10px;
  padding: 0 0.5em;
  overflow: hidden;
  padding: 0;
}

#pac-container {
  padding-bottom: 12px;
  margin-right: 12px;
}

.pac-controls {
  display: inline-block;
  padding: 5px 11px;
}

.pac-controls label {
  font-size: 13px;
  font-weight: 300;
  padding: 10px;
}

#pac-input {
  background-color: #fff;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 5px 11px 5px 13px;
  text-overflow: ellipsis;
  width: 400px;
}

#pac-input:focus {
  border-color: #4d90fe;
}

#title {
  color: #fff;
  background-color: #4b56d2;
  font-size: 25px;
  font-weight: 500;
  padding: 6px 12px;
}

#map-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bounce-enter-active {
  animation: bounce-in 0.75s;
}
.bounce-leave-active {
  animation: bounce-in 0.75s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
