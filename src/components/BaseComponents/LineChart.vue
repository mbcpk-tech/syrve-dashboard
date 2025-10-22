<template>
    <Line :options="chartData.options" :data="chartData.data" />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
    name: 'LineChart',
    components: { Line },
    props: {
        chartData: Object
    },
    data() {
        return {
        }
    }
}
</script>