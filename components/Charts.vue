<!-- * OVAJ RADI -->
<template>
    <div>
        <div class="charts-div">
            <div class="heading">
                <font-awesome-icon icon="chart-pie" />
                <span>Dijagrami</span>
                <font-awesome-icon @click="refreshData" class="rotate-icon" icon="rotate-right" />
            </div>
            <div class="charts">
                <div class="chart">
                    <h4>Odgovoreno za <br> '{{ selectedGroupName }}'</h4>
                    <div class="diagram">
                        <Pie v-if="loadedGroup && selectedGroupId" id="groupChart" class="chart-diagram"
                            :options="pieChartOptions" :data="pieGroupChartData" ref="groupChartRef" />
                        <p v-else>
                            <font-awesome-icon icon="circle-info" size="sm" />
                            Odaberi grupu za prikaz dijagrama.
                        </p>
                    </div>
                </div>
                <div class="chart">
                    <h4>Ukupno odgovoreno</h4>
                    <div class="diagram">
                        <Pie v-if="loadedTotal" id="totalChart" class="chart-diagram" :options="pieChartOptions"
                            :data="pieChartData" ref="totalChartRef" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue';
import { getTotalAnsweredQuestions, getAnsweredQuestionsForGroup } from '~/services/services';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';

const upitnikInfoStore = useUpitnikInfoStore();

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
    selectedGroupId: Number,
    upitnikData: Object
});

let totalAnsweredQuestions = computed(() => upitnikInfoStore.totalAnsweredQuestions);
let groupAnsweredQuestions = computed(() => upitnikInfoStore.groupAnsweredQuestions);

const ezu_id = computed(() => {
    const id = upitnikInfoStore.getEzuId;
    return isNaN(id) ? 0 : parseInt(id);
});

// const totalAnsweredQuestions = ref({
//     uk_pitanja: 0,
//     uk_odgovoreno: 0
// });

// const groupAnsweredQuestions = ref({
//     uk_pitanja: 0,
//     uk_odgovoreno: 0
// });

const pieChartData = ref({
    labels: ['Odgovoreno', 'Nije odgovoreno'],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: ['#0B78BD', '#0b79bd66'],
            hoverBackgroundColor: ['#2693D9', '#0b79bd88']
        }
    ]
});

const pieGroupChartData = ref({
    labels: ['Odgovoreno', 'Nije odgovoreno'],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: ['#0B78BD', '#0b79bd66'],
            hoverBackgroundColor: ['#2693D9', '#0b79bd88']
            // backgroundColor: ['#231f20', '#231f2040'],
            // hoverBackgroundColor: ['#231f20e9', '#231f2060']
        }
    ]
});

const pieChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false // Omogućava prilagodbu omjera stranica
});

const loadedTotal = ref(false);
const loadedGroup = ref(false);
const selectedGroupName = ref('');

const groupChartRef = ref(null);
const totalChartRef = ref(null);

