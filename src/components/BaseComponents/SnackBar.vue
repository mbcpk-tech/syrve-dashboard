<template>
    <div class="bar-container">
        <div :class="{ 'bar': true, 'visible': isVisible }">
            <p>
                <slot></slot>
            </p>
        </div>
    </div>
</template>

<style scoped>
.bar-container {
    display: flex;
    position: fixed;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.bar {
    padding: 8px 12px;
    background-color: #242424;
    color: #fff;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    text-align: center;
    font-size: 12px;
    min-width: 20%;

    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;

    bottom: -100px;
    border-radius: 8px;
    transition: 0.5s ease-in-out;
}

.bar.visible {
    bottom: 30px;
    transition: 0.5s ease-in-out;
}

@media (max-width: 400px) {
    .bar {
        min-width: 80%;
    }

    .bar.visible {
        bottom: 10vh;
    }
}
</style>

<script>

export default {
    name: "SnackBar",
    props: {
        isVisible: false
    },
}

</script>