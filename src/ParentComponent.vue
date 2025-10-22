<template>
    <div>
        <div class="application" v-if="dataLoaded">
            <SalesCharts :salesData="monthlyBranchTotals" :hourlySalesData="hourlyBranchTotals" />
            <br>
            <ItemWiseSection :itemWiseList="itemWiseList" class="component" />
            <div class="dum" style="height: 100vh;"></div>
        </div>
        <div v-else>
            <UploadFileCard @fileUploaded="processData" />
        </div>
        <!-- <AdditionalComponents /> -->
    </div>
</template>

<style>
.application {
    display: block;
}

.component {
    max-width: 100%;
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
            itemWiseList: {}
        }
    },
    methods: {

        processData: function (rawData) {
            rawData = this.cleanData(rawData);
            rawData = this.separateBranch(rawData);
            this.formatForSales(rawData);
            this.formatProducts(rawData, 10);
            this.dataLoaded = true;
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
            let filteredItems = ["big mary", "tenders", "combo", "pc", "wrap", "sandwich", "taters", "poutine", "wing"];
            const itemWiseSale = {}
            const itemWiseQty = {}
            const itemWiseList = {}
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
                });
                itemWiseQty[branch] = this.sortObject(itemWiseQty[branch]);
                itemWiseQty[branch]["tail"] = itemWiseQty[branch].slice(0, range).reverse();
                itemWiseQty[branch]["head"] = itemWiseQty[branch].slice(-range).reverse();
                itemWiseSale[branch] = this.sortObject(itemWiseSale[branch]);
                itemWiseSale[branch]["tail"] = itemWiseSale[branch].slice(0, range).reverse();
                itemWiseSale[branch]["head"] = itemWiseSale[branch].slice(-range).reverse();
            });
            this.itemWiseList = itemWiseList;
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