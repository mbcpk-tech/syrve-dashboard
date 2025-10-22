<template>
    <div style="display: flex;gap: 10px; justify-content: center; align-items: center;">
        <PremiumAnalytics />
        <RevenueCard />
        <TailwindRevenueCard />
    </div>
</template>

<script>
import PremiumAnalytics from './premiumAnalytics.vue';
import RevenueCard from './revenueCard.vue';
import TailwindRevenueCard from './tailwindRevenueCard.vue';


export default {
    components: {
        PremiumAnalytics,
        RevenueCard,
        TailwindRevenueCard
    }
}

</script>