<template>
  <main>
    <h3 v-if="isLoading && !userpics.length" class="loading">Loading</h3>
    <div v-if="!isLoading && !parsedNumbers.length" class="textarea_container">
      <textarea class="textarea" placeholder="Paste numbers here..." v-model="pasted" @keydown.enter.prevent="submitNumbers" />
      <div class="submit" @click="submitNumbers">Submit!</div>
    </div>
    <div v-if="isQRVisible" class="qr-container">
      <canvas 
        v-if="isQRVisible"
        ref="canvas" 
        class="canvas"
      />
    </div>
    
    <div v-if="userpics.length" class="numbers">
      <div 
        v-for="(n, index) in parsedNumbers"
        class="user"
        :class="!userpics[index] && 'user--hidden'"
      >
        <div class="phone">{{ n }}</div>
        <img 
          :src="userpics[index]"
          width="250" 
          height="250"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import QRCode from 'qrcode';
import { socket } from './socket.js';
import { v4 } from 'uuid';

const userId = ref('');
const canvas = ref(null);
const parsedNumbers = ref([]);
const userpics = ref([]);
const isLoading = ref(true);
const isQRVisible = ref(false);
const numbersSent = ref(false);
const pasted = ref('');
const url = process.env.NODE_ENV === "production" ? "https://whatsapp-userpics.onrender.com" : "http://localhost:4000";

const getUserId = () => {
  const savedUserId = localStorage.getItem("userId");
  if (savedUserId) {
    userId.value = savedUserId;
    return;
  }
  userId.value = v4();
  localStorage.setItem("userId", userId.value);
}

const extractNumbers = () => {
  parsedNumbers.value = pasted.value.match(/\d{11}/g);
}

const loadAvatars = async () => {
  await Promise.all(
    parsedNumbers.value.map(async (number) => {
      return getUserpic(number);
    })
  ).then((pics) => {
      userpics.value = pics;
    }).catch(async (error) => {
    await auth();
    await loadAvatars();
  });
}

const submitNumbers = async () => {
  isLoading.value = true;
  numbersSent.value = true;

  extractNumbers();

  if (!parsedNumbers.value) {
    isLoading.value = false;
    return;
  }

  await loadAvatars();

  isLoading.value = false;
}

const getUserpic = async (number) => {
  return axios({
    url: `${url}/getUserpic`,
    method: 'POST',
    data: {
      id: `${number}@c.us`
    }
  }).then(res => {
    return res.data;
  })
  .catch(error => {
    console.log(error)
  })
}

onMounted(async () => {
  socket.on('qr', async (qr) => {
    isLoading.value = false;
    isQRVisible.value = true;

    await nextTick();
    QRCode.toCanvas(canvas.value, qr, function (error) {
      if (error) console.error(error);
    })
  });

  socket.on('client:ready', async () => {
    isQRVisible.value = false;
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

.textarea_container {
  margin-right: 20px;
}

.textarea {
  display: block;
  height: 230px;
  width: 350px;
  padding: 5px;
  margin-bottom: 10px;
  font-size: 16px;
}

.submit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  border: 1px solid #a4a2a2;
  cursor: pointer;  
  font-size: 21px;
  background-color: #f6daf5;
}

.user {
  display: flex;
  padding: 15px 0;
  flex-direction: row;
  align-items: flex-start;
  border-bottom: 1px solid #a4a2a2;

  &--hidden {
    display: none;
  }
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 280px;
  position: relative;
  border: 1px dashed #a4a2a2;
}

.qr-alt {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.phone {
  width: 150px;
  padding: 5px 0;
  margin-right: 10px;
  font-size: 19px;
}

.loading {
  width: 200px;
  &::after {
    display: inline-block;
    animation: dotty steps(1,end) 1s infinite;
    content: '';
  }
}

@keyframes dotty {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
  100% { content: ''; }
}

.numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0 25px;
}
</style>