const findGroupById = (groups, id) => {
    if (!groups) return null; // Dodana provjera
    for (const group of groups) {
        if (parseInt(group.id) === id) {
            return group;
        }
        if (group.children && group.children.length > 0) {
            const found = findGroupById(group.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null; // Ako nije pronađen odgovarajući ID
};

const fetchTotalAnsweredQuestions = async () => {
    try {
        const data = await getTotalAnsweredQuestions(ezu_id.value);
        if (data.length > 0) {
            totalAnsweredQuestions.value.uk_pitanja = parseInt(data[0].uk_pitanja);
            totalAnsweredQuestions.value.uk_odgovoreno = parseInt(data[0].uk_odgovoreno);

            // Ažuriraj podatke za Pie chart
            pieChartData.value.datasets[0].data = [
                totalAnsweredQuestions.value.uk_odgovoreno,
                totalAnsweredQuestions.value.uk_pitanja - totalAnsweredQuestions.value.uk_odgovoreno
            ];

            // Označi kao učitano
            loadedTotal.value = true;

            // Ažuriraj grafikon
            //totalChartRef.value.chartInstance.update();
            if (totalChartRef.value) {
                console.log("Updating total chart...");
                totalChartRef.value.update();
            }
        }
    } catch (error) {
        console.error("Error fetching total answered questions:", error);
    }
};

// const updateTotalChart = () => {
//     console.log(totalAnsweredQuestions)
//     // Ažuriraj podatke za Pie chart
//     pieChartData.value.datasets[0].data = [
//         totalAnsweredQuestions.value.uk_odgovoreno,
//         totalAnsweredQuestions.value.uk_pitanja - totalAnsweredQuestions.value.uk_odgovoreno
//     ];

//     // Označi kao učitano
//     loadedTotal.value = true;
// }

// const updateGroupChart = () => {
//     console.log(groupAnsweredQuestions)
//     // Ažuriraj podatke za Pie chart
//     pieGroupChartData.value.datasets[0].data = [
//         groupAnsweredQuestions.value.uk_odgovoreno,
//         groupAnsweredQuestions.value.uk_pitanja - groupAnsweredQuestions.value.uk_odgovoreno
//     ];

//     // Označi kao učitano
//     loadedGroup.value = true;
// }

const fetchAnsweredQuestionsForGroup = async () => {
    if (props.selectedGroupId) {
        try {
            const data = await getAnsweredQuestionsForGroup(ezu_id.value, props.selectedGroupId);
            if (data.length > 0) {
                groupAnsweredQuestions.value.uk_pitanja = parseInt(data[0].uk_pitanja);
                groupAnsweredQuestions.value.uk_odgovoreno = parseInt(data[0].uk_odgovoreno);

                // Ažuriraj podatke za Pie chart
                pieGroupChartData.value.datasets[0].data = [
                    groupAnsweredQuestions.value.uk_odgovoreno,
                    groupAnsweredQuestions.value.uk_pitanja - groupAnsweredQuestions.value.uk_odgovoreno
                ];

                // Označi kao učitano
                loadedGroup.value = true;

                // Ažuriraj grafikon
                // groupChartRef.value.chartInstance.update();
                if (groupChartRef.value) {
                    console.log("Updating group chart...");
                    groupChartRef.value.update();
                }
            }
        } catch (error) {
            console.error("Error fetching answered questions for group:", error);
        }
    }
};

// watch(
//     totalAnsweredQuestions,
//     updateTotalChart,
//     { immediate: true }
// );

// watch(
//     groupAnsweredQuestions,
//     updateGroupChart,
//     { immediate: true }
// );

watch(
    () => props.selectedGroupId,
    async (newGroupId) => {
        const selectedGroup = findGroupById(props.upitnikData, newGroupId);
        selectedGroupName.value = selectedGroup ? selectedGroup.name : 'nepoznato';

        await fetchAnsweredQuestionsForGroup();
        await fetchTotalAnsweredQuestions();

        // updateTotalChart();
        // updateGroupChart();
    },
    { immediate: true }
);

const refreshData = async () => {
    loadedGroup.value = false;
    loadedTotal.value = false;
    await fetchAnsweredQuestionsForGroup();
    await fetchTotalAnsweredQuestions();
}

// Reaktivno dohvaćanje ukupnih odgovorenih pitanja
watchEffect(async () => {
    loadedGroup.value = false;
    loadedTotal.value = false;
    // updateTotalChart();
    // updateGroupChart();
    await fetchAnsweredQuestionsForGroup();
    await fetchTotalAnsweredQuestions();
});
</script>

<!-- * OVAJ DJELOMIČNO RADI -->
<!--<template>
    <div>
        <div class="charts-div">
            <div class="heading">
                <font-awesome-icon icon="chart-pie" />
                <span>Dijagrami</span>
            </div>
            <div class="charts">
                <div class="chart">
                    <h4>Odgovoreno za <br> '{{ selectedGroupName }}'</h4>
                    <div class="diagram">
                        <Pie v-if="loadedGroup && selectedGroupId" id="groupChart" class="chart-diagram"
                            :options="pieChartOptions" :data="pieGroupChartData" ref="groupChartRef" />
                        <p v-else>
                            <font-awesome-icon icon="circle-info" size="sm" />
                            Odaberi grupu za prikaz dijagrama.
                        </p>
                    </div>
                </div>
                <div class="chart">
                    <h4>Ukupno odgovoreno</h4>
                    <div class="diagram">
                        <Pie v-if="loadedTotal" id="totalChart" class="chart-diagram" :options="pieChartOptions"
                            :data="pieChartData" ref="totalChartRef" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

 <script setup>
import { ref, computed, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useUpitnikInfoStore } from '~/stores/upitnikInfoStore';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const upitnikInfoStore = useUpitnikInfoStore();

const props = defineProps({
    selectedGroupId: Number,
    upitnikData: Array
});

const ezu_id = computed(() => {
    const id = upitnikInfoStore.ezu_id;
    return isNaN(id) ? 0 : parseInt(id);
});

const totalAnsweredQuestions = computed(() => upitnikInfoStore.totalAnsweredQuestions);
const groupAnsweredQuestions = computed(() => upitnikInfoStore.groupAnsweredQuestions);

console.log(totalAnsweredQuestions.value);
console.log(groupAnsweredQuestions.value);

const pieChartData = ref({
    labels: ['Odgovoreno', 'Nije odgovoreno'],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: ['#0B78BD', '#0b79bd66'],
            hoverBackgroundColor: ['#2693D9', '#0b79bd88']
        }
    ]
});

const pieGroupChartData = ref({
    labels: ['Odgovoreno', 'Nije odgovoreno'],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: ['#0B78BD', '#0b79bd66'],
            hoverBackgroundColor: ['#2693D9', '#0b79bd88']
        }
    ]
});

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false
};

