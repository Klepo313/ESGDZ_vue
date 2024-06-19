<template>
    <div class="pop-up" v-if="isPopupVisible">
        <div class="pop-up-container">
            <div class="pp-heading">
                <font-awesome-icon class="pp-icon-file" icon="file-circle-plus" size="lg" />
                Novi upitnik
                <font-awesome-icon @click="togglePopup" class="pp-icon-close" icon="close" size="lg" />
            </div>
            <form class="pp-content">
                <h4>Vrsta upitnika</h4>
                <select name="select_option" id="select_option" required v-model="selectedEvuSif" @change="handleChange">
                    <option value="" disabled>-- Odaberi opciju --</option>
                    <option v-for="upitnik in vrsteUpitnika" :value="upitnik.evu_sif" :key="upitnik.ess_id">
                        {{ upitnik.evu_naziv }}
                    </option>
                </select>
                <!-- <font-awesome-icon icon="chevron-down" class="select-icon" size="lg" /> -->
                <!-- Update your button to call the new async method -->
                <button type="submit" id="createBtn" @click.prevent="handleButtonClick">Kreiraj upitnik</button>
            </form >
        </div>
    </div>

    <div class="pop-up" v-if="isFinishPopupVisible">
        <div class="pop-up-container">
            <div class="pp-heading">
                <font-awesome-icon class="info_icon" icon="circle-info" size="lg"/>
                Ovom radnjom upitnik će biti zaključan i neće biti moguće dalje uređivanje.
                <span class="secQuestion">Želite li nastaviti dalje?</span>
                <font-awesome-icon @click="toggleFinishPopup" class="pp-icon-close" icon="close" size="lg" />
            </div>
            <form class="pp-content" style="gap: 5px;">
                <button class="cancelBtn" type="button" @click="toggleFinishPopup">Odustani</button>
                <button class="finishBtn" id="finishUpitnikBtn" type="button" @click.prevent="lockUpitnik"> <!--@click.prevent=""-->
                    <font-awesome-icon class="nav-icon" icon="clipboard-check" size="lg"/>
                    Zaključaj upitnik
                </button>
            </form >
        </div>
    </div>
    
    <header>
        <div class="hello-div">
            <div class="dec-div" />
            <span class="greeting_text">
                {{ greetingText }} <span class="greeting_name">{{ korKorime }}</span> 
            </span>
        </div>
        <div class="buttons">
            <button v-if="isDashboardRoute" class="activeButton" @click="toggleFinishPopup">
                <font-awesome-icon class="nav-icon" icon="clipboard-check" size="lg"/>
                Zaključaj upitnik
            </button>
            <button v-if="isUpitnikRoute" @click="togglePopup(); fetchVrsteUpitnika();" class="activeButton">
                <font-awesome-icon class="nav-icon" icon="file-circle-plus" size="lg" />
                Novi upitnik
            </button>
            <button @click="logout" class="logout_btn">
                <font-awesome-icon class="nav-icon" icon="arrow-right-from-bracket" size="lg" />
                Odjava
            </button>
            <loading v-if="isLogedOut" />
        </div>
    </header>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '#imports';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';
// import { useUpitnikInfoStore } from '#imports';
import { getVrsteUpitnika, createNewUpitnik } from '~/services/services';

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const upitnikInfoStore = useUpitnikInfoStore();
// const upitnikInfoStore = useUpitnikInfoStore();

const vrsteUpitnika = ref([]);
const selectedEvuSif = ref('');

const props = defineProps({
    tvkId: Number,
    korId: Number,
    korKorime: String,
    upitnici: Object
});

var isLogedOut = ref(0);

// Funkcija za dohvat trenutnog pozdrava
const getGreetingText = () => {
    const now = new Date();
    const hours = now.getHours();
    const month = now.getMonth() + 1;
    const isSummer = month >= 5 && month <= 8; // Ljeto: lipanj (5) do rujan (8)

    if (hours < 12) {
        return 'Dobro jutro, ';
    } else if (hours >= 12 && (hours < 16 || (isSummer && hours < 20))) {
        return 'Dobar dan, ';
    } else {
        return 'Dobra večer, ';
    }
};
// Reaktivno svojstvo za pozdrav
const greetingText = computed(() => getGreetingText());

// Je li '/upitnik'
const isUpitnikRoute = computed(() => route.path === '/upitnik');

const isDashboardRoute = computed(() => route.path === '/');

// Reactive property to control popup visibility
const isPopupVisible = ref(false);
const isFinishPopupVisible = ref(false);
let pop_up = null;

const togglePopup = () => {
  isPopupVisible.value = !isPopupVisible.value;
};

const toggleFinishPopup = () => {
    isFinishPopupVisible.value =!isFinishPopupVisible.value;
};

const lockUpitnik = () => {
    upitnikInfoStore.finished = true;
    isFinishPopupVisible.value =!isFinishPopupVisible.value;
}

