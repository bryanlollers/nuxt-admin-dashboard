<script setup>
const metrics = [
  {
    label: 'Customers',
    value: '1,248',
    change: '12.8%',
    positive: true,
    icon: 'C',
    tint: 'violet',
    spark: [18, 24, 20, 30, 25, 39, 35],
  },
  {
    label: 'Projects',
    value: '86',
    change: '8.2%',
    positive: true,
    icon: '♙',
    tint: 'orange',
    spark: [18, 20, 30, 26, 31, 36, 42],
  },
  {
    label: 'Open tasks',
    value: '142',
    change: '2.4%',
    positive: true,
    icon: '▧',
    tint: 'blue',
    spark: [20, 30, 25, 28, 33, 31, 39],
  },
  {
    label: 'Completed',
    value: '1,026',
    change: '4.1%',
    positive: false,
    icon: '✓',
    tint: 'green',
    spark: [40, 35, 39, 31, 33, 28, 32],
  },
]
</script>

<template>
  <section
    class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    aria-label="Business metrics"
  >
    <MetricCard v-for="item in metrics" :key="item.label" v-bind="item" />
  </section>
</template>
