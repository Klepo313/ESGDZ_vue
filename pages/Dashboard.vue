<template>
    <div>
        <AutoSavePopUp />
        <ScrollToTop />
        <div class="grid">
            <nuxt-link to="/" tag="div" class="grid-item img-section">
                <img class="agram-logo" src=".././public/images/agram_lolo.png" alt="agram_logo">
            </nuxt-link>
            <div class="grid-item header">
                <Navbar :tvkId="tvk_id" :korId="kor_id" :korKorime="kor_korime.toLowerCase()" />
            </div>
            <div class="grid-item sidebar" v-if="upitnik && upitnikData">
                <Sidebar :evu_sif="evu_sif" :upitnik="upitnik" :upitnikData="upitnikData"
                    @group-selected="handleGroupSelected" />
            </div>
            <div class="grid-item content" v-if="upitnikData && evu_naziv && ezu_ess_id">
                <Content :evu_naziv="evu_naziv" :ezu_ess_id="ezu_ess_id" :upitnikData="upitnikData"
                    :selectedGroupId="parseInt(selectedGroupId)" />
            </div>
            <div class="grid-item graphs last-element" v-if="1 === 1">
                <Charts :selectedGroupId="parseInt(selectedGroupId)" :upitnikData="upitnikData" />
            </div>
            <div v-else>
                Loading...
            </div>
        </div>
        <div id="back_arrow">
            <nuxt-link to="/upitnik" class="arrow-icon">
                <font-awesome-icon icon="arrow-left-long" />
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';
import { useUserInfoStore } from '~/stores/userInfoStore';
import { getUpitnikData, getAnswersForUpitnik } from '~/services/services';

onBeforeMount(() => {
    const ekoParId = localStorage.getItem('eko_par_id_za');
    const ekoId = localStorage.getItem('eko_id');
    const ekoKorime = localStorage.getItem('eko_korime');

    if (!ekoParId || !ekoId || !ekoKorime) {
        return navigateTo('/login');
    }
})

const upitnikInfoStore = useUpitnikInfoStore();
const userInfoStore = useUserInfoStore();
const isLoading = ref(true);

const tvk_id = computed(() => {
    const id = userInfoStore.ekoParId;
    return isNaN(id) ? 0 : parseInt(id);
});

const kor_id = computed(() => {
    const id = userInfoStore.ekoId
    return isNaN(id) ? 0 : parseInt(id);
});

const kor_korime = computed(() => {
    const korime = userInfoStore.ekoKorime;
    return korime ? korime : '';  // Vrati prazan string ako je null
});

const evu_sif = computed(() => {
    const sif = upitnikInfoStore.getEvuSif;
    return sif;
});

const ezu_ess_id = computed(() => {
    const id = upitnikInfoStore.getEzuEssId;
    return isNaN(id) ? 0 : parseInt(id);
});

const evu_naziv = computed(() => {
    const naziv = upitnikInfoStore.getEzuNaziv;
    return naziv;
});

console.log(evu_naziv.value);

const ezu_id = computed(() => {
    const id = upitnikInfoStore.getEzuId;
    return isNaN(id) ? 0 : parseInt(id);
});

const upitnik = ref(null);
const upitnikData = ref(null);
const answers = ref(null);
const selectedGroupId = ref(null);

const loadData = async () => {
    isLoading.value = true;
    try {
        upitnik.value = await getUpitnikData(evu_sif.value);
        answers.value = await getAnswersForUpitnik(ezu_id.value);
        console.log(answers.value);
        if (upitnik.value && upitnik.value.length > 0) {
            upitnikData.value = upitnik.value[0].children;
            //upitnikInfoStore.setEzuNaziv(upitnik.value[0].name)
        }
    } finally {
        isLoading.value = false;
    }
};


// Watch for changes in evu_sif and reload data
watch(evu_sif, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        await loadData();
    }
});

const handleGroupSelected = (groupId) => {
    selectedGroupId.value = groupId;
};

onMounted(async () => {
    userInfoStore.initializeStore();
    upitnikInfoStore.initializeStore();
    await loadData();
});
</script>

<style scoped>
* {
    overflow: hidden;
}

#back_arrow {
    position: fixed;
    top: 16px;
    left: 16px;
    opacity: 0.8;
}

#back_arrow .arrow-icon {
    color: inherit;
    text-decoration: none;
}

#back_arrow:hover {
    opacity: 1;
    cursor: pointer;
    left: 14px;
}

.grid {
    padding: 60px;
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 330px auto 250px;
    /* Tri stupca */
    column-gap: 5vw;
    row-gap: 8dvh;
}

.agram-logo {
    width: 100%;
    max-height: auto;
    object-fit: cover;
}

.img-section {
    max-width: 270px;
    display: flex;
    align-items: center;
}

.header {
    display: flex;
    align-items: flex-end;
    grid-area: 1 / 2 / span 1 / span 2;
}

.sidebar {
    height: min-content;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    grid-column: 1;
}

.content {
    grid-column: 2;
}

.graphs {
    grid-column: 3;
    border-radius: 10px;
}
</style>
