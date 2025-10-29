<template>
    <div class="mf-wrapper">
        <div class="left-w">
            <SortableListCard @qtySort="init" @changeBranch="handleBranchChange" @productClicked="handleProductInfo"
                :list="head[currentBranch]" :branch="currentBranch" info="Top Products" />
        </div>
        <div class="right-w">
            <SortableListCard @qtySort="init" @changeBranch="handleBranchChange" @productClicked="handleProductInfo"
                :list="tail[currentBranch]" :branch="currentBranch" info="Bottom Products" />
        </div>
    </div>
</template>

<style scoped>
.mf-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px 0px;
}

.left-w,
.right-w {
    flex: 1 1 45%;
    max-width: 700px;
    min-width: 350px;
    width: 48%;
}

.left-w {
    margin-right: 1.75%;
}

.right-w {
    margin-left: 1.75%;
}

@media (max-width: 768px) {
    .mf-wrapper {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .left-w,
    .right-w {
        flex: 1 1 95%;
        width: 95% !important;
        min-width: 300px !important;
        margin-bottom: 20px;
    }
}
</style>

<script>
import SortableListCard from './BaseComponents/SortableListCard.vue';

export default {
    name: "ItemWiseSection",
    components: {
        SortableListCard
    },
    props: {
        itemWiseList: Object
    },
    data() {
        return {
            head: {},
            tail: {},
            currentBranch: "FoodPanda",
            currentOrder: 2
        }
    },
    methods: {
        init: function () {
            let range = 10;
            let itemWiseItemList = this.itemWiseList;
            this.head = {}
            this.tail = {}
            this.currentOrder == 1 ? this.currentOrder = 2 : this.currentOrder = 1;
            Object.keys(itemWiseItemList).forEach(branch => {
                this.head[branch] = [];
                this.tail[branch] = [];
                let branchArray = Object.entries(itemWiseItemList[branch]).map(
                    ([item, arr]) => [item, ...arr]
                );
                let sortedArray = this.sortArray(branchArray, this.currentOrder);
                this.head[branch] = sortedArray.slice(-range).reverse();
                this.tail[branch] = sortedArray.slice(0, range);
            });
        }, // init

        sortArray: function (arrayToSort, indexToSort) {
            let n = arrayToSort.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (arrayToSort[j][indexToSort] > arrayToSort[j + 1][indexToSort]) {
                        let temp = arrayToSort[j];
                        arrayToSort[j] = arrayToSort[j + 1];
                        arrayToSort[j + 1] = temp;
                    }
                }
            }
            return arrayToSort;
        }, // sortArray

        handleBranchChange: function () {
            const branches = Object.keys(this.head);
            if (branches.length === 0) return;

            const currentIndex = branches.indexOf(this.currentBranch);
            const nextIndex = (currentIndex + 1) % branches.length;

            this.currentBranch = branches[nextIndex];
        }, // handleBranchChange

        handleProductInfo: function (productName) {
            this.$emit('productAdded', productName);
        } // handleProductInfo

    },
    mounted() {
        this.init();
    }
}

</script>