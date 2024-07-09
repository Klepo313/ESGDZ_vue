<template>
    <div>
        <span v-if="!questions || questions.length === 0" class="info_empty">
            <font-awesome-icon icon="circle-info" size="sm" />
            Odaberi grupu za prikaz pitanja ili odaberi opciju na formi da pitanja budu prikazana
        </span>

        <ol v-else>
            <div class="question_div" v-for="question in questions" :key="question.ept_id">
                <li>
                    <span v-if="question.ept_obvezan == 'D'">
                        *
                    </span>
                    <span>
                        {{ question.ept_pitanje }}
                    </span>
                    <span v-if="question.ept_jedmjer && question.ept_jedmjer !== 'null'">
                        [{{ question.ept_jedmjer }}]
                    </span>
                    <span v-if="question.ept_obvezan == 'D'" class="obavezno_text">
                        (Obavezno)
                    </span>
                </li>
                <div class="input_div">
                    <!-- TEKSTUALNI unos -->
                    <!-- <input v-if="question.ept_vrstaodg == 'TEKST'" type="text" placeholder="Unesi tekst"
                        :value="computedAnswer(question.ept_id, 'eou_tekst')"
                        @blur="handleBlur(getAnswer(question.ept_id, 'eou_id'), question.ept_id, $event.target.value)"
                        :class="{ 'border-red': isInvalid(question.ept_id) }" :disabled="status.value === 1"> -->

                    <!-- NUMERIČKI unos -->
                    <!-- <input v-else-if="question.ept_vrstaodg == 'BROJ'" type="number" placeholder="Unesi broj"
                        :value="computedAnswer(question.ept_id, 'eou_broj')"
                        @blur="handleBlur(getAnswer(question.ept_id, 'eou_id'), question.ept_id, $event.target.value)"
                        :class="{ 'border-red': isInvalid(question.ept_id) }" :disabled="status.value === 1"> -->

                    <!-- TEKSTUALNI unos -->
                    <input v-if="question.ept_vrstaodg == 'TEKST'" type="text" placeholder="Unesi tekst"
                        v-on:keyup="adjustFontSize($event.target)" :value="getAnswer(question.ept_id, 'eou_tekst')"
                        @blur="handleBlur(getAnswer(question.ept_id, 'eou_id'), $event.target.value, $event.target)"
                        :class="{ 'border-red': question.isInvalid }" :disabled="status === 1">

                    <!-- NUMERIČKI unos -->
                    <input v-else-if="question.ept_vrstaodg == 'BROJ'" type="number" placeholder="Unesi broj"
                        v-on:keyup="adjustFontSize($event.target)" :value="getAnswer(question.ept_id, 'eou_broj')"
                        @blur="handleBlur(getAnswer(question.ept_id, 'eou_id'), $event.target.value, $event.target)"
                        :class="{ 'border-red': question.isInvalid }" :disabled="status === 1">

                    <!-- ODABERI OPCIJU unos -->
                    <select v-else-if="question.ept_vrstaodg == 'IZBOR'" name="select_option" id="select_option"
                        :value="getAnswer(question.ept_id, 'eou_eso_id') || 'default'"
                        @change="handleSelectChange(question.ept_id, $event.target.value, $event.target)"
                        :disabled="status === 1">
                        <option value="default" class="select_placeholder" selected disabled>-- Odaberi opciju --
                        </option>
                        <option v-for="answer in question.possibleAnswers" :key="answer.eso_id" :value="answer.eso_id">
                            {{ answer.eso_odgovor }}
                        </option>
                    </select>
                    <!-- ODABERI VIŠESTRUKE OPCIJE unos -->
                    <form v-else-if="question.ept_vrstaodg == 'IZBORVIS'" action="">
                        <label class="checkbox_button" v-for="answer in question.possibleAnswers" :key="answer.eso_id">
                            <input class="checkbox_icon" type="checkbox" :id="answer.eso_id" :name="answer.eso_odgovor"
                                @change="handleCheckboxChange(question.ept_id, answer.eso_id, $event, $event.target)"
                                :checked="isChecked(question.ept_id, answer.eso_id)" :disabled="status === 1">
                            <label :for="answer.eso_id">{{ answer.eso_odgovor }}</label>
                        </label>
                    </form>

                    <!-- DA/NE unos -->
                    <form v-else-if="question.ept_vrstaodg == 'DN'" action="">
                        <div class="radio_button">
                            <input type="radio" :id="question.ept_id" name="answer" :value="'Da'"
                                :checked="getAnswer(question.ept_id, 'eou_tekst') === 'Da'"
                                @change="handleRadioChange(question.ept_id, 'Da', $event.target)"
                                :disabled="status === 1">
                            <label :for="question.ept_id">Da</label>
                        </div>
                        <div class="radio_button">
                            <input type="radio" :id="question.ept_id + 1" name="answer" :value="'Ne'"
                                :checked="getAnswer(question.ept_id, 'eou_tekst') === 'Ne'"
                                @change="handleRadioChange(question.ept_id, 'Ne', $event.target)"
                                :disabled="status === 1">
                            <label :for="question.ept_id + 1">Ne</label>
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
                                <font-awesome-icon @click="toggleInfo(question)" class="close_icon" icon="close"
                                    size="lg" />
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
import { getQuestionsForGroup, getAnswersForUpitnik, setValueForAnswer, checkIfAnswerIsAnswered, getStatusUpitnika } from '~/services/services';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';
import { useUserInfoStore } from '~/stores/userInfoStore';

