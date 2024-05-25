<!-- <template>
    <div class="loading-overlay">
        <font-awesome-icon id="spin-icon" icon="spinner" size="xl" spin />
    </div>
</template>

<style scoped>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    color: black;
    /* background-color: rgba(160, 20, 20, 0.8); */
    background-color: rgba(255, 255, 255, 0.8);

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
</style> -->

<!-- components/Loading.vue -->
<template>
    <div class="fingerprint-spinner" v-if="visible">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
    </div>
</template>

<script>
import { ref } from 'vue';

const visible = ref(false);

export function showLoading() {
    visible.value = true;
}

export function hideLoading() {
    visible.value = false;
}
</script>

<style scoped>
.fingerprint-spinner, .fingerprint-spinner * {
  box-sizing: border-box;
}
.fingerprint-spinner {
  height: 64px;
  width: 64px;
  padding: 2px;
  overflow: hidden;
  position: relative;
}
.fingerprint-spinner .spinner-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #ff1d5e;
  animation: fingerprint-spinner-animation 1500ms cubic-bezier(0.680, -0.750, 0.265, 1.750) infinite forwards;
  margin: auto;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
.fingerprint-spinner .spinner-ring:nth-child(1) {
  height: calc(60px / 9 + 0 * 60px / 9);
  width: calc(60px / 9 + 0 * 60px / 9);
  animation-delay: calc(50ms * 1);
}
.fingerprint-spinner .spinner-ring:nth-child(2) {
  height: calc(60px / 9 + 1 * 60px / 9);
  width: calc(60px / 9 + 1 * 60px / 9);
  animation-delay: calc(50ms * 2);
}
.fingerprint-spinner .spinner-ring:nth-child(3) {
  height: calc(60px / 9 + 2 * 60px / 9);
  width: calc(60px / 9 + 2 * 60px / 9);
  animation-delay: calc(50ms * 3);
}
.fingerprint-spinner .spinner-ring:nth-child(4) {
  height: calc(60px / 9 + 3 * 60px / 9);
  width: calc(60px / 9 + 3 * 60px / 9);
  animation-delay: calc(50ms * 4);
}
.fingerprint-spinner .spinner-ring:nth-child(5) {
  height: calc(60px / 9 + 4 * 60px / 9);
  width: calc(60px / 9 + 4 * 60px / 9);
  animation-delay: calc(50ms * 5);
}
.fingerprint-spinner .spinner-ring:nth-child(6) {
  height: calc(60px / 9 + 5 * 60px / 9);
  width: calc(60px / 9 + 5 * 60px / 9);
  animation-delay: calc(50ms * 6);
}
.fingerprint-spinner .spinner-ring:nth-child(7) {
  height: calc(60px / 9 + 6 * 60px / 9);
  width: calc(60px / 9 + 6 * 60px / 9);
  animation-delay: calc(50ms * 7);
}
.fingerprint-spinner .spinner-ring:nth-child(8) {
  height: calc(60px / 9 + 7 * 60px / 9);
  width: calc(60px / 9 + 7 * 60px / 9);
  animation-delay: calc(50ms * 8);
}
.fingerprint-spinner .spinner-ring:nth-child(9) {
  height: calc(60px / 9 + 8 * 60px / 9);
  width: calc(60px / 9 + 8 * 60px / 9);
  animation-delay: calc(50ms * 9);
}
@keyframes fingerprint-spinner-animation {
  100% {
    transform: rotate( 360deg );
  }
}
</style>
