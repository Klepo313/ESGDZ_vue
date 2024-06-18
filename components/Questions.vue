<template>
    <div>
        <span v-if="!questions || questions.length === 0" class="info_empty">
            <font-awesome-icon icon="circle-info" size="sm" />
            Odaberi grupu za prikaz pitanja
        </span>

        <ol v-else>
            <div class="question_div" v-for="question in questions" :key="question.ept_id">
                <li>
                    {{ question.ept_pitanje }} 
                    <span v-if="question.ept_jedmjer && question.ept_jedmjer !== 'null'">
                        [{{ question.ept_jedmjer }}]
                    </span>
                </li>
                <div class="input_div">

                    <!-- TEKSTUALNI unos -->
                    <input 
                        v-if="question.ept_vrstaodg == 'TEKST'" 
                        type="text" 
                        placeholder="Unesi tekst"
                        :value="getAnswer(question.ept_id, 'eou_tekst')"
                        @blur="handleBlur(getAnswer(question.ept_id, 'eou_id'), $event.target.value)"
                        >

                    <!-- NUMERIČKI unos -->
                    <input 
                        v-else-if="question.ept_vrstaodg == 'BROJ'" 
                        type="number" 
                        placeholder="Unesi broj"
                        :value="getAnswer(question.ept_id, 'eou_broj')"
                        @blur="handleBlur(getAnswer(question.ept_id, 'eou_id'), $event.target.value)"
                        >
                    
                    <!-- ODABERI OPCIJU unos -->
                    <select v-else-if="question.ept_vrstaodg == 'IZBOR'" 
                        name="select_option" 
                        id="select_option" 
                        :value="getAnswer(question.ept_id, 'eou_eso_id') || 'default'"
                        @change="handleSelectChange(question.ept_id, $event.target.value)"
                    >
                        <option value="default" class="select_placeholder" selected disabled>-- Odaberi opciju --</option>
                        <option v-for="answer in question.possibleAnswers" :key="answer.eso_id" :value="answer.eso_id" >
                            {{ answer.eso_odgovor }}
                        </option>
                    </select>

                    <!-- ODABERI VIŠESTRUKE OPCIJE unos -->
                    <form v-else-if="question.ept_vrstaodg == 'IZBORVIS'" action="">
                        <label class="checkbox_button" v-for="answer in question.possibleAnswers" :key="answer.eso_id">
                            <input 
                                class="checkbox_icon" 
                                type="checkbox" 
                                :id="answer.eso_id" 
                                :name="answer.eso_odgovor"
                                @change="handleCheckboxChange(question.ept_id, answer.eso_id, $event)"
                                :checked="isChecked(question.ept_id, answer.eso_id)"
                            >
                            <label :for="answer.eso_id">{{ answer.eso_odgovor }}</label>
                        </label>
                    </form>

                    <!-- DA/NE unos -->
                    <form v-else-if="question.ept_vrstaodg == 'DN'" action="">
                        <div class="radio_button">
                            <input type="radio" :id="question.ept_id" name="answer" 
                                :value="'Da'" 
                                :checked="getAnswer(question.ept_id, 'eou_tekst') === 'Da'" 
                                @change="handleRadioChange(question.ept_id, 'Da')"
                            >
                            <label :for="question.ept_id">Da</label>
                        </div>
                        <div class="radio_button">
                            <input type="radio" :id="question.ept_id+1" name="answer" 
                                :value="'Ne'" 
                                :checked="getAnswer(question.ept_id, 'eou_tekst') === 'Ne'" 
                                @change="handleRadioChange(question.ept_id, 'Ne')"
                            >
                            <label :for="question.ept_id+1">Ne</label>
                        </div>
                    </form>

                    <font-awesome-icon v-if="question.ept_opis" class="info_icon" icon="circle-info" 
                        @click="toggleInfo(question)" />
                </div>
                <div>
                    <Transition name="fade" mode="out-in">
                        <div v-show="visibleInfo === parseInt(question.ept_id)" class="info_div">
                        <div class="info_header">
                            <div class="info_header_headings">
                                <font-awesome-icon class="info_icon" icon="circle-info" />
                                <h4>Opis</h4>
                            </div>
                            <font-awesome-icon @click="toggleInfo(question)" class="close_icon" icon="close" size="lg" />
                        </div>
                        <p class="info_text">
                            {{ question.ept_opis }}
                        </p>
                    </div>
                    </Transition>
                </div>
            </div>
        </ol>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { getQuestionsForGroup, getAnswersForUpitnik, setValueForAnswer } from '~/services/services';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';
