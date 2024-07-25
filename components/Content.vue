<template>
    <div>
        <div class="header-div" style="position: relative;">
            <div class="h1-div">
                <h1>
                    {{ evu_naziv }}
                </h1>
                <div class="h1-rctg"></div>
            </div>
            <span v-if="status"
                :class="{ 'status-yellow': status[0].ezu_status == 0, 'status-green': status[0].ezu_status == 1 }"
                class="status">
                {{ status[0].status_txt }}
            </span>
        </div>
        <div class="breadcrumber-div">
            <div class="link-div">
                <Breadcrumb :upitnikData="upitnikData" :selectedGroupId="selectedGroupId" />
            </div>
        </div>
        <div class="component-div">
            <div class="content-div">
                <h2>Pitanja</h2>
                <div class="bckfwrd">
                    <button type="button" id="backButton" class="arrow_btn" @click="goToPreviousGroup">
                        <font-awesome-icon icon="arrow-left" size="lg" />
                    </button>
                    <button type="button" id="fwrdButton" class="arrow_btn" @click="goToNextGroup">
                        <font-awesome-icon icon="arrow-right" size="lg" />
                    </button>
                </div>
            </div>
            <Questions :selectedGroupId="selectedGroupId" @update-selected-options="handleUpdateSelectedOptions" />
            <!--  :ess_id="ezu_ess_id"-->
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { getStatusUpitnika, getOrderedIDs } from '~/services/services';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const upitnikInfoStore = useUpitnikInfoStore();

const ezu_id = computed(() => {
    const id = upitnikInfoStore.getEzuId;
    return isNaN(id) ? 0 : parseInt(id);
});

const props = defineProps({
    evu_naziv: String,
    ezu_ess_id: Number,
    upitnikData: Object,
    selectedGroupId: Number
});

const emit = defineEmits(['update-selected-options']);

const handleUpdateSelectedOptions = (selectedCheckboxes) => {
    emit('update-selected-options', selectedCheckboxes.value);
}

const status = ref(null);
// const firstGroupId = parseInt(props.upitnikData[0].id);
// const lastGroupId = parseInt(lastItem.value.id) || parseInt(props.upitnikData[props.upitnikData.length - 1].id);
const currentId = ref(0);
const orderedIdList = ref([]);

// Funkcija za dobivanje ID-a grupe iz hasha URL-a
const getGroupIdFromHash = () => {
    const hash = router.currentRoute.value.hash;
    if (!hash || hash === '#') return null;
    return parseInt(hash.slice(1)); // Ukloni '#' i pretvori u broj
};

currentId.value = getGroupIdFromHash();

// Pratimo promjene u hashu
watch(() => router.currentRoute.value.hash, async (newHash, oldHash) => {
    currentId.value = getGroupIdFromHash();
    fetchOrderedIds();
});

// STARI KOD
// const checkPreviousGroup = () => {
//     const back_arrow = document.getElementById('backButton');
//     if ((currentId.value - 1) < firstGroupId) {
//         back_arrow.style.opacity = '0.5';
//         back_arrow.classList.add('no-hover', 'no-active');
//         return false;
//     } else {
//         back_arrow.style.opacity = '1';
//         back_arrow.classList.remove('no-hover', 'no-active');
//         return true;
//     }
// }

// const checkNextGroup = () => {
//     const fwrd_arrow = document.getElementById('fwrdButton');
//     if ((currentId.value + 1) > lastGroupId) {
//         fwrd_arrow.style.opacity = '0.5';
//         fwrd_arrow.classList.add('no-hover', 'no-active');
//         return false;
//     } else {
//         fwrd_arrow.style.opacity = '1';
//         fwrd_arrow.classList.remove('no-hover', 'no-active');
//         return true;
//     }
// }

// const goToPreviousGroup = () => {
//     if (checkPreviousGroup()) {
//         currentId.value--;
//         router.push(`#${currentId.value}`);
//     }
// }

// const goToNextGroup = () => {
//     if (checkNextGroup()) {
//         currentId.value++;
//         router.push(`#${currentId.value}`);
//     }
// }

// Funkcija za uklanjanje duplikata iz niza, ali ostavlja jednu instancu svakog broja
const keepOneInstance = (arr) => {
    // Koristi Set za automatsko uklanjanje duplikata
    const uniqueSet = new Set(arr);

    // Pretvori Set natrag u niz
    return Array.from(uniqueSet);
};

const fetchOrderedIds = async () => {
    try {
        const response = await getOrderedIDs();
        orderedIdList.value = response
            .filter(item => item.ess_id_new !== null) // Filtriraj null vrijednosti
            .map(item => Number(item.ess_id_new));   // Mapiraj u niz brojeva
        orderedIdList.value = keepOneInstance(orderedIdList.value);
    } catch (error) {
        console.error('Error fetching ordered IDs:', error);
    }

    // console.log("ORDERED: ", orderedIdList.value)
    if (!(getGroupIdFromHash() === null)) {
        checkPreviousGroup();
        checkNextGroup();
    } else {
        const back_arrow = document.getElementById('backButton');
        const fwrd_arrow = document.getElementById('fwrdButton');

        back_arrow.style.opacity = '0.5';
        back_arrow.classList.add('no-hover', 'no-active');
        fwrd_arrow.style.opacity = '0.5';
        fwrd_arrow.classList.add('no-hover', 'no-active');
    }
};

