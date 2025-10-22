import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)


app.config.globalProperties.$colors = [
    "rgb(244, 67, 54)",    // Red
    "rgb(233, 30, 99)",    // Pink
    "rgb(156, 39, 176)",   // Purple
    "rgb(103, 58, 183)",   // Deep Purple
    "rgb(63, 81, 181)",    // Indigo
    "rgb(33, 150, 243)",   // Blue
    "rgb(3, 169, 244)",    // Light Blue
    "rgb(0, 188, 212)",    // Cyan
    "rgb(0, 150, 136)",    // Teal
    "rgb(76, 175, 80)",    // Green
    "rgb(139, 195, 74)",   // Light Green
    "rgb(205, 220, 57)",   // Lime
    "rgb(255, 235, 59)",   // Yellow
    "rgb(255, 193, 7)",    // Amber
    "rgb(255, 152, 0)",    // Orange
    "rgb(255, 87, 34)"     // Deep Orange
];


app.mount('#app')