import { useUserInfoStore } from '~/stores/userInfoStore';

const props = defineProps({
    selectedGroupId: Number,
});

const upitnikInfoStore = useUpitnikInfoStore();
const userInfoStore = useUserInfoStore();

const router = useRouter();

const p_ezu_id = computed(() => {
    const id = upitnikInfoStore.ezu_id
    return isNaN(id) ? 0 : parseInt(id);
});

const ezu_id = computed(() => {
    const id = upitnikInfoStore.getEzuId;
    return isNaN(id) ? 0 : parseInt(id);
});

const questions = ref([]);
const answers = ref(null);
const visibleInfo = ref(0); 
const selectedCheckboxes = ref(null);

// Funkcija za dobivanje ID-a grupe iz hasha URL-a
const getGroupIdFromHash = () => {
    const hash = router.currentRoute.value.hash;
    if (!hash || hash === '#') return null;
    return parseInt(hash.slice(1)); // Ukloni '#' i pretvori u broj
};

// Pratimo promjene u hashu
watch(() => router.currentRoute.value.hash, async (newHash, oldHash) => {
    const groupId = getGroupIdFromHash();
    if (groupId === null) {
        // Ako je hash prazan ili samo '#', isprazni pitanja
        questions.value = [];
    } else {
        // Ako postoji ID grupe u hashu, postavi pitanja za tu grupu
        try {
            const data = await getQuestionsForGroup(upitnikInfoStore.ezu_id, groupId);
            questions.value = data;
        } catch (error) {
            console.error(error);
        }
    }
});

const toggleInfo = (question) => {
    if (visibleInfo.value === parseInt(question.ept_id)) { // Ako je već vidljiv, sakrij ga
        visibleInfo.value = 0;
    } else { // Ako nije, prikaži ga
        visibleInfo.value = parseInt(question.ept_id);
    }
};

const fetchQuestions = async () => {
    if (props.selectedGroupId) {
        try {
            const data = await getQuestionsForGroup(upitnikInfoStore.ezu_id, props.selectedGroupId);
            questions.value = data;
        } catch (error) {
            console.error(error);
        }
    }
};

const fetchAnswers = async () => {
    try {
        const fetchedAnswers = await getAnswersForUpitnik(ezu_id.value);
        answers.value = fetchedAnswers;
        initializeSelectedCheckboxes();
    } catch (error) {
        throw error;
    }
};

const getAnswer = (questionId, field) => {
    const answer = answers.value.find(answer => answer.eou_ept_id === questionId);
    return answer ? answer[field] : '';
};

const handleBlur = async (eou_id, value) => {
    const userId = parseInt(userInfoStore.eko_id);
    console.log(parseInt(eou_id), value, userId)
    try {
        await setValueForAnswer(parseInt(eou_id), value, userId);
        await fetchAnswers();
    } catch (error) {
        console.error('Error saving answer:', error);
    }
};