const checkPreviousGroup = () => {
    const back_arrow = document.getElementById('backButton');
    const currentIndex = orderedIdList.value.indexOf(currentId.value);

    if (currentIndex === -1) {
        console.error(`Current ID ${currentId.value} not found in ordered ID list.`);
        return false;
    }

    if (currentIndex - 1 < 0) {
        back_arrow.style.opacity = '0.5';
        back_arrow.classList.add('no-hover', 'no-active');
        return false;
    } else {
        back_arrow.style.opacity = '1';
        back_arrow.classList.remove('no-hover', 'no-active');
        return true;
    }
};
const checkNextGroup = () => {
    const fwrd_arrow = document.getElementById('fwrdButton');
    const currentIndex = orderedIdList.value.indexOf(currentId.value);

    if (currentIndex === -1) {
        console.error(`Current ID ${currentId.value} not found in ordered ID list.`);
        return false;
    }

    if (currentIndex + 1 >= orderedIdList.value.length || orderedIdList.value[currentIndex + 1] === null) {
        fwrd_arrow.style.opacity = '0.5';
        fwrd_arrow.classList.add('no-hover', 'no-active');
        return false;
    } else {
        fwrd_arrow.style.opacity = '1';
        fwrd_arrow.classList.remove('no-hover', 'no-active');
        return true;
    }
};

const goToPreviousGroup = () => {
    const currentIndex = orderedIdList.value.indexOf(currentId.value);
    if (checkPreviousGroup()) {
        currentId.value = orderedIdList.value[currentIndex - 1];
        router.push(`#${currentId.value}`);
    }
}

const goToNextGroup = () => {
    const currentIndex = orderedIdList.value.indexOf(currentId.value);
    if (checkNextGroup()) {
        currentId.value = orderedIdList.value[currentIndex + 1];
        router.push(`#${currentId.value}`);
    }
}

const handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === 'ArrowRight') {
        goToNextGroup();
        event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'ArrowLeft') {
        goToPreviousGroup();
        event.preventDefault();
    }
};

onMounted(async () => {
    status.value = await getStatusUpitnika(ezu_id.value);
    fetchOrderedIds();
    window.addEventListener('keydown', handleKeyPress);
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.header-div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.content-div {
    margin-top: 10px;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

#checkBtn {
    padding: 12px;
    font-size: 14px;
    border-radius: 5px;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
}

.h1-div {
    display: inline-block;
    position: relative;
}

.h1-rctg {
    position: absolute;
    left: 10px;
    bottom: 0px;

    width: 100%;
    height: 12px;
    background-color: var(--primary-color);
    filter: opacity(30%);
}

.breadcrumber-div {
    margin-top: 10px;
    height: 66px;
    display: flex;
    align-items: center;

    background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
}

.link-div {
    padding: 6px 20px;
    border-left: 3px solid var(--primary-color);
}

.component-div {
    /* outline: 1px solid red; */
    /* min-height: 80vh; Visina skrolajućeg dijela (80% visine prozora) */
    margin-top: 10px;
    overflow: visible;
    /* Omogućuje skrolanje samo po vertikali */
    position: relative;
    /* Za pseudo-elemente */
}

.status {
    /* position: absolute;
    right: 0;
    top: 10px; */
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
}

.status-yellow {
    color: var(--yellow);
    /* color: rgb(179, 167, 0); */
}

.status-green {
    color: var(--green);
}

.bckfwrd {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    /* overflow: hidden; */
}

.bckfwrd:hover .ctrl {
    display: block;
    transition: transform 0.3s ease-in-out;
}

.ctrl {
    display: none;
    position: absolute;
    font-size: 12px;
    padding: 2px;
    width: 100%;
    border-radius: 5px;
    background-color: #e0e0e0;
    top: -25px;
    overflow: visible;
    text-align: center;
    transition: transform 0.3s ease-in-out;
}

.arrow_btn {
    outline: none;
    background: none;
    border: none;
    border-radius: 50%;
    padding: 5px;
    width: 28px;
}

.arrow_btn:hover {
    transform-origin: center;
    background-color: rgb(224, 224, 224);
    cursor: pointer;
}

.arrow_btn:active {
    background-color: rgb(158, 158, 158);
    opacity: 1;
}

.no-hover {
    pointer-events: none;
}

.no-active:active {
    pointer-events: none;
}

@media screen and (max-width: 1224px) {
    h1 {
        font-size: 25px;
    }

    .h1-rctg {
        height: 8px;
        bottom: 5px;
    }
}
</style>