watch(isPopupVisible, (newValue) => {
    if (newValue) {
        pop_up = document.querySelector('.pop-up');
    } else {
        pop_up = null;
    }
});

const logout = async () => {
    isLogedOut.value = 1;
    userInfoStore.clearUserInfo();
    await router.push('/login');
}

const fetchVrsteUpitnika = async () => {
    try {
        const data = await getVrsteUpitnika();
        vrsteUpitnika.value = data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja vrste upitnika:', error);
    }
}

function handleChange(event) {
    console.log('Odabrana vrijednost:', event.target.value);
}

const createUpitnik = async () => {
    try {
        await createNewUpitnik(parseInt(props.korId), selectedEvuSif.value)
    } catch (error) {
        throw error;
    }
}

const handleButtonClick = async () => {
    try {
        togglePopup();
        await createUpitnik();  // Ensure createUpitnik completes before refreshing
        window.location.reload();  // Refresh the page
    } catch (error) {
        console.error('Error creating upitnik:', error);
    }
};

</script>

<style scoped>
input{
    outline: none;
    border: none;
    width: 0;
}
header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    height: 100%;
}
.hello-div{
    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 25px;
    font-weight: 300;
}
.dec-div{
    height: 10px;
    width: 10px;
    margin-right: 20px;
    background-color: #0b79bd30;
}
.buttons{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
    height: 100%;
}
.buttons > button {
    font-size: 14px;
    padding: 0px 30px;
    height: 100%;
    border-radius: 5px;
}
.activeButton{
    font-weight: 600;
    color: white;
    background-color: var(--primary-color);
    cursor: pointer;
}
.pp-icon-close:hover{
    cursor: pointer;
    transform: scale(1.1);
}
.activeButton:hover{
    background-color: var(--primary_hovered);
}
.activeButton:active{
    background-color: var(--primary_clicked);
}
.logout_btn{
    color: var(--light-black);
    background-color: white;
    cursor: pointer;
}
.logout_btn:hover{
    background-color: rgba(111, 111, 111, 0.074);
}
.logout_btn:active{
    background-color: rgba(111, 111, 111, 0.166);
}
.nav-icon{
    margin-right: 10px;
}
.greeting_name{
    font-weight: bold;
}
.pop-up{
    width: 100%;
    height: 100dvh;
    scroll-behavior: none;
    z-index: 99;

    background-color: #00000080;

    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.pop-up-container{
    padding: 20px;
    background-color: white;
    font-weight: 14px;
    width: 460px;
    border-radius: 5px;
    
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
}
.pp-heading{
    width: 100%;
    font-weight: 400;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}
.pp-icon-close{
    margin-left: auto; /* Gura ikonicu na desnu stranu */
    position: absolute;

    right: 0px;
}
.pp-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}
.secQuestion{
    /* color: var(--primary-color); */
    font-weight: bold;
}
.select-icon{
    position: absolute;
    top: 50%;
    margin-left: auto;
}
#createBtn{
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    color: white;
    padding: 12px 0px;
    border-radius: 5px;
    background-color: var(--primary-color);
}
#createBtn:hover, .finishBtn:hover{
    cursor: pointer;
    background-color: var(--primary_hovered);
}
#createBtn:active, .finishBtn:active{
    background-color: var(--primary_clicked);
}
.v-select{
    width: 100%;
}
.v-select-menu {
    max-height: 200px; /* Adjust the max-height */
    overflow-y: auto; /* Enable vertical scroll */
    z-index: 9999; /* Ensure dropdown appears above other elements */
}
.cancelBtn, .finishBtn{
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    color: white;
    padding: 12px 0px;
    border-radius: 5px;
}
.finishBtn{
    background-color: var(--primary-color);
}
.cancelBtn{
    width: auto;
    outline: none;
    background: none;
    padding: 12px;
    color: black;
    font-weight: 400;
}
.cancelBtn:hover{
    text-decoration: underline;
    cursor: pointer;
}

/* Media Queries for responsiveness */
@media (max-width: 1024px) {
    .hello-div {
        font-size: 20px;
    }
    .buttons > button {
        padding: 0px 20px;
    }
    .pp-heading {
        font-size: 14px;
    }
    .pp-content h4 {
        font-size: 16px;
    }
    .pp-content select {
        font-size: 14px;
    }
    #createBtn {
        padding: 10px 0px;
    }
    .pop-up-container {
        width: 400px;
        padding: 15px;
    }
}

@media (max-width: 768px) {
    .hello-div {
        font-size: 18px;
    }
    .buttons > button {
        padding: 0px 15px;
    }
    .pp-heading {
        font-size: 12px;
    }
    .pp-content h4 {
        font-size: 14px;
    }
    .pp-content select {
        font-size: 12px;
    }
    #createBtn {
        padding: 8px 0px;
    }
    .pop-up-container {
        width: 360px;
        padding: 10px;
    }
}

</style>