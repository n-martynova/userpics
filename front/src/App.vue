<template>
  <main>
    <Loader v-if="isLoading && !users?.length" />
    <template v-else>
      <Form
        v-if="!users?.length"
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
import axios from 'axios';
import { onMounted, ref } from 'vue';

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
// const url = process.env.NODE_ENV === 'production' ? 'https://whatsapp-userpics.onrender.com' : 'http://localhost:4000';

const submitPhones = async (pasted) => {
  isLoading.value = true;
  phonesSent.value = true;

  parsedPhones.value = pasted.match(/\d{11}/g);

  if (!parsedPhones.value) {
    isLoading.value = false;
    return;
  }

  await getUserpics();

  isLoading.value = false;
}

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
    .catch((error) => {
      console.log('Loading failed, try again');
    });
};

const saveUsersToLocalStorage = () => {
  return localStorage.setItem('users', JSON.stringify(users.value));
}

const getUsersFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

// const reload = () => {
//   localStorage.removeItem('users');

//   return axios({
//     url: `${url}/reload`,
//     method: 'GET',
//   })
//     .catch((error) => {
//       console.log(error);
//     });
// }

const reload = () => {
  users.value = localStorage.removeItem('users');
}

onMounted(async () => {
  users.value = getUsersFromLocalStorage();
  if (users.value?.length) return;

  socket.on('qr', async (qrCode) => {
    isLoading.value = false;
    qrCanvas.value = qrCode;
  });

  socket.on('client:ready', async () => {
    console.log('ready socket')
    qrCanvas.value = '';
    isLoading.value = false;
  });
})
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
</style>