const props = defineProps({
    selectedGroupId: Number,
});

const upitnikInfoStore = useUpitnikInfoStore();
const userInfoStore = useUserInfoStore();

const router = useRouter();

const p_ezu_id = computed(() => {
    const id = upitnikInfoStore.ezu_id;
    return isNaN(id) ? 0 : parseInt(id);
});

const ezu_id = computed(() => {
    const id = upitnikInfoStore.getEzuId;
    return isNaN(id) ? 0 : parseInt(id);
});

const status = ref(null);
const finishedUpitnik = async () => {
    const result = await getStatusUpitnika(ezu_id.value);
    status.value = parseInt(result[0].ezu_status);
    console.log("status: ", status.value);
};


const questions = ref([]);
const answers = ref(null);
const temporaryAnswers = ref({});
const visibleInfo = ref(0);
const selectedCheckboxes = ref({});
const inputWidths = ref({});

const emit = defineEmits(['update-selected-options']);

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
            console.log("Podaci: ", upitnikInfoStore.ezu_id, groupId);
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
    } catch (error) {
        throw error;
    }
};

const getAnswer = (questionId, field) => {
    const answer = answers.value.find(answer => answer.eou_ept_id === questionId);
    return answer ? answer[field] : '';
};

const handleBlur = async (eou_id, value, inputElement) => {
    const userId = parseInt(userInfoStore.eko_id);
    try {
        await setValueForAnswer(parseInt(eou_id), value, userId);
        await fetchQuestions();

        let isAnswered = await checkIfAnswerIsAnswered(eou_id);
        console.log(isAnswered)
        if (isAnswered[0].u_redu == 0) {
            inputElement.classList.add('border-red');
        } else {
            inputElement.classList.remove('border-red');
        }

        await fetchAnswers();
        await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
        await upitnikInfoStore.fetchTotalAnsweredQuestions();
    } catch (error) {
        console.error('Error saving answer:', error);
    }
};

// const computedAnswer = (questionId, field) => {
//     return temporaryAnswers.value[questionId] !== undefined
//         ? temporaryAnswers.value[questionId].value
//         : getAnswer(questionId, field);
// };

// const isInvalid = (questionId) => {
//     return temporaryAnswers.value[questionId]?.isInvalid || false;
// };

// const handleBlur = async (eou_id, questionId, value) => {
//     const userId = parseInt(userInfoStore.eko_id);
//     try {
//         temporaryAnswers.value[questionId] = { value, isInvalid: false };
//         await setValueForAnswer(parseInt(eou_id), value, userId);

//         let isAnswered = await checkIfAnswerIsAnswered(eou_id);
//         console.log(isAnswered);

//         if (isAnswered[0].u_redu == 0) {
//             temporaryAnswers.value[questionId].isInvalid = true;
//         } else {
//             temporaryAnswers.value[questionId].isInvalid = false;
//         }

//         await fetchAnswers();
//         answers.value = await fetchAnswers();
//         await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
//         await upitnikInfoStore.fetchTotalAnsweredQuestions();
//     } catch (error) {
//         console.error('Error saving answer:', error);
//     }
// };

