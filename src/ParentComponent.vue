<template>
    <div id="app">
        <div class="navbar">
            <img src="./assets/logo.svg" alt="logo" class="logo" />
            <div class="filter-div">
                <div class="chips">
                    <span class="chip" v-for="item in filteredItems" @click="removeItem(item)">{{ item }}</span>
                </div>
                <input type="text" @keyup="updateSearch($event)" @focus="activate" @blur="deactivate" class="search-bar"
                    placeholder="Start Searching here" />
                <button @click="updateFilter">Filter</button>
            </div>
        </div>

        <div class="search-modal" v-if="search_active" @mousedown.prevent>
            <span v-for="(item, i) in items_qs" @click="addItem(item)">
                {{ item }}
            </span>
        </div>

        <div v-if="isLoading" class="line-loader"></div>

        <div class="application" v-if="dataLoaded">
            <h1 class="period">Period: {{ period }}</h1>
            <SalesCharts :salesData="monthlyBranchTotals" :hourlySalesData="hourlyBranchTotals"
                :paymentWise="paymentWise" :dayWise="dailyBranchTotals" />
            <ItemWiseSection :key="itemKey" :itemWiseList="itemWiseList" />
            <br>
            <AiAnalysis :monthlyBranchTotals="monthlyBranchTotals" :hourlyBranchTotals="hourlyBranchTotals"
                :paymentWise="paymentWise" :dailyBranchTotals="dailyBranchTotals" :itemWiseList="itemWiseList" />
            <div class="dum"></div>
        </div>

        <div v-else class="wrapper">
            <UploadFileCard @fileUploaded="processData" @throwError="handleSnackBar" />
        </div>

        <SnackBar class="snackBar" :isVisible="snackBarVisible">{{ snackBarMsg }}</SnackBar>
    </div>
</template>

<style scoped>
#app,
body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}

.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 10px 20px;
    backdrop-filter: blur(20px);
    box-sizing: border-box;
}

.logo {
    height: 40px;
}

.filter-div {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-div input {
    border: 1px solid #c3c3c3;
    border-radius: 4px;
    padding: 8px;
    outline: none;
    width: 250px;
    background-color: rgba(244, 244, 244, 0.5);
}

.filter-div button {
    background-color: #007bff !important;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.filter-div .chips {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 2px;
    max-width: 900px;
}

.filter-div .chips span {
    background-color: #c3c3c3;
    border-radius: 12px;
    padding: 4px;
    font-size: 8px;
    cursor: pointer;
}

.filter-div .chips span:hover {
    background-color: #f44336;
}

.search-modal {
    width: 251px;
    background-color: rgba(244, 244, 244, 0.5);
    z-index: 12;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    padding: 12px;
    color: #000;
    position: fixed;
    top: 6.5%;
    right: 6.2%;
    border: 1px solid #c3c3c3;
    border-top: none;
    overflow-y: scroll;
    font-size: 10px;
    max-height: 400px;
}

.search-modal span {
    display: block;
    cursor: pointer;
}

.search-modal span:hover {
    background-color: #c3c3c3;
}

.application {
    position: relative;
    z-index: 1;
    padding-top: 80px;
    width: 100%;
}

.period {
    text-align: center;
    margin: 8px 0px;
    font-weight: bolder;
}

.dum {
    height: 40vh;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    padding-top: 80px;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    z-index: 1;
    overflow: auto;
}

@media (max-width: 768px) {
    .filter-div input {
        width: 150px;
    }

    .logo {
        height: 30px;
    }
}

@media (max-width: 400px) {
    .navbar {
        flex-direction: column;
        align-items: flex-start;
        padding: 10px 10px;
        height: auto;
    }

    .navbar .filter-div {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
    }

    .filter-div input,
    .filter-div .chips {
        width: 100%;
        box-sizing: border-box;
        margin: 4px 0;
    }

    .application {
        margin-top: 15vh;
    }

    .navbar .filter-div>button {
        width: 100%;
        box-sizing: border-box;
    }

    .wrapper {
        position: absolute;
        height: auto;
        padding: 80px 10px;
    }

    .logo {
        height: 30px;
        margin-bottom: 5px;
    }

    .search-modal {
        top: auto;
        right: auto;
    }
}
</style>

<style scoped>
.wrapper {
    position: absolute;
    top: 25%;
    left: 40%;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    display: block;
    overflow-x: hidden;
    z-index: 1;
}

.line-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #007bff, #00d4ff);
    z-index: 99999;
    animation: loading-line 2s ease-in-out infinite;
}

