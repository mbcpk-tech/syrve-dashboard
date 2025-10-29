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
            <SortableListCard v-if="selectedProductName && selectedItem[selectedProductName]"
                class="pie chart list-card" @changeBranch="handleBranchChange"
                :list="selectedItem[selectedProductName][currentBranch]" :branch="currentBranch"
                :info="selectedProductName" />
            <div class="card pie chart" v-else>
                <h1>Click A Product</h1>
            </div>
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
    min-width: 33%;
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
import SortableListCard from './BaseComponents/SortableListCard.vue';

export default {
    name: "SalesCharts",
    components: {
        BarChart,
        PieChart,
        LineChart,
        DonutChart,
        SortableListCard
    },
    props: {
        salesData: Object,
        hourlySalesData: Object,
        paymentWise: Object,
        dayWise: Object,
        selectedItem: Object,
        selectedProductName: String
    },
    data() {
        return {
            dataLoaded: false,
            currentBranch: "FoodPanda",
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
            let monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            this.barChartData.data.labels = [];
            this.barChartData.data.datasets = [];
            const allMonths = new Set();
            const monthMap = new Map();
            for (let key of Object.keys(this.salesData)) {
                Object.keys(this.salesData[key]).forEach(fullDateKey => {
                    allMonths.add(fullDateKey);
                    if (!monthMap.has(fullDateKey)) {
                        let [year, monthNumberString] = fullDateKey.split("-");
                        let monthIndex = parseInt(monthNumberString, 10) - 1;
                        let monthName = monthsName[monthIndex];

                        monthMap.set(fullDateKey, `${monthName} ${year}`);
                    }
                });
            }
            const sortedDateKeys = Array.from(allMonths).sort();
            this.barChartData.data.labels = sortedDateKeys.map(dateKey => monthMap.get(dateKey));
            for (let key of Object.keys(this.salesData)) {
                let data = [];
                sortedDateKeys.forEach(dateKey => {
                    const value = this.salesData[key][dateKey] ?? 0;
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
            this.barChartData.options["plugins"] = {
                title: { display: true, text: 'Month Wise Sales', font: { size: 18 } }
            };

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
                        title: { display: true, text: 'Total Sales by Branch', font: { size: 18 } }
                    }
                }
            }

            this.hourlyChartData = {
                data: { labels: [], datasets: [] },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'Hour Wise Sales', font: { size: 18 } }
                    }
                }
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
                        title: { display: true, text: 'Payment Wise Sales', font: { size: 18 } }
                    }
                }
            }

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
            this.dayWiseChartData.options["plugins"] = {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Day Wise Sales', font: { size: 18 } }
            }
            this.dataLoaded = true;

        }, // saleProcessing

        handleBranchChange: function () {
            const branches = Object.keys(this.salesData);
            if (branches.length === 0) return;
            const currentIndex = branches.indexOf(this.currentBranch);
            const nextIndex = (currentIndex + 1) % branches.length;
            this.currentBranch = branches[nextIndex];
        }, // handleBranchChange
    },

    mounted() {
        this.salesProcessing();
    }
}

</script>