const handleSelectChange = async (questionId, selectedValue, inputElement) => {
    const answer = answers.value.find(ans => ans.eou_ept_id === questionId);
    if (answer) {
        try {
            await setValueForAnswer(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
            await fetchQuestions();

            let isAnswered = await checkIfAnswerIsAnswered(parseInt(answer.eou_id));
            console.log(isAnswered)
            if (isAnswered[0].u_redu == 0) {
                inputElement.classList.add('border-red');
            } else {
                inputElement.classList.remove('border-red');
            }

            await fetchAnswers();
            await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
            await upitnikInfoStore.fetchTotalAnsweredQuestions();
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    } else {
        console.error('Answer not found for questionId:', questionId);
    }
};

const handleRadioChange = async (questionId, selectedValue, inputElement) => {
    const answer = answers.value.find(ans => ans.eou_ept_id === questionId);
    if (answer) {
        try {
            await setValueForAnswer(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
            await fetchQuestions();

            let isAnswered = await checkIfAnswerIsAnswered(parseInt(answer.eou_id));
            console.log(isAnswered)
            if (isAnswered[0].u_redu == 0) {
                inputElement.classList.add('border-red');
            } else {
                inputElement.classList.remove('border-red');
            }

            await fetchAnswers();
            await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
            await upitnikInfoStore.fetchTotalAnsweredQuestions();
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    } else {
        console.error('Answer not found for questionId:', questionId);
    }
};

const handleCheckboxChange = async (questionId, answerId, event, inputElement) => {
    const checkbox = document.getElementById(answerId);
    const isChecked = checkbox.checked;

    if (!selectedCheckboxes.value[questionId]) {
        selectedCheckboxes.value[questionId] = [];
    }

    if (isChecked) {
        if (!selectedCheckboxes.value[questionId].includes(answerId)) {
            selectedCheckboxes.value[questionId].push(answerId);
        }
    } else {
        const index = selectedCheckboxes.value[questionId].indexOf(parseInt(answerId));
        if (index > -1) {
            selectedCheckboxes.value[questionId].splice(index, 1);
        }
    }

    const selectedValue = selectedCheckboxes.value[questionId].length > 0
        ? selectedCheckboxes.value[questionId].join(';')
        : null;

    const answer = answers.value.find(ans => ans.eou_ept_id === questionId);

    if (answer) {
        try {
            await setValueForAnswer(parseInt(answer.eou_id), selectedValue, parseInt(userInfoStore.eko_id));
            await fetchQuestions();

            let isAnswered = await checkIfAnswerIsAnswered(parseInt(answer.eou_id));
            console.log(isAnswered)
            if (isAnswered[0].u_redu == 0) {
                inputElement.classList.add('border-red');
            } else {
                inputElement.classList.remove('border-red');
            }

            emit('update-selected-options', selectedCheckboxes.value);
            await fetchAnswers();
            await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
            await upitnikInfoStore.fetchTotalAnsweredQuestions();
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    } else {
        console.error('Answer not found for questionId:', questionId);
    }
};

const initializeSelectedCheckboxes = () => {
    selectedCheckboxes.value = {};

    answers.value.forEach(answer => {
        if (answer.eou_ept_id && answer.eou_izborvis) {
            const selectedIds = answer.eou_izborvis.split(';').map(id => parseInt(id));
            selectedCheckboxes.value[answer.eou_ept_id] = selectedIds;
        }
    });
    // console.log("selectedCheckboxes prije emita: ", selectedCheckboxes.value);
    emit('update-selected-options', selectedCheckboxes.value);
};

const isChecked = (questionId, answerId) => {
    if (selectedCheckboxes.value[questionId]) {
        return selectedCheckboxes.value[questionId].includes(parseInt(answerId));
    }
    return false;
};

// Funkcija za prilagođavanje veličine fonta inputa/selecta
const adjustFontSize = (element) => {
    const maxFontSize = 14;
    const minFontSize = 10;
    const charLimit = 50; // Broj karaktera pri kojem se veličina fonta počinje smanjivati

    let newSize = maxFontSize;

    if (element.value.length > charLimit) {
        newSize = maxFontSize - (element.value.length - charLimit);
        newSize = newSize < minFontSize ? minFontSize : newSize;
    }

    element.style.fontSize = newSize + "px";
};

watch(() => props.selectedGroupId, async () => {
    await fetchQuestions();
    await fetchAnswers();
    initializeSelectedCheckboxes();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

onMounted(async () => {
    upitnikInfoStore.initializeStore();
    finishedUpitnik();
    await fetchQuestions();
    await fetchAnswers();
});
</script>


<style scoped>
.arrow-left {
    transform: rotate(90deg);
}

.arrow-right {
    transform: rotate(-90deg);
}

.bottom-div {
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
.fade-leave-to

/* .fade-leave-active prije Vue 3 */
    {
    opacity: 0;
    /* Početno stanje animacije */
}

.question_div {
    margin-top: 20px;
    max-width: 100%;
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

ol li::marker {
    color: var(--primary-color);
    font-size: 16px;
    font-weight: bold;
}

input[type="text"],
input[type="number"],
select {
    height: 40.8px !important;
    font-size: 14px;
    text-overflow: ellipsis;
}

input[type="radio"] {
    width: auto;
}

.input_div {
    margin-top: 10px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 18px;
}

.input_div>form {
    width: auto;

    display: flex;
    flex-direction: column;
    gap: 5px;
    text-wrap: wrap;
}

.radio_button>label {
    margin-left: 6px;
}

.checkbox_button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 6px;
}

.checkbox_icon {
    width: auto;
}

.obavezno_text {
    color: red;
}

.info_icon {
    opacity: 0.6;
}

.info_icon:hover,
.close_icon:hover {
    opacity: 1;
    cursor: pointer;
    transform: scale(1.05);
}

.info_div {
    z-index: 20;
    margin-top: 10px;
    max-width: 460px;
    padding: 16px;
    background-color: #E7F2F9;
    border-radius: 5px;
    border: 0.5px solid rgba(11, 121, 189, 0.500);
    /* border: 0.5px solid var(--primary-color); */
}

.info_header,
.info_header_headings {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info_header_headings {
    gap: 6px;
}

.info_header_headings>img {
    width: 16px;
}

h4 {
    font-size: 14px;
    font-weight: 600;
}

.info_text {
    margin-top: 10px;
    font-size: 14px;
    text-align: justify;
}

.close_icon {
    opacity: 0.6;
}

.border-red {
    border: 2px solid red;
}
</style>
