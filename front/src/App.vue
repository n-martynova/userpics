<template>
  <main>
    <notifications
      position="top center"
    />
    <Loader v-if="isLoading && !users?.length" />
    <template v-else>
      <Form
        v-if="!users?.length && !qrCanvas"
        @submit="submitPhones"
      />
      <QR 
        v-if="qrCanvas" 
        :qr="qrCanvas"
      />
      <Users
        v-if="users?.length"
        :total-length="parsedPhones.length"
        :users="users"
        @reload="reload"
      />
    </template>
  </main>
</template>

<script setup>
import { notify } from '@kyvg/vue3-notification';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

import Form from './components/Form.vue';
import Loader from './components/Loader.vue';
import QR from './components/QR.vue';
import Users from './components/Users.vue';
import { socket } from './socket.js';

const isLoading = ref(true);
const phonesSent = ref(false);
const qrCanvas = ref('');
const users = ref([]);
const parsedPhones = ref([]);

const url = process.env.NODE_ENV === 'production' ? 'http://userpics.eba-jmzywxvn.eu-north-1.elasticbeanstalk.com' : 'http://localhost:4000';

const submitPhones = async (pasted) => {
  isLoading.value = true;
  phonesSent.value = true;

  parsedPhones.value = pasted.match(/\d{11}/g);

  if (!parsedPhones.value) {
    isLoading.value = false;
    notify({
      type: 'error',
      title: 'No phone numbers found, check your input!'
    });
    return;
  }

  await getUserpics();

  isLoading.value = false;
};

const getUserpics = async () => {
  return axios({
    url: `${url}/getUserpics`,
    method: 'POST',
    data: parsedPhones.value,
  })
    .then((res) => {
      users.value = res.data;
      saveUsersToLocalStorage();
    })
    .catch(() => {
      console.log('Loading failed, try again');
    });
};

const saveUsersToLocalStorage = () => {
  return localStorage.setItem('users', JSON.stringify(users.value));
};

const getUsersFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

const reload = () => {
  users.value = localStorage.removeItem('users');
};

watch(isLoading, (val) => {
  console.log('isLoading', val);
});

onMounted(async () => {
  users.value = getUsersFromLocalStorage();
  if (users.value?.length) return;

  socket.on('qr', async (qrCode) => {
    isLoading.value = false;
    qrCanvas.value = qrCode;
  });

  socket.on('client:ready', async () => {
    qrCanvas.value = '';
    isLoading.value = false;
  });
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

:deep(.vue-notification) {
  background-color: #f6daf5;
  color: #000;
  font-size: 17px;
  border-left: none;
  text-align: center;
}
</style>
