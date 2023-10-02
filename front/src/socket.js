import { io } from 'socket.io-client';
import { v4 } from 'uuid';
import { reactive, ref } from 'vue';

const userId = ref('');

export const state = reactive({
  connected: false,
});

const url = process.env.NODE_ENV === 'production' ? 'http://userpics.eba-jmzywxvn.eu-north-1.elasticbeanstalk.com' : 'http://localhost:4000';
// const url = process.env.NODE_ENV === 'production' ? 'https://whatsapp-userpics.onrender.com' : 'http://localhost:4000';

const getUserId = () => {
  const savedUserId = localStorage.getItem('userId');
  if (savedUserId) {
    return savedUserId
  }
  return localStorage.setItem('userId', v4());
}

export const socket = io(url, {
  query: {
    userId: getUserId()
  }
});

socket.on('connect', () => {
  state.connected = true;
  console.log('connected');
});

socket.on('disconnect', () => {
  state.connected = false;
  console.log('disconnected');
});
