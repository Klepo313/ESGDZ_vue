<template>
    <div>
        <!-- <Loading v-if="isLoading" /> -->
        <div class="main">
            <div class="logo-div">
                <img class="logo" src=".././public/images/agram_lolo.png" alt="logo">
            </div>
            <div class="navbar">
                <!-- <Navbar :tvkId="tvk_id" :korId="kor_id" :korKorime="kor_korime" /> -->
                <Navbar :tvkId="tvk_id" :korId="kor_id" :korKorime="kor_korime.toLowerCase()" />
            </div>
            <div v-if="upitnici" class="content">
                <div class="content-div active-div">
                    <h2>Aktivni upitnici</h2>
                    <span v-if="!aktivniUpitnici || aktivniUpitnici.length === 0" class="info_empty">
                        <font-awesome-icon icon="circle-info" />
                        Nema aktivnih upitnika
                    </span>
                    <TransitionGroup v-else name="list" tag="div" class="upitnici">
                        <div v-for="upitnik in aktivniUpitnici" :key="upitnik.ezu_id" :data-key="upitnik.ezu_id"
                            class="upitnik" @click="routerToDashboard">
                            <div class="upt-header">
                                <font-awesome-icon icon="file-pen" class="first-element" size="lg" />
                                <span class="second-element">
                                    <nuxt-link to="/" @click="setUpitnikData(upitnik);"
                                        style="text-decoration: none; color: inherit;">
                                        {{ upitnik.evu_naziv }} ({{ formatDate(upitnik.ezu_kreirano) }})
                                    </nuxt-link>
                                </span>
                                <font-awesome-icon @click="toggleInfo(upitnik)"
                                    :icon="visibleInfo === parseInt(upitnik.ezu_id) ? 'chevron-up' : 'chevron-down'"
                                    class="icon" size="lg" />
                            </div>
                            <div v-show="visibleInfo === parseInt(upitnik.ezu_id)"
                                :class="['upt-info', { 'active': visibleInfo === parseInt(upitnik.ess_id) }]">
                                <font-awesome-icon icon="chart-simple" />
                                <span class="grid-item"
                                    style="color: green; text-transform: uppercase; font-weight: 600;">U pripremi</span>
                                <font-awesome-icon icon="calendar-plus" />
                                <span class="grid-item">{{ formatDate(upitnik.ezu_kreirano) }}</span>
                                <!-- <font-awesome-icon icon="calendar-check" />
                                <span class="grid-item">{{ formatDate(upitnik.ezu_datum) }}</span> -->
                                <font-awesome-icon icon="user" />
                                <span class="grid-item">{{ kor_korime.toLowerCase() }}</span>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
                <div class="content-div inactive-div">
                    <h2>Zaključani upitnici</h2>
                    <span v-if="!zakljuceniUpitnici || zakljuceniUpitnici.length === 0" class="info_empty">
                        <font-awesome-icon icon="circle-info" />
                        Nema zaključanih upitnika
                    </span>
                    <TransitionGroup v-else name="list" tag="div" class="upitnici">
                        <div v-for="upitnik in zakljuceniUpitnici" :key="upitnik.ezu_id" :data-key="upitnik.ezu_id"
                            class="upitnik" @click="routerToDashboard">
                            <div class="upt-header">
                                <font-awesome-icon icon="file-pen" class="first-element" size="lg" />
                                <span class="second-element">
                                    <nuxt-link to="/" @click="setUpitnikData(upitnik);"
                                        style="text-decoration: none; color: inherit;">
                                        {{ upitnik.evu_naziv }} ({{ formatDate(upitnik.ezu_kreirano) }})
                                    </nuxt-link>
                                </span>
                                <font-awesome-icon @click="toggleInfo(upitnik)"
                                    :icon="visibleInfo === parseInt(upitnik.ezu_id) ? 'chevron-up' : 'chevron-down'"
                                    class="icon" size="lg" />
                            </div>
                            <div v-show="visibleInfo === parseInt(upitnik.ezu_id)"
                                :class="['upt-info', { 'active': visibleInfo === parseInt(upitnik.ess_id) }]">
                                <font-awesome-icon icon="chart-simple" />
                                <span class="grid-item"
                                    style="color: red; text-transform: uppercase; font-weight: 600;">Zaključeno</span>
                                <font-awesome-icon icon="calendar-plus" />
                                <span class="grid-item">{{ formatDate(upitnik.ezu_kreirano) }}</span>
                                <!-- <font-awesome-icon icon="calendar-check" />
                                <span class="grid-item">{{ formatDate(upitnik.ezu_datum) }}</span> -->
                                <font-awesome-icon icon="user" />
                                <span class="grid-item">{{ kor_korime.toLowerCase() }}</span>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </div>
            <div v-else>
                Loading...
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';
import { useUserInfoStore } from '~/stores/userInfoStore.js';
import { computed, ref, onBeforeMount, TransitionGroup } from 'vue';
import { getUpitnici, getStatusUpitnika } from '~/services/services';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

onBeforeMount(() => {
    // const ekoParId = Cookies.get('eko_par_id_za');
    // const ekoId = Cookies.get('eko_id');
    // const ekoKorime = Cookies.get('eko_korime');

    // if (!ekoParId || !ekoId || !ekoKorime) {
    //     return navigateTo('/login');
    // }
})

// Reactive property za prikazivanje Loading komponente
const isLoading = ref(true);
const upitnici = ref([]);
const aktivniUpitnici = ref([]);
const zakljuceniUpitnici = ref([]);

const visibleInfo = ref(0);

const userInfoStore = useUserInfoStore();
const upitnikInfoStore = useUpitnikInfoStore();

const router = useRouter();

