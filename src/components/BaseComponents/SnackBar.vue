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
    bottom: -10%;
    border-radius: 8px;
    position: absolute;
    transition: 0.5s ease-in-out;
}

.bar.visible {
    bottom: 5vh;
    transition: 0.5s ease-in-out;
}

@media (max-width: 400px) {
    .bar {
        bottom: -100vh;
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