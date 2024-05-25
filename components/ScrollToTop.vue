<template>
    <div>
        <Transition name="slide-fade">
            <template v-if="isVisible">
                <button class="scroll-to-top" @click="scrollToTop">
                    <font-awesome-icon icon="arrow-up" />
                </button>
            </template>
        </Transition>
    </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleScroll = () => {
    isVisible.value = window.scrollY > 100;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease-in-out;
}

.scroll-to-top:hover {
    opacity: 0.8;
}

.slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 0.5s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
