<template>
    <div id="app">
        <ParentComponent />

        <div class="footer">
            <span>Copyright (c). All Rights Reserved - 2025.</span>

            <span>
                Made by <a href="https://dev-ars.vercel.app/">ARS</a>
            </span>
        </div>

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
    min-height: 100vh;
    margin: 0;
    padding: 0;
    font-family: "Inter", sans-serif;
    color: var(--text);
    overflow-x: hidden;
}

body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: -1;
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
</style>

<style scoped>
.footer {
    position: fixed;
    bottom: 3px;
    left: 0px;
    font-size: 10px;
    text-align: center;
    width: 100%;
    padding: 0 8px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
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