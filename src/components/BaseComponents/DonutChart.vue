<template>
    <Donut :options="chartData.options" :data="chartData.data" />
</template>

<script>
import { Doughnut as Donut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'DonutChart',
    components: { Donut },
    props: {
        chartData: Object
    },
}
</script>