const loadedTotal = ref(false);
const loadedGroup = ref(false);
const selectedGroupName = ref('');

const groupChartRef = ref(null);
const totalChartRef = ref(null);

const findGroupById = (groups, id) => {
    if (!groups) return null;
    for (const group of groups) {
        if (parseInt(group.id) === id) {
            return group;
        }
        if (group.children && group.children.length > 0) {
            const found = findGroupById(group.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

const updateTotalChart = () => {
    loadedTotal.value = false;
    pieChartData.value.datasets[0].data = [
        totalAnsweredQuestions.value.uk_odgovoreno,
        totalAnsweredQuestions.value.uk_pitanja - totalAnsweredQuestions.value.uk_odgovoreno
    ];
    loadedTotal.value = true;
    // if (totalChartRef.value) {
    //     totalChartRef.value.update();
    // }
};

const updateGroupChart = () => {
    loadedGroup.value = false;
    pieGroupChartData.value.datasets[0].data = [
        groupAnsweredQuestions.value.uk_odgovoreno,
        groupAnsweredQuestions.value.uk_pitanja - groupAnsweredQuestions.value.uk_odgovoreno
    ];
    loadedGroup.value = true;
    // if (groupChartRef.value) {
    //     groupChartRef.value.update();
    // }
};

watch(
    () => props.selectedGroupId,
    async (newGroupId) => {
        const selectedGroup = findGroupById(props.upitnikData, newGroupId);
        selectedGroupName.value = selectedGroup ? selectedGroup.name : 'nepoznato';

        await upitnikInfoStore.fetchAnsweredQuestionsForGroup(newGroupId);
        updateTotalChart();
        updateGroupChart();
    },
    { immediate: true }
);

watch(
    // loadedGroup.value = false,
    // loadedTotal.value = false,
    totalAnsweredQuestions,
    updateTotalChart,
    { immediate: true }
);

watch(
    // loadedGroup.value = false,
    // loadedTotal.value = false,
    groupAnsweredQuestions,
    updateGroupChart,
    { immediate: true }
);

watchEffect(async () => {
    // loadedGroup.value = false;
    // loadedTotal.value = false;
    updateTotalChart();
    updateGroupChart();
    await upitnikInfoStore.fetchTotalAnsweredQuestions();
    await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
});

// onMounted(async () => {
//     await upitnikInfoStore.fetchTotalAnsweredQuestions();
//     await upitnikInfoStore.fetchAnsweredQuestionsForGroup(props.selectedGroupId);
// });
</script> -->

<style scoped>
.charts-div {
    background-color: #0b79bd13;
    border-radius: 15px;
    width: 100%;
}

.heading {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px 18px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 5px 5px 0px 0px;
    gap: 10px;
}

.charts {
    width: 100%;
    font-size: 14px;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 20px;
    padding: 18px;
}

.chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

h4 {
    font-size: 14px;
    font-weight: 400;
    width: 80%;
    text-align: center;

    border-bottom: 1px solid rgba(128, 128, 128, 0.449);
    padding-bottom: 5px;
}

.diagram {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.diagram>p {
    font-size: 12px;
}

.charts {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
}

.chart {
    width: 100%;
}

.chart-diagram {
    width: 100% !important;
    height: 200px !important;
}

.rotate-icon {
    position: absolute;
    right: 18px;
}

.rotate-icon:hover {
    transform: scale(0.9);
    color: rgb(214, 214, 214);
}
</style>
