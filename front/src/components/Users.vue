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
        <div class="phone">
          {{ phone }}
        </div>
        <img 
          :src="pic"
          width="250" 
          height="250"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
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
</script>

<style lang="scss" scoped>

.users {
  display: flex;
  flex-wrap: wrap;
  gap: 0 25px;

  .user {
    display: flex;
    padding: 15px 0;
    flex-direction: row;
    align-items: flex-start;
    border-bottom: 1px solid #a4a2a2;
  }

  .phone {
    width: 150px;
    padding: 5px 0;
    margin-right: 10px;
    font-size: 19px;
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
</style>
