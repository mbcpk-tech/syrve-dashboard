<template>
    <div id="app">
        <div class="navbar">
            <img src="./assets/logo.svg" alt="logo" class="logo" />
            <div class="filter-div">
                <div class="chips">
                    <span class="chip" v-for="item in filteredItems" @click="removeItem(item)">{{ item }}</span>
                </div>
                <input type="text" @input="updateSearch($event)" @focus="activate" @blur="deactivate" />
                <button @click="updateFilter">Filter</button>
            </div>
            <div class="search-modal" v-if="search_active" @mousedown.prevent>
                <span v-for="(item, i) in items_qs" @click="addItem(item)">
                    {{ item }}
                </span>
            </div>
        </div>

        <div class="application" v-if="dataLoaded">
            <SalesCharts :salesData="monthlyBranchTotals" :hourlySalesData="hourlyBranchTotals" />
            <ItemWiseSection :key="itemKey" :itemWiseList="itemWiseList" />
            <div class="dum"></div>
        </div>

        <div v-else class="wrapper">
            <UploadFileCard @fileUploaded="processData" />
        </div>
    </div>
</template>

<style scoped>
#app,
body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
}

.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(24, 24, 24, 0.1);
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
    max-width: 400px;
}

.filter-div .chips span {
    background-color: #c3c3c3;
    border-radius: 12px;
    padding: 4px;
    font-size: 8px;
}

.search-modal {
    width: 300px;
    background-color: #fff;
    padding: 12px;
    color: #000;
    position: fixed;
    top: 100%;
    right: 3%;
    border: 1px solid #c3c3c3;
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
}

.dum {
    height: 100vh;
}

@media (max-width: 768px) {
    .filter-div input {
        width: 150px;
    }

    .logo {
        height: 30px;
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
</style>

<script>
import UploadFileCard from './components/UploadFileCard.vue';
import SalesCharts from './components/SalesCharts.vue';
import ItemWiseSection from './components/ItemWiseSection.vue';
import AdditionalComponents from './components/additional/AdditionalComponents.vue';

export default {
    name: "ParentComponent",
    components: {
        UploadFileCard,
        SalesCharts,
        ItemWiseSection,
        AdditionalComponents
    },
    data() {
        return {
            dataLoaded: false,
            rawDataHeaders: [],
            rawDataBody: [],
            monthlyBranchTotals: {},
            hourlyBranchTotals: {},
            itemWiseList: {},
            filteredItems: [],
            itemKey: 0,
            items: [],
            items_qs: [],
            search_active: false
        }
    },
    methods: {

        updateFilter() {
            this.formatProducts(this.rawDataBody, 10);
            this.itemKey = Date.now(); // forces ItemWiseSection update
        },

        activate: function () {
            this.search_active = true;
        },
        deactivate: function () {
            this.search_active = false;
        },

        updateSearch(e) {
            const query = e.target.value.toLowerCase();
            this.items_qs = this.items.filter(i => i.toLowerCase().includes(query));
        },

        addItem(item) {
            if (!this.filteredItems.includes(item)) {
                this.filteredItems.push(item);
            }
            this.updateFilter();
        },

        removeItem(item) {
            this.filteredItems = this.filteredItems.filter(i => i !== item);
            this.updateFilter();
        },

        processData: function (rawData) {
            rawData = this.cleanData(rawData);
            rawData = this.separateBranch(rawData);
            this.formatForSales(rawData);
            this.rawDataBody = rawData;
            this.formatProducts(rawData, 10);
            this.dataLoaded = true;
            this.items_qs = this.items;
        }, // processData

        cleanData: function (rawData) {
            let currentData = "";
            for (let i = 0; i < 5; i++) {
                rawData.forEach((ele, eidx) => {
                    ele[i].length > 1 ? currentData = ele[i] : rawData[eidx][i] = currentData;
                })
            }
            rawData.forEach((ele, eidx) => {
                ele.forEach((val, idx) => {
                    if (!isNaN(val) && val !== "") {
                        ele[idx] = Number(val);
                    }
                });
            })
            rawData = rawData.filter(row => {
                const saleValue = Number(row[8]) || 0;
                return saleValue > 0;
            });
            return rawData;
        }, // cleanData

        separateBranch: function (rawData) {
            rawData.forEach((ele, eidx) => {
                if (ele[4].includes("FoodPanda")) {
                    rawData[eidx][3] = "FoodPanda";
                    if (ele[4].includes("Cash")) { rawData[eidx][4] = "CASH" }
                    if (ele[4].includes("Online")) { rawData[eidx][4] = "ONLINE" }
                }
            })

            let groupedByBranch = rawData.reduce((acc, row) => {
                const branch = row[3];
                (acc[branch] ||= []).push(row);
                return acc;
            }, {});

            return groupedByBranch;
        }, //separateBranch

        formatForSales: function (rawData) {
            const monthlyBranchTotals = {};
            const hourlyBranchTotals = {};

            Object.keys(rawData).forEach(branch => {
                monthlyBranchTotals[branch] = {};
                hourlyBranchTotals[branch] = {};
                rawData[branch].forEach((saleItem) => {
                    if (!saleItem || !saleItem[0]) return;
                    const dateStr = saleItem[0].trim();
                    const hourStr = saleItem[1];
                    const saleValue = Number(saleItem[8]) || 0;
                    let dateObj;
                    if (dateStr.includes('-')) {
                        dateObj = new Date(dateStr);
                    } else if (dateStr.includes('/')) {
                        const [month, day, year] = dateStr.split('/');
                        dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                    } else {
                        dateObj = new Date(dateStr);
                    }
                    if (isNaN(dateObj.getTime())) return;
                    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                    monthlyBranchTotals[branch][monthKey] = (monthlyBranchTotals[branch][monthKey] || 0) + saleValue;
                    const hourKey = `${String(hourStr).padStart(2, '0')}:00`;
                    hourlyBranchTotals[branch][hourKey] = (hourlyBranchTotals[branch][hourKey] || 0) + saleValue;
                });
            });

            // Fill 0 for non-existent hours
            Object.keys(this.hourlyBranchTotals).forEach(branch => {
                const fullHours = {};
                for (let h = 0; h < 24; h++) {
                    const hourKey = `${String(h).padStart(2, '0')}:00`;
                    fullHours[hourKey] = this.hourlyBranchTotals[branch][hourKey] || 0;
                }
                this.hourlyBranchTotals[branch] = fullHours;
            });
            this.monthlyBranchTotals = monthlyBranchTotals;
            this.hourlyBranchTotals = hourlyBranchTotals;
        }, //formatForSales

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