const handleSelectChange = async (questionId, selectedValue) => {
    const answer = answers.value.find(ans => ans.eou_ept_id === questionId);
    console.log(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
    if (answer) {
        try {
            await setValueForAnswer(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
            await fetchAnswers();
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    } else {
        console.error('Answer not found for questionId:', questionId);
    }
};

const handleRadioChange = async (questionId, selectedValue) => {
    const answer = answers.value.find(ans => ans.eou_ept_id === questionId);
    console.log(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
    if (answer) {
        try {
            await setValueForAnswer(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
            await fetchAnswers();
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    } else {
        console.error('Answer not found for questionId:', questionId);
    }
};

const handleCheckboxChange = async (questionId, answerId, event) => {
    // Pretvaramo questionId i answerId u brojčane vrijednosti
    // questionId = parseInt(questionId);
    // answerId = parseInt(answerId);
    console.log(selectedCheckboxes.value[questionId])
    const checkbox = document.getElementById(answerId);
    const isChecked = checkbox.checked;

    // Prvo provjerimo postoje li već odabrani ID-evi za ovaj pitanje
    if (!selectedCheckboxes.value[questionId]) {
        selectedCheckboxes.value[questionId] = [];
    }

    if (isChecked) {
        console.log("Kliknut")
        // Ako je checkbox označen, dodajemo ID u listu odabranih
        if (!selectedCheckboxes.value[questionId].includes(answerId)) {
            selectedCheckboxes.value[questionId].push(answerId);
        }
    } else {
        console.log("Nije kliknut")
        // Ako je checkbox odznačen, uklanjamo ID iz liste odabranih
        console.log("PRIJE; selectedCheckboxes.value[questionId]: ", selectedCheckboxes.value[questionId])

        /* 
        const index = array.indexOf(5);
        if (index > -1) { // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
        */

        const index = selectedCheckboxes.value[questionId].indexOf(parseInt(answerId));
        console.log("Index od " + parseInt(answerId) + " je: " + index);
        if(index > -1){
            selectedCheckboxes.value[questionId].splice(index, 1);
        }

        //selectedCheckboxes.value[questionId] = selectedCheckboxes.value[questionId].filter(id => id !== answerId);

        console.log("POSLIJE; selectedCheckboxes.value[questionId]: ", selectedCheckboxes.value[questionId])
    }

    // Formiramo novi string koji sadrži sve odabrane ID-eve odvojene ;
    const selectedValue = selectedCheckboxes.value[questionId].join(';');

    // Pronalazimo odgovor za trenutno pitanje
    const answer = answers.value.find(ans => ans.eou_ept_id === questionId);

    if (answer) {
        console.log(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
        try {
            // Spremamo novu vrijednost u bazu
            await setValueForAnswer(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
            // Ovdje možete ažurirati lokalno stanje ako je potrebno
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    } else {
        console.error('Answer not found for questionId:', questionId);
    }
};


const initializeSelectedCheckboxes = () => {
    selectedCheckboxes.value = {}; // Resetiramo objekt prije inicijalizacije

    answers.value.forEach(answer => {
        if (answer.eou_ept_id && answer.eou_izborvis) {
            const selectedIds = answer.eou_izborvis.split(';').map(id => parseInt(id));
            selectedCheckboxes.value[answer.eou_ept_id] = selectedIds;
        }
    });
};

const isChecked = (questionId, answerId) => {
    //console.log("Kliknut?: ", selectedCheckboxes.value[questionId].includes(parseInt(answerId)))
    if (selectedCheckboxes.value[questionId]) {
        return selectedCheckboxes.value[questionId].includes(parseInt(answerId));
    }
    return false;
};

watch(() => props.selectedGroupId, () => {
    fetchQuestions();
});

onMounted(async () => {
    upitnikInfoStore.initializeStore();
    await fetchQuestions();
    await fetchAnswers();
});
</script>

<style scoped>

.arrow-left{
    transform: rotate(90deg);
}
.arrow-right{
    transform: rotate(-90deg);
}
.bottom-div{
    position: absolute;
    right: 0;
    bottom: 0;
    margin-top: 40px;
}

/* Definirajte animaciju za `Transition` */
.fade-enter-active,
.fade-leave-active {
  transition: all 100ms ease-in-out;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active prije Vue 3 */ {
  opacity: 0; /* Početno stanje animacije */
}

.question_div{
    margin-top: 20px;
    max-width: 80%;
    text-align: justify;
}
ol {
    list-style-type: decimal;
    padding-left: 0;  
    margin-left: 0;   
}
li {
    font-weight: 600;
    list-style-position: inside;
}
ol li::marker{
    color: var(--primary-color);
    font-size: 16px;
    font-weight: bold;
}
input[type="radio"]{
    width: auto;
}
.input_div{
    margin-top: 10px;

    display: flex;
    align-items: center;
    gap: 18px;
}
.input_div > form {
    width: auto;

    display: flex;
    flex-direction: column;
    gap: 5px;
    text-wrap: wrap;
}
.radio_button > label{
    margin-left: 6px;
}
.checkbox_button{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 6px;
}
.checkbox_icon{
    width: auto;
}
.info_icon{
    opacity: 0.6;
}
.info_icon:hover, .close_icon:hover{
    opacity: 1;
    cursor: pointer;
    transform: scale(1.05);
}
.info_div{
    z-index: 20;
    margin-top: 10px;
    max-width: 460px;
    padding: 16px;
    background-color: #E7F2F9;
    border-radius: 5px;
    border: 0.5px solid rgba(11, 121, 189, 0.500);
    /* border: 0.5px solid var(--primary-color); */
}
.info_header, .info_header_headings{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.info_header_headings{
    gap: 6px;
}
.info_header_headings > img {
    width: 16px;
}
h4{
    font-size: 14px;
    font-weight: 600;
}
.info_text{
    margin-top: 10px;
    font-size: 14px;
    text-align: justify;
}
.close_icon{
    opacity: 0.6;
}
</style>
