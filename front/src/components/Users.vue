<template>
  <div class="flex-column">
    <div class="result-info">
      <p
        v-if="totalLength"
        class="result-info__stats"
      >
        Found: {{ users.length }}/{{ totalLength }}
      </p>
      <div
        class="btn search-again-btn"
        @click="$emit('reload')"
      >
        Search again!
      </div>
    </div>
    <div class="users">
      <div 
        v-for="({ phone, pic }) in users"
        :key="phone"
        class="user"
      >
        <div>
          <div class="phone">
            {{ phone }}
          </div>
          <a 
            class="copy-link-btn"
            :href="`https://t.me/+${phone}`"
            target="_blank"
          >
            Go to Telegram
          </a>
        </div>
        <img 
          :src="pic"
          :class="phone in chosenUsers && 'userpic--chosen'"
          class="userpic"
          @click.left="toggleUser(phone)"
          @click.right.prevent="showFullPhoto(pic)"
        />
      </div>
    </div>
    <FloatButton
      @export="exportTgLinks"
    />
    <transition name="popup">
      <PhotoPopup
        v-if="showPhotoPopup"
        :src="popupPhoto"
        @close="hideFullPhoto"
      />
    </transition>
  </div>
</template>

<script setup>
import { notify } from '@kyvg/vue3-notification';
import { ref } from 'vue';

import { copyToClipboard } from '../helpers/clipboard';
import FloatButton from './FloatButton.vue';
import PhotoPopup from './PhotoPopup.vue';

defineProps({
  users: {
    type: Object,
    required: true,
  },
  totalLength: {
    type: String,
    required: true,
  },
});

defineEmits(['reload']);

const chosenUsers = ref({});
const showPhotoPopup = ref(false);
const popupPhoto = ref('');

const toggleUser = (phone) => {
  if (phone in chosenUsers.value) {
    delete chosenUsers.value[phone];
    return;
  }
  chosenUsers.value[phone] = true;
};

const exportTgLinks = async () => {
  if (!Object.keys(chosenUsers.value).length) {
    return;
  }
  const links = Object.keys(chosenUsers.value).map(phone => {
    return `https://t.me/+${phone}`;
  });

  await copyToClipboard(links.join('\r\n'));

  notify({
    title: 'Copied to clipboard!'
  });
};

const showFullPhoto = (pic) => {
  popupPhoto.value = pic;
  showPhotoPopup.value = true;
  document.body.classList.add('popup-open');
};

const hideFullPhoto = () => {
  showPhotoPopup.value = false;
  document.body.classList.remove('popup-open');
};
</script>

<style lang="scss" scoped>

.users {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0 25px;

  @media screen and (max-width: 767px) {
    gap: 0;
    margin-bottom: -20px;
  }

  .user {
    display: flex;
    padding: 15px 0;
    flex-direction: row;
    align-items: flex-start;
    border-bottom: 1px solid #a4a2a2;

    @media screen and (max-width: 767px) {
      flex-direction: column;
      flex-grow: 1;
    }
  }

  .phone {
    width: 150px;
    padding: 5px 0;
    margin-right: 10px;
    font-size: 19px;
  }

  .userpic {
    display: block;
    width: 250px;
    height: 250px;

    &--chosen {
      box-shadow: 0 0 3px 10px rgba(248, 190, 246, .7);
    }

    @media screen and (max-width: 767px) {
      width: 100%;
      height: 100%;
    }
  }
}

.result-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  font-size: 17px;

  &__stats {
    width: 150px;
    margin-right: 10px;
  }
}

.search-again-btn {
  padding: 0 20px;
  font-size: 17px;
}

.copy-link-btn {
  cursor: pointer;
  font-size: 17px;
  color: #90298d;
  text-decoration: underline;

  &:hover {
    color: #a867a6;
  }
}
</style>