const tvk_id = computed(() => {
    const id = userInfoStore.ekoParId;
    return isNaN(id) ? 0 : parseInt(id);
});
const kor_id = computed(() => {
    const id = userInfoStore.ekoId;
    return isNaN(id) ? 0 : parseInt(id);
});
const kor_korime = computed(() => {
    const korime = userInfoStore.ekoKorime;
    return korime ? korime : '';  // Vrati prazan string ako je null
});
// const ezu_id = computed(() => {
//     const id = upitnikInfoStore.getEzuId;
//     return isNaN(id) ? 0 : parseInt(id);
// });

const toggleInfo = (upitnik) => {
    const ezu_id = parseInt(upitnik.ezu_id);

    if (visibleInfo.value === ezu_id) {
        visibleInfo.value = 0;
    } else {
        visibleInfo.value = ezu_id;
        const upitnikDivs = document.querySelectorAll('.upitnik');
        upitnikDivs.forEach((div) => {
            div.style.height = "62px";
        });

        const clickedDiv = document.querySelector('.upitnik[data-key="' + ezu_id + '"]');
        if (clickedDiv) {
            clickedDiv.style.height = "auto";
        }
    }
};

const sortUpitnike = async () => {
    for (let i = 0; i < upitnici.value.length; i++) {
        const data = await getStatusUpitnika(parseInt(upitnici.value[i].ezu_id));
        // // console.log(parseInt(upitnici.value[i].ezu_id), ", ", data);
        // // console.log("Status: ", data[0].ezu_status)
        if (data[0].ezu_status == 0) {
            aktivniUpitnici.value.push(upitnici.value[i])
        } else {
            zakljuceniUpitnici.value.push(upitnici.value[i])
        }
    }

    // console.log("Aktivni upitnici: ", aktivniUpitnici.value);
    // console.log("Zakljuceni upitnici: ", zakljuceniUpitnici.value);
}

const fetchUpitnici = async () => {
    upitnici.value = [];
    aktivniUpitnici.value = [];
    zakljuceniUpitnici.value = [];
    // console.log(upitnici.value, aktivniUpitnici.value, zakljuceniUpitnici.value);
    try {
        const data = await getUpitnici(kor_korime.value, tvk_id.value);
        upitnici.value = data;
        // console.log(upitnici.value);

        await sortUpitnike();

    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
    } finally {
        isLoading.value = false;
    }
};

const setUpitnikData = (upitnik) => {
    try {
        upitnikInfoStore.setUpitnikInfo({
            evu_sif: upitnik.evu_sif,
            ezu_ess_id: upitnik.ezu_ess_id,
            ezu_id: upitnik.ezu_id,
            ezu_ezp_id: upitnik.ezu_ezp_id,
            ezu_naziv: upitnik.evu_naziv
        })
        // upitnikInfoStore.setEvuSif(upitnik.evu_sif);
        // upitnikInfoStore.setEzuEssId(upitnik.ezu_ess_id);
        // upitnikInfoStore.setEzuId(upitnik.ezu_id);
        // upitnikInfoStore.setEzuEzpId(upitnik.ezu_ezp_id);
        // upitnikInfoStore.setEzuNaziv(upitnik.evu_naziv);
    } catch (error) {
        console.error('Pogreška pri spremanju u store');
        return error;
    }
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// watch(tvk_id, async (newTvkId) => {
//     if (newTvkId) {
//         await fetchUpitnici();
//     }
// });

// watchEffect(async () => {
//     await fetchUpitnici();
// });

onMounted(async () => {
    await userInfoStore.initializeStore();
    await fetchUpitnici();
});
</script>

<style scoped>
.main {
    background-color: var(--white);
    padding: 60px;
    width: 100%;
    height: auto;

    display: grid;
    grid-template-columns: 270px auto;
    column-gap: 5vw;
    row-gap: 8dvh;
}

.logo-div {
    display: flex;
    align-items: center;
}

.logo {
    width: 100%;
}

h2 {
    margin-top: 0px;
}

.content {
    grid-column: 1 / 3;

    display: flex;
    flex-direction: column;
    gap: 30px;
}

.content-div {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.upitnici {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 15px;
}

.upitnik {
    height: 62px;
    width: 100%;
    max-width: 400px;
    padding: 18px;
    color: var(--light-dark);
    background-color: #0b79bd30;
    border-radius: 5px;
    border: 1px solid var(--primary-color);

    display: flex;
    flex-direction: column;
    gap: 20px;

    transition: height 0.3s ease;
}

.upt-header:hover .first-element,
.upt-header:hover .second-element {
    color: var(--primary-color);
    cursor: pointer;
}

.upt-header:hover .icon {
    color: inherit;
}

.upt-header:hover:not(.icon):not(:hover) .first-element,
.upt-header:hover:not(.icon):not(:hover) .second-element {
    color: var(--primary-color);
    cursor: pointer;
}

.upt-header {
    font-weight: 600;
    display: flex;
    align-items: center;
    position: relative;
    padding-right: 18px;
}

.upt-header>span {
    margin-left: 10px;
}

.upt-info {
    width: auto;
    display: grid;
    grid-template-columns: auto 100%;
    grid-template-rows: auto auto auto auto;
    align-items: center;
    column-gap: 15px;
    row-gap: 10px;
    overflow: hidden;
}

.upt-info.active {
    height: auto;
}

.icon {
    margin-left: auto;
    position: absolute;
    right: 0px;
    padding: 5px;
    border-radius: 50%;
}

.icon:hover {
    margin-top: 3px;
    cursor: pointer;
    background-color: #0b79bd45;
}

.icon:hover .upitnik {
    background-color: #0b79bd30;
}

.list-enter-active,
.list-leave-active {
    transition: transform 0.5s, opacity 0.5s;
}

.list-enter-from,
.list-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
</style>
