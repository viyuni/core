<script lang="ts" setup>
import type { Spec } from '@json-render/core';
import { StateProvider } from '@json-render/vue';

import { spec } from './spec';
</script>

<template>
  <StateProvider :initial-state="spec ?? {}"> 1 </StateProvider>
</template>
