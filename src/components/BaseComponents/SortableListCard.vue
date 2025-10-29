<template>
    <table class="table">
        <thead>
            <tr>
                <th>
                    <p style="font-size: 10px !important;"
                        v-if="!info.includes('Top Products') || !info.includes('Bottom Products')">{{ info }}</p>
                    <h1 v-else>{{ info }}</h1>
                </th>
                <th></th>
                <th>
                    <h4><b>{{ branch }}</b></h4>
                </th>
            </tr>
        </thead>
        <thead class="special-row">
            <tr>
                <th>Item Name</th>
                <th @click="this.$emit('qtySort')">Quantity Sold</th>
                <th @click="this.$emit('qtySort')">Sale Value (PKR)</th>
            </tr>
        </thead>
        <tbody>
            <tr class="special-row">
                <td></td>
                <td></td>
                <td @click="this.$emit('changeBranch')"><button class="btn">Next &#8594;</button>
                </td>
            </tr>
            <tr v-for="(item, idx) in list">
                <td @click="this.$emit('productClicked', item[0])">{{ item[0] }}</td>
                <td>{{ item[1] }}</td>
                <td>PKR {{ Number(item[2]).toFixed(0) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
.table {
    border-spacing: 1;
    border-collapse: collapse;
    background-color: rgba(244, 244, 255, 0.41);
    backdrop-filter: blur(25px);
    box-shadow: 4px 4px 30px rgba(0, 0, 0, .2);
    border-radius: 18px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    transition: 0.5s all;
    width: 100%;

    td,
    th {
        padding: 8px
    }

    thead tr {
        height: 60px;
        background: rgba(0, 110, 255, 0.041);
        font-size: 16px;
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
    }

    tbody tr {
        height: 48px;
        border-bottom: 1px solid #E3F1D5;

        &:last-child {
            border: 0;
        }
    }

    td,
    th {
        text-align: left;
        padding: 18px;

        &.l {
            text-align: right
        }

        &.c {
            text-align: center
        }

        &.r {
            text-align: center
        }
    }
}

tbody tr td:first-child {
    text-decoration: underline;
    cursor: pointer;
    text-underline-offset: 4px;
}

.special-row {
    cursor: pointer;
    color: #000;
}

.btn {
    padding: 8px 12px;
    background-color: #000;
    border-radius: 8px;
    color: #fff;
    float: right;
    border: none;
    cursor: pointer;
    width: 100%;
}

@media (max-width: 400px) {
    * {
        font-size: 10px;
    }
}
</style>

<script>

export default {
    name: "SortableListCard",
    props: {
        list: Array,
        branch: String,
        info: String
    }
}

</script>