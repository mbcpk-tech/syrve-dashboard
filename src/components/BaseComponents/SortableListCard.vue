<template>
    <table class="table">
        <thead>
            <tr>
                <th>
                    <h1>{{ info }}</h1>
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
                <td>{{ item[0] }}</td>
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
    background-color: rgba(0, 110, 255, 0.041);
    backdrop-filter: blur(25px);
    box-shadow: 4px 4px 30px rgba(0, 0, 0, .2);
    border-radius: 18px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    transition: 0.5s all;
    min-width: 95% !important;

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