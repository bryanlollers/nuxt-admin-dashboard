<script setup>
defineProps({
  projectCount: Number,
  averageProgress: Number,
  completionRate: Number,
  teamCount: Number,
})
</script>

<template>
  <section class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <MetricCard
      label="Projects tracked"
      :value="String(projectCount)"
      change="Selected range"
      :positive="true"
      icon="P"
      tint="violet"
      :spark="[18, 22, 20, 30, 28, 35, 42]"
    />
    <MetricCard
      label="Average progress"
      :value="`${averageProgress}%`"
      change="Across projects"
      :positive="true"
      icon="↗"
      tint="blue"
      :spark="[22, 25, 29, 27, 34, 37, 42]"
    />
    <MetricCard
      label="Task completion"
      :value="`${completionRate}%`"
      change="Current workload"
      :positive="completionRate >= 50"
      icon="✓"
      tint="green"
      :spark="[20, 26, 24, 32, 30, 36, 40]"
    />
    <MetricCard
      label="Team members"
      :value="String(teamCount)"
      change="Across departments"
      :positive="true"
      icon="T"
      tint="orange"
      :spark="[17, 20, 25, 24, 31, 34, 39]"
    />
  </section>
</template>
