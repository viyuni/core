# UI 组件抽象 TODO

## 概述

将 `apps/control-panel` 中可复用的组件抽象到 `packages/ui`

---

## 🔴 P0 优先级

### 1. Modal 组件

- [x] 创建 `packages/ui/src/components/modal/Modal.vue`
- [x] 支持 `isOpen` v-model
- [x] 标题插槽
- [x] 默认关闭按钮
- [x] Backdrop 点击关闭
- [x] 迁移 `JsonModal.vue` 使用 Modal
- [x] 迁移 `SettingsModal.vue` 使用 Modal

### 2. DebouncedInput 组件

- [x] 创建 `packages/ui/src/components/input/DebouncedInput.vue`
- [x] 支持防抖配置（默认 300ms）
- [x] 支持 v-model
- [x] 迁移 `FilterControls.vue` 使用 DebouncedInput

---

## 🟡 P1 优先级

### 3. DataTable 组件

- [ ] 创建 `packages/ui/src/components/table/DataTable.vue`
- [ ] 抽象 EventList 和 OtherEventList 共同逻辑
- [ ] 支持列配置
- [ ] 支持行点击事件
- [ ] 集成 JsonModal

### 4. useJsonModal Composable

- [ ] 创建 `packages/ui/src/composables/useJsonModal.ts`
- [ ] 抽象 Modal 开关逻辑
- [ ] 抽象数据管理逻辑

---

## 🟢 P2 优先级

### 5. 工具函数迁移

- [ ] 将 `formatJsonPreview` 移至 `packages/shared/src/lib/utils.ts`

### 6. StatusBadge 组件

- [ ] 创建 `packages/ui/src/components/badge/StatusBadge.vue`
- [ ] 支持状态映射配置

---

## 文件清单

### 需要创建的文件

```
packages/ui/src/
├── components/
│   ├── modal/
│   │   ├── Modal.vue          ✅
│   │   └── index.ts           ✅
│   ├── input/
│   │   ├── DebouncedInput.vue ✅
│   │   └── index.ts           ✅
│   ├── table/
│   │   └── DataTable.vue      ⏳
│   │   └── index.ts
│   └── badge/
│       └── StatusBadge.vue    ⏳
│   │   └── index.ts
└── composables/
    └── useJsonModal.ts        ⏳
```

### 需要修改的文件

```
apps/control-panel/src/
├── components/
│   ├── EventList.vue         (使用 DataTable)        ⏳
│   ├── OtherEventList.vue    (使用 DataTable)        ⏳
│   ├── FilterControls.vue    (使用 DebouncedInput)   ✅
│   ├── JsonModal.vue         (使用 Modal)            ✅
│   └── SettingsModal.vue     (使用 Modal)            ✅
└── lib/
    └── utils.ts              (formatJsonPreview 移除) ⏳
```

### packages/ui/src/index.ts 需要导出

```ts
export * from './components/modal/Modal'     ✅
export * from './components/input/DebouncedInput'  ✅
export * from './components/table/DataTable'
export * from './components/badge/StatusBadge'
export * from './composables/useJsonModal'
```
