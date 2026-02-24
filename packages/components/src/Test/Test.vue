<template>
  <div class="wrapper">
    <div class="content">
      <div class="title">测试组件</div>
      <div class="num">
        <span>Number 1</span>
        <input v-model="num1" type="number" data-testid="num1" />
      </div>
      <div class="num">
        <span>Number 2</span>
        <input v-model="num2" type="number" data-testid="num2" />
      </div>
      <div class="num">
        <span data-testid="num3">result:{{ num3 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { sum } from '@monorepo/utils';

  const num1 = ref(1);
  const num2 = ref(2);
  const num3 = ref(0);
  onMounted(() => {
    num3.value = sum(num1.value, num2.value);
  });
  watch(
    () => [num1.value, num2.value],
    ([n1, n2]) => {
      console.log(n1, n2, num3.value);
      num3.value = sum(n1 || 0, n2 || 0);
      console.log(n1, n2, num3.value);
    }
  );
  // const num3 = computed(() => {
  //     return sum(num1.value, num2.value);
  // });
</script>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