@keyframes loading-line {
    0% {
        width: 0%;
        left: 0%;
    }

    50% {
        width: 60%;
        left: 20%;
    }

    100% {
        width: 100%;
        left: 100%;
    }
}
</style>

<script>
import UploadFileCard from './components/UploadFileCard.vue';
import SalesCharts from './components/SalesCharts.vue';
import ItemWiseSection from './components/ItemWiseSection.vue';
import AdditionalComponents from './components/additional/AdditionalComponents.vue';
import AiAnalysis from './components/AiAnalysis.vue';
import SnackBar from './components/BaseComponents/SnackBar.vue';

export default {
    name: "ParentComponent",
    components: {
        UploadFileCard,
        SalesCharts,
        ItemWiseSection,
        AdditionalComponents,
        AiAnalysis,
        SnackBar
    },
    data() {
        return {
            dataLoaded: false,
            isLoading: false,
            rawDataHeaders: [],
            rawDataBody: [],
            monthlyBranchTotals: {},
            hourlyBranchTotals: {},
            dailyBranchTotals: {},
            paymentWise: {},
            itemWiseList: {},
            filteredItems: ["pc", "combo", "meal"],
            itemKey: 0,
            items: [],
            items_qs: [],
            search_active: false,
            snackBarVisible: false,
            snackBarMsg: "",
            period: ""
        }
    },
    methods: {

        updateFilter() {
            this.formatProducts(this.rawDataBody, 10);
            this.itemKey = Date.now();
            this.items_qs = this.items;
        },

        activate: function () {
            this.search_active = true;
            this.$nextTick(() => {
                const searchInput = document.querySelector('.filter-div .search-bar');
                const modal = document.querySelector('.search-modal');

                if (searchInput && modal) {
                    const inputRect = searchInput.getBoundingClientRect();
                    modal.style.width = inputRect.width + 'px';
                    modal.style.top = inputRect.bottom + 'px';
                    modal.style.left = inputRect.left + 'px';
                    modal.style.right = 'auto';
                }
            });
        },
        deactivate: function () {
            this.search_active = false;
        },

        updateSearch(e) {
            const query = e.target.value.toLowerCase();
            this.items_qs = this.items.filter(i => i.toLowerCase().includes(query)).filter(i => !this.filteredItems.includes(i));
            if (e.keyCode == 13) {
                this.addItem(query);
                e.target.value = "";
            }
        },

        addItem(item) {
            if (!this.filteredItems.includes(item)) {
                this.filteredItems.push(item);
            }
            this.updateFilter();
            this.items_qs = this.items_qs.filter(i => i !== item);
        },

        removeItem(item) {
            this.filteredItems = this.filteredItems.filter(i => i !== item);
            this.updateFilter();
            this.items_qs.push(item);
            this.items_qs.sort();
        },

        handleSnackBar: function (msg) {
            this.snackBarVisible = true;
            this.snackBarMsg = msg;
            setTimeout(() => {
                this.snackBarVisible = false;
            }, 3000);
        },

        calculateDatePeriod: function (rawData) {
            let allDates = [];
            Object.keys(rawData).forEach(branch => {
                rawData[branch].forEach((saleItem) => {
                    if (saleItem && saleItem[0]) {
                        allDates.push(new Date(saleItem[0]));
                    }
                });
            });

            if (allDates.length === 0) {
                this.period = 'No data available';
                return;
            }
            const minDate = new Date(Math.min(...allDates));
            const maxDate = new Date(Math.max(...allDates));
            const formatDate = (date) => {
                const d = date.getDate().toString().padStart(2, '0');
                const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
                const y = date.getFullYear();
                return `${d}/${m}/${y}`;
            };
            this.period = `${formatDate(minDate)} - ${formatDate(maxDate)}`;
        },

        async processData(rawData) {
            this.isLoading = true;
            this.dataLoaded = false;
            await this.$nextTick();
            await new Promise(r => setTimeout(r, 50));
            const worker = new Worker(new URL('@/workers/dataWorker.js', import.meta.url), { type: 'module' });
            worker.postMessage({ rawData });
            worker.onmessage = (e) => {
                const processedData = e.data;

                this.monthlyBranchTotals = processedData.monthlyBranchTotals;
                this.hourlyBranchTotals = processedData.hourlyBranchTotals;
                this.dailyBranchTotals = processedData.dailyBranchTotals;
                this.paymentWise = processedData.payments;

                this.rawDataBody = processedData.rawData;
                this.formatProducts(this.rawDataBody, 10);
                this.calculateDatePeriod(this.rawDataBody);
                this.items_qs = this.items;

                this.isLoading = false;
                this.dataLoaded = true;
                worker.terminate();
            };
            worker.onerror = (err) => {
                console.error("Worker error:", err);
                this.isLoading = false;
            };
        }, // processData

        formatProducts: function (rawData, range) {
            let filteredItems = this.filteredItems;
            const itemWiseSale = {}
            const itemWiseQty = {}
            const itemWiseList = {}
            let items = [];
            Object.keys(rawData).forEach(branch => {
                itemWiseQty[branch] = {};
                itemWiseSale[branch] = {};
                itemWiseList[branch] = {};
                rawData[branch].forEach((saleItem) => {
                    if (!saleItem || !saleItem[0]) return;
                    const itemName = saleItem[2];
                    if (filteredItems.some(keyword => itemName.toLowerCase().includes(keyword.toLowerCase())) & itemName !== "Wing") {
                        if (!itemWiseList[branch][itemName]) {
                            itemWiseList[branch][itemName] = [0, 0];
                        }
                        const itemQty = Number(saleItem[5]) || 0;
                        const itemSale = Number(saleItem[8]) || 0;
                        itemWiseSale[branch][itemName] = (itemWiseSale[branch][itemName] || 0) + itemSale;
                        itemWiseQty[branch][itemName] = (itemWiseQty[branch][itemName] || 0) + itemQty;
                        itemWiseList[branch][itemName][0] = (itemWiseList[branch][itemName][0] || 0) + itemQty;
                        itemWiseList[branch][itemName][1] = (itemWiseList[branch][itemName][1] || 0) + itemSale;
                    }
                    if (!items.includes(itemName)) {
                        items.push(itemName);
                    }
                });
                itemWiseQty[branch] = this.sortObject(itemWiseQty[branch]);
                itemWiseQty[branch]["tail"] = itemWiseQty[branch].slice(0, range).reverse();
                itemWiseQty[branch]["head"] = itemWiseQty[branch].slice(-range).reverse();
                itemWiseSale[branch] = this.sortObject(itemWiseSale[branch]);
                itemWiseSale[branch]["tail"] = itemWiseSale[branch].slice(0, range).reverse();
                itemWiseSale[branch]["head"] = itemWiseSale[branch].slice(-range).reverse();
            });
            this.items = items;
            this.items_qs = items;
            this.itemWiseList = JSON.parse(JSON.stringify(itemWiseList));
        }, // formatProducts

        sortObject: function (object) {
            let arrayToSort = [];
            Object.keys(object).forEach(key => {
                arrayToSort.push([key, object[key]]);
            })
            let n = arrayToSort.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (arrayToSort[j][1] > arrayToSort[j + 1][1]) {
                        let temp = arrayToSort[j];
                        arrayToSort[j] = arrayToSort[j + 1];
                        arrayToSort[j + 1] = temp;
                    }
                }
            }
            return arrayToSort;
        }, // sortObject
    }
}

</script>