<template>
  <div>
    <Transition name="flip" mode="out-in">
      <div v-if="!state.isInEditMode">
        <div class="card-container">
          <h1>{{ travelGoal.category }} Goal!</h1>
          <h2>Goal title: {{ travelGoal.title }}</h2>
          <h2>Completed? : {{ travelGoal.completed }}</h2>
          <h2>About: {{ travelGoal.about }}</h2>
          <div v-if="state.cloudinaryPhotoUrl.length > 0">
            <div class="photoContainer">
              <img
                :src="state.cloudinaryPhotoUrl"
                alt="travel goal photo"
                id="image-display"
              />
            </div>
          </div>
        </div>
        <button
          class="button-login button-delete"
          @click="deleteBucketListItem()"
        >
          Delete Goal
        </button>
        <div v-if="state.showErrorMessage">
          <h2>There has been an error deleting this item</h2>
        </div>
        <button class="button-login button-travel" @click="setToEditMode()">
          Edit your goal
        </button>
      </div>
      <div v-else>
        <form>
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
              type="text"
              class="form-textarea"
              rows="5"
              name="about"
              v-model="about"
              :placeholder="placeholders.about"
              required
            />
            <span>What country?</span>
            <input
              type="text"
              class="form-input"
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
            <div
              class="photo-container"
              v-if="state.cloudinaryPhotoUrl.length === 0"
            >
              <div class="photo-input">
                <label for="image">Add a photo</label>
                <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpg, image/jpeg"
                  @change="handleFileUpload(false)"
                />
              </div>
              <div id="image-display"></div>
            </div>
            <div
              class="photo-container"
              v-if="state.cloudinaryPhotoUrl.length > 0"
            >
              <div class="photo-input">
                <label for="image">Change your photo</label>
                <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpg, image/jpeg"
                  @change="handleFileUpload(true)"
                />
              </div>
              <div>
                <img
                  :src="state.cloudinaryPhotoUrl"
                  alt="travel goal photo"
                  id="image-display"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Transition>
    <div id="map-display">
      <div
        v-if="state.isInEditMode"
        class="pac-card"
        style="width: 70%"
        id="pac-card"
      >
        <div>
          <div id="title">Your selected place</div>
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
    <div v-if="state.isInEditMode">
      <button class="button-login button-go-back" @click="exitEditMode()">
        Return to Goal
      </button>
      <button
        class="button-login button-travel"
        @click="updateTravelBucketListItem()"
      >
        Submit
      </button>
    </div>
    <div v-if="state.showErrorMessage">
      <h2>There has been an error updating your goal</h2>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
// needs above to allow google maps to load
import { useStore } from 'vuex';
import { reactive, computed, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { categories, storeCategories } from '../constants/categories';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from '@vue/runtime-core';
import { loader } from '../constants/googleMapsLoader';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { toastOptions } from '../constants/toastOptions';

export default {
  props: {
    id: String
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const travelGoal = store.getters.getTravelById(props.id);
    const toast = useToast();

    const placeholders = {
      title: travelGoal.title,
      about: travelGoal.about,
      completed: travelGoal.completed,
      country: travelGoal.country,
      city: travelGoal.city
    };

    const title = ref(travelGoal.title);
    const about = ref(travelGoal.about);
    const completed = ref(travelGoal.completed);
    const country = ref(travelGoal.country);
    const city = ref(travelGoal.city);

    const state = reactive({
      showErrorMessage: false,
      isInEditMode: false,
      myLatLng: { lat: travelGoal.latitude, lng: travelGoal.longitude },
      imageToUpload: '',
      cloudinaryPhotoUrl:
        travelGoal.cloudinaryPhotoUrl.length > 0
          ? travelGoal.cloudinaryPhotoUrl
          : ''
    });
    const setToEditMode = () => (state.isInEditMode = true);
    const exitEditMode = () => (state.isInEditMode = false);

    const handleFileUpload = (changePhoto) => {
      const img = document.querySelector('#image');
      const reader = new FileReader();
      reader.onload = () => {
        state.imageToUpload = reader.result;
        if (changePhoto) {
          document.getElementById('image-display').src = state.imageToUpload;
        } else {
          document.querySelector(
            '#image-display'
          ).style.backgroundImage = `url(${state.imageToUpload})`;
        }
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
          }
        })
        .catch((err) => console.error(err));
    };

    // Google maps code
    const startingPosition = computed(() => ({
      lat: travelGoal.latitude,
      lng: travelGoal.longitude
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
      await loader.load().then((google) => {
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
      mutate: updateTravelBucketListItem,
      onDone: onDoneUpdate,
      onError: onErrorUpdate
    } = useMutation(
      gql`
        mutation updateTravelBucketListItem(
          $travelItemInput: TravelBucketListInput
        ) {
          updateTravelBucketListItem(travelItemInput: $travelItemInput) {
            _id
            userId
            category
            title
            about
            country
            city
            latitude
            longitude
            completed
            cloudinaryPhotoUrl
          }
        }
      `,
      () => ({
        variables: {
          travelItemInput: {
            _id: travelGoal._id,
            category: categories.TRAVEL,
            title: title.value,
            about: about.value,
            country: country.value,
            city: city.value,
            latitude: state.myLatLng.lat,
            longitude: state.myLatLng.lng,
            completed: completed.value,
            cloudinaryPhotoUrl: state.cloudinaryPhotoUrl
          }
        }
      })
    );
    onDoneUpdate((result) => {
      if (result) {
        toast.success('Travel goal updated successfully', toastOptions);
      }
      store.commit('updateGoal', {
        data: result.data.updateTravelBucketListItem,
        category: storeCategories.TRAVEL
      });
      router.push('/');
    });
    onErrorUpdate((e) => {
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });

    const {
      mutate: deleteBucketListItem,
      onDone: onDoneDelete,
      onError: onErrorDelete
    } = useMutation(
      gql`
        mutation deleteBucketListItem($deleteItemInput: DeleteItemInput) {
          deleteBucketListItem(deleteItemInput: $deleteItemInput) {
            message
          }
        }
      `,
      () => ({
        variables: {
          deleteItemInput: {
            _id: props.id,
            category: travelGoal.category
          }
        }
      })
    );
    onDoneDelete(() => {
      store.commit('removeGoal', {
        id: props.id,
        category: storeCategories.TRAVEL
      });
      router.push('/');
    });
    onErrorDelete((e) => {
      console.error(e);
      state.showErrorMessage = true;
    });

    return {
      travelGoal,
      state,
      deleteBucketListItem,
      updateTravelBucketListItem,
      setToEditMode,
      exitEditMode,
      placeholders,
      card,
      input,
      biasInputElement,
      strictBoundsInputElement,
      options,
      autocomplete,
      map,
      title,
      about,
      completed,
      country,
      city,
      handleFileUpload
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

.flip-enter-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  transform-origin: 50% 50%;
}
.flip-leave-active {
  transform-origin: 50% 50%;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.flip-enter-from,
.flip-leave-to {
  transform-origin: 50% 50%;
  transform: scaleY(0) translateZ(0);
  opacity: 0;
}
</style>
