<template>

    <div class="section">
        <div class="card">

            <button class="btn" v-if="!isLoaded && !isLoading" @click="analyzeData">
                Get Ai Insights
            </button>
            <div class="spinner" v-if="isLoading">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="response" v-if="!isLoading && isLoaded">
                <div v-html="response"></div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.section {
    display: flex;
    justify-content: center;
}

.section .card {
    width: 80%;
    margin-left: -2%;
    min-height: 300px;
    background-color: rgba(255, 255, 255, 0.8);
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
    cursor: auto;
}

.btn {
    background-color: royalblue;
    padding: 8px 12px;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
}

.response {
    text-align: left;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif !important;
}

.response>div {
    border-radius: 8px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif !important;
}

.response p,
.response li,
.response ol {
    font-weight: light !important;
    font-size: 10px !important;
}

.response h3 {
    font-size: 14px !important;
}

.spinner {
    width: 70.4px;
    height: 70.4px;
    --clr: rgb(159, 175, 247);
    --clr-alpha: rgba(26, 132, 238, 0.1);
    animation: spinner 1.6s infinite ease;
    transform-style: preserve-3d;
}

.spinner>div {
    background-color: var(--clr-alpha);
    height: 100%;
    position: absolute;
    width: 100%;
    border: 3.5px solid var(--clr);
}

.spinner div:nth-of-type(1) {
    transform: translateZ(-35.2px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
    transform: rotateY(-270deg) translateX(50%);
    transform-origin: top right;
}

.spinner div:nth-of-type(3) {
    transform: rotateY(270deg) translateX(-50%);
    transform-origin: center left;
}

.spinner div:nth-of-type(4) {
    transform: rotateX(90deg) translateY(-50%);
    transform-origin: top center;
}

.spinner div:nth-of-type(5) {
    transform: rotateX(-90deg) translateY(50%);
    transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
    transform: translateZ(35.2px);
}

@keyframes spinner {
    0% {
        transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
    }

    50% {
        transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
    }

    100% {
        transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
    }
}
</style>
<script>

export default {
    name: "AiAnalysis",
    data() {
        return {
            isLoading: false,
            isLoaded: false,
            response: ""
        }
    },
    props: {
        monthlyBranchTotals: Object,
        hourlyBranchTotals: Object,
        dailyBranchTotals: Object,
        paymentWise: Object,
        itemWiseList: Object
    },
    methods: {

        analyzeData: async function () {
            this.isLoading = true;
            const data = {
                "Month Wise, Branch Wise Sales": this.monthlyBranchTotals,
                "Hour Wise, Branch Wise Sales": this.hourlyBranchTotals,
                "Day Wise, Branch Wise Sales": this.dailyBranchTotals,
                "Payment Method Wise Sales": this.paymentWise,
                "Product Wise, Branch Wise Sales": this.itemWiseList
            }
            const formattedData = JSON.stringify(data, null, 2);
            const geminiURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
            if (this.$geminiApi.length < 1) {
                return;
            }
            const response = await fetch(geminiURL, {
                method: "POST",
                headers: {
                    "x-goog-api-key": this.$geminiApi,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "contents": [
                        {
                            "parts": [{
                                "text": `Here is the sales data in JSON ${formattedData} explain detailed analysis and anomalies and trends,
do not acknowledge or use okay or alright, just give the html, pure html otherwise everything will be break,
use only inline styling and make each section look separate, but do not use too much stylings, use h3 for headings, p for normal text and ol li for lists and bullet point.
start from <div> and end from </div> everything would be inside of it. Follow each rule strictly. do not use special characters
such as * for bold, use b html tag, and use PKR for currency. Use 10px light weight for p, li and ol and font size 14px for h3 and bold.
and in Last use this.$colors array that has list of colors and separate each section with that background colors`
                            }]
                        }
                    ]
                })
            });
            let reply = await response.json()
            reply = reply.candidates?.[0]?.content?.parts?.[0]?.text || "No reply found";
            this.isLoading = false;
            this.isLoaded = true;
            this.response = reply;
        } // Analyze Data

    }
}

</script>