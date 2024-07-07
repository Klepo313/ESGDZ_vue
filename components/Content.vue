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
                <!--<button id="checkBtn" type="button" disabled>
                    <font-awesome-icon icon="check-double" />
                    Provjeri odgovore
                </button>-->
                <div class="bckfwrd">
                    <button type="button" id="backButton" class="arrow_btn" @click="goToPreviousGroup">
                        <font-awesome-icon icon="arrow-left" size="lg" />
                    </button>
                    <button type="button" id="fwrdButton" class="arrow_btn" @click="goToNextGroup">
                        <font-awesome-icon icon="arrow-right" size="lg" />
                    </button>
                </div>
            </div>
            <Questions :selectedGroupId="selectedGroupId" /> <!--  :ess_id="ezu_ess_id"-->
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { getStatusUpitnika } from '~/services/services';
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

const totalSize = computed(() => {
    return props.upitnikData.reduce((count, item) => {
        return count + (item.children ? item.children.length : 0);
    }, 0);
});

const lastItem = computed(() => {
    const allItems = props.upitnikData.flatMap(item => item.children || []);
    return allItems.length > 0 ? allItems[allItems.length - 1] : null;
});

// console.log("Upitnik: ", props.upitnikData)
// console.log("evo ID: ", props.upitnikData[0].id)
// console.log("Zadnji element: ", lastItem.value.id);
// console.log("Velicina upitnika: ", totalSize.value);

const status = ref(null);
const firstGroupId = parseInt(props.upitnikData[0].id);
const lastGroupId = parseInt(lastItem.value.id);
const currentId = ref(0);

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
    checkPreviousGroup();
    checkNextGroup();
});

const checkPreviousGroup = () => {
    const back_arrow = document.getElementById('backButton');
    if ((currentId.value - 1) < firstGroupId) {
        back_arrow.style.opacity = '0.5';
        back_arrow.classList.add('no-hover', 'no-active');
        return false;
    } else {
        back_arrow.style.opacity = '1';
        back_arrow.classList.remove('no-hover', 'no-active');
        return true;
    }
}

const checkNextGroup = () => {
    const fwrd_arrow = document.getElementById('fwrdButton');
    if ((currentId.value + 1) > lastGroupId) {
        fwrd_arrow.style.opacity = '0.5';
        fwrd_arrow.classList.add('no-hover', 'no-active');
        return false;
    } else {
        fwrd_arrow.style.opacity = '1';
        fwrd_arrow.classList.remove('no-hover', 'no-active');
        return true;
    }
}

const goToPreviousGroup = () => {
    if (checkPreviousGroup()) {
        currentId.value--;
        router.push(`#${currentId.value}`);
    }
}

const goToNextGroup = () => {
    if (checkNextGroup()) {
        currentId.value++;
        router.push(`#${currentId.value}`);
    }
}

onMounted(async () => {
    status.value = await getStatusUpitnika(ezu_id.value);
    checkPreviousGroup();
    checkNextGroup();
})
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

/* #checkBtn:hover {
    background-color: rgba(111, 111, 111, 0.118);
}

#checkBtn:active {
    transform: scale(1.05);
} */

/* #checkBtn:hover {
    border-bottom: 1px solid black;
} */

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
    overflow-y: auto;
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.arrow_btn {
    outline: none;
    background: none;
    border: none;
}

.arrow_btn:hover {
    transform: scale(1.1);
    opacity: 0.9;
}

.arrow_btn:active {
    transform: scale(1.2);
}

.no-hover {
    pointer-events: none;
}

.no-active:active {
    pointer-events: none;
}
</style>