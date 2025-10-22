<template>
    <img src="./assets/logo.svg" alt="logo" class="logo">
    <div class="wrapper">
        <ParentComponent />
    </div>

</template>

<style>
:root {
    --accent: #ff6600;
    --accent-bg: rgba(255, 102, 0, 0.2);
    --text: #000;
    --background: #f5f5f5;
}

body {
    background-image: url("./assets/bg.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    background-size: 35%;
    min-height: 95vh;
    max-width: 100% !important;
}

.logo {
    position: fixed;
    top: 5px;
    left: 5px;
    width: 150px;
    z-index: 1;
}

.card {
    box-sizing: border-box;
    padding: 15px;
    background: rgba(217, 217, 217, 0.58);
    border: 1px solid white;
    box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
}

.card:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

/* .card:active {
    transform: scale(0.95) rotateZ(1.7deg);
} */
</style>

<style scoped>
.wrapper {
    max-width: 100% !important;
    min-height: 95vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
}
</style>

<script>
import ParentComponent from './ParentComponent.vue';
export default {
    components: {
        ParentComponent
    }
}

</script>