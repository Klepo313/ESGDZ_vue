<template>
    <div>
        <div class="charts-div">
            <div class="heading">
                <!--@click="toggleExpanded_main"-->
                <font-awesome-icon icon="chart-pie" />
                <span>Dijagrami</span>
            </div>
            <div class="charts">
                <div class="chart">
                    <h4>Općenito</h4>
                    <div class="diagram">
                        <Pie id="pie-chart1" class="chart-diagram" :options="pieChartOptions" :data="pieChartData" />
                    </div>
                </div>
                <div class="chart">
                    <h4>Ukupno odgovoreno</h4>
                    <div class="diagram">
                        <Pie id="pie-chart2" class="chart-diagram" :options="pieChartOptions" :data="pieChartData" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

// Podaci za Bar chart
const barChartData = ref({
    labels: ['January', 'February', 'March'],
    datasets: [
        { data: [40, 20, 12], label: 'Dataset 1' },
        { data: [30, 10, 25], label: 'Dataset 2' },
    ]
})

const barChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false // Omogućava prilagodbu omjera stranica
})

// Podaci za Pie chart
const pieChartData = ref({
    labels: ['Odgovoreno', 'Nije odgovoreno'],
    datasets: [
        {
            data: [156, 233],
            backgroundColor: ['green', 'red'],
            hoverBackgroundColor: ['green', 'red']
        }
    ]
})

const pieChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false // Omogućava prilagodbu omjera stranica
})
</script>

<style scoped>
.charts-div {
    background-color: #0b79bd13;
    border-radius: 15px;
    width: 100%;
}

/* .charts-div * {
    outline: auto;
} */

.heading {
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
    font-size: 16px;
    font-weight: 400;
}

.diagram {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart-diagram {
    width: 100%;
    /* height: 400px; */
    /* Definirajte visinu za grafikon */
}
</style>
