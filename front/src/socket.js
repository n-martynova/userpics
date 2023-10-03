import { io } from 'socket.io-client';
import { v4 } from 'uuid';

const url = process.env.NODE_ENV === 'production' ? 'http://userpics.eba-jmzywxvn.eu-north-1.elasticbeanstalk.com' : 'http://localhost:4000';

const getUserId = () => {
  const savedUserId = localStorage.getItem('userId');
  if (savedUserId) {
    return savedUserId;
  }
  return localStorage.setItem('userId', v4());
};

export const socket = io(url, {
  query: {
    userId: getUserId()
  }
});

socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  console.log('disconnected');
});
