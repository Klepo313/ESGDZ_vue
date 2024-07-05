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
                <button id="checkBtn" type="button" disabled>
                    <font-awesome-icon icon="check-double" />
                    Provjeri odgovore
                </button>
            </div>
            <Questions :selectedGroupId="selectedGroupId" /> <!--  :ess_id="ezu_ess_id"-->
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { getStatusUpitnika } from '~/services/services';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';

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

const status = ref(null);

onMounted(async () => {
    status.value = await getStatusUpitnika(ezu_id.value);
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
</style>