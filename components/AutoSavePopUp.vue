<template>
    <div>
        <transition name="slide-fade">
            <div class="popup" v-if="visible">
                <div class="content">
                    <font-awesome-icon icon="floppy-disk" />
                    Sve promijene se automatski spremaju!
                </div>
                <div class="progress-bar"></div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visible = ref(false);

onMounted(() => {
    visible.value = true;
    setTimeout(() => {
        visible.value = false;
    }, 4000);
});
</script>

<style scoped>
.popup {
    position: absolute;
    top: 20px;
    right: 20px;
    width: auto;
    background-color: #E7F2F9;
    border-radius: 5px;
    border: 0.5px solid rgba(11, 121, 189, 0.500);
    overflow: hidden;
}

.popup .content {
    font-size: 14px;
    padding: 16px;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
}

.progress-bar {
    height: 5px;
    background-color: rgb(11, 121, 189);
    width: 100%;
    animation: progress 4s linear;
}

@keyframes progress {
    0% {
        width: 0%;
    }
    100% {
        width: 100%;
    }
}

.slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 0.5s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
