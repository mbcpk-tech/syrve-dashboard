<template>
    <div class="chart-wrapper">
        <div class="charts">
            <PieChart class="card chart pie" :chartData="pieChartData" />
            <BarChart v-if="dataLoaded" class="card chart bar" :chartData="barChartData" />
        </div>
        <div class="charts">
            <LineChart v-if="dataLoaded" class="card chart line" :chartData="hourlyChartData" />
            <DonutChart class="card chart pie" :chartData="paymentWiseData" />
        </div>
        <div class="charts">
            <BarChart v-if="dataLoaded" class="card chart bar" :chartData="dayWiseChartData" />
        </div>
    </div>
</template>

<style scoped>
.charts {
    display: flex;
    max-width: 100% !important;
}

.pie {
    max-width: 33%;
    max-height: 60vh;
}

.bar,
.line {
    max-width: 61%;
    max-height: 60vh;
}

.chart {
    margin: 20px 20px;
}

@media (max-width: 400px) {
    .charts {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .pie,
    .bar,
    .line {
        width: 100%;
        min-width: 90% !important;
        max-width: 90%;
        max-height: 100%;
    }
}
</style>

<script>
import BarChart from './BaseComponents/BarChart.vue';
import PieChart from './BaseComponents/PieChart.vue';
import LineChart from './BaseComponents/LineChart.vue';
import DonutChart from './BaseComponents/DonutChart.vue';

export default {
    name: "SalesCharts",
    components: {
        BarChart,
        PieChart,
        LineChart,
        DonutChart
    },
    props: {
        salesData: Object,
        hourlySalesData: Object,
        paymentWise: Object,
        dayWise: Object
    },
    data() {
        return {
            dataLoaded: false,
            pieChartData: {
                data: {
                    labels: [],
                    datasets: [{ data: [] }]
                },
                options: {
                    responsive: true
                }
            },
            barChartData: {
                data: {
                    labels: [],
                    datasets: [
                        { data: [] }
                    ]
                },
                options: {
                    responsive: true
                }
            },
            hourlyChartData: {
                data: { labels: [], datasets: [] }, options: {
                    responsive: true
                }
            },
            dayWiseChartData: {
                data: { labels: [], datasets: [] }, options: {
                    responsive: true
                }
            },
            paymentWiseData: {
                data: { labels: [], datasets: [] }, options: {
                    responsive: true
                }
            }
        }
    },
    methods: {
        salesProcessing: function () {
            this.barChartData.data.labels = [];
            this.barChartData.data.datasets = [];
            const allMonths = new Set();
            for (let key of Object.keys(this.salesData)) {
                Object.keys(this.salesData[key]).forEach(month => allMonths.add(month));
            }
            this.barChartData.data.labels = Array.from(allMonths).sort();
            for (let key of Object.keys(this.salesData)) {
                let data = [];
                this.barChartData.data.labels.forEach(month => {
                    const value = this.salesData[key][month] ?? 0;
                    data.push(value);
                });
                this.barChartData.data.datasets.push({
                    label: key,
                    data: data
                });
            }
            this.barChartData.data.datasets.forEach((dataset, i) => {
                dataset.backgroundColor = this.$colors[i % this.$colors.length];
            });

            const pieLabels = [];
            const pieData = [];
            const pieColors = [];

            Object.keys(this.salesData).forEach((branch, i) => {
                const total = Object.values(this.salesData[branch])
                    .reduce((sum, val) => sum + (val || 0), 0);

                pieLabels.push(branch);
                pieData.push(total);
                pieColors.push(this.$colors[i % this.$colors.length]);
            });

            this.pieChartData = {
                data: {
                    labels: pieLabels,
                    datasets: [
                        {
                            data: pieData,
                            backgroundColor: pieColors
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'Total Sales by Branch' }
                    }
                }
            }

            this.hourlyChartData = {
                data: { labels: [], datasets: [] }
            };

            const allHours = new Set();
            for (let key of Object.keys(this.hourlySalesData)) {
                Object.keys(this.hourlySalesData[key]).forEach(hour => allHours.add(hour));
            }

            this.hourlyChartData.data.labels = Array.from(allHours).sort();

            for (let key of Object.keys(this.hourlySalesData)) {
                let data = [];
                this.hourlyChartData.data.labels.forEach(hour => {
                    const value = this.hourlySalesData[key][hour] ?? 0;
                    data.push(value);
                });

                this.hourlyChartData.data.datasets.push({
                    label: key,
                    data: data
                });
            }

            this.hourlyChartData.data.datasets.forEach((dataset, i) => {
                let color = this.$colors[i % this.$colors.length]
                dataset.backgroundColor = color;
                dataset.borderColor = color;
            });

            const paymentLabels = [];
            const paymentData = [];
            const paymentColors = [];
            Object.keys(this.paymentWise).forEach((payment, i) => {
                paymentLabels.push(payment);
                paymentData.push(this.paymentWise[payment]);
                paymentColors.push(this.$colors[i % this.$colors.length]);
            });

            this.paymentWiseData = {
                data: {
                    labels: paymentLabels,
                    datasets: [
                        {
                            data: paymentData,
                            backgroundColor: paymentColors
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'Payment Wise Sales' }
                    }
                }
            }

            // DayWise
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            this.dayWiseChartData.data.labels = daysOrder;
            Object.keys(this.dayWise).forEach((branch, i) => {
                const branchData = daysOrder.map(day => this.dayWise[branch][day] || 0);
                const color = this.$colors[i % this.$colors.length];
                this.dayWiseChartData.data.datasets.push({
                    label: branch,
                    data: branchData,
                    borderWidth: 1,
                    borderColor: color,
                    backgroundColor: color,
                });
            });

            this.dataLoaded = true;
        }
    },

    mounted() {
        this.salesProcessing();
    }
}

</script>