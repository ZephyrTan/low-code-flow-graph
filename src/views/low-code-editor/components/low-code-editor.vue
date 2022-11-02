<template>
  <div class="low-code-editor-wrapper">
    <div id="stencil" class="low-code-stencil"></div>
    <div class="low-code-container">
      <div class="low-code-toolbar">
        <a-button @click="toolbarClick('play')">
          <template #icon>
            <icon-play-arrow />
          </template>
          运行
        </a-button>
        <a-button @click="toolbarClick('playSelect')">
          <template #icon>
            <icon-play-circle />
          </template>
          选中节点运行
        </a-button>
        <a-button @click="toolbarClick('pause')">
          <template #icon>
            <icon-pause />
          </template>
          暂停
        </a-button>
        <a-button @click="toolbarClick('refresh')">
          <template #icon>
            <icon-refresh />
          </template>
          刷新
        </a-button>
        <a-button :disabled="!canUndo" @click="toolbarClick('undo')">
          <template #icon>
            <icon-undo />
          </template>
          撤销
        </a-button>
        <a-button :disabled="!canRedo" @click="toolbarClick('redo')">
          <template #icon>
            <icon-redo />
          </template>
          还原
        </a-button>
        <a-button @click="toolbarClick('clear')">
          <template #icon>
            <icon-eraser />
          </template>
          清空
        </a-button>
        <a-button @click="toolbarClick('save')">
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </div>
      <div id="graph" class="low-code-graph"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue';
  import { Graph, Addon } from '@antv/x6';
  import FlowGraph from './graph/flow-graph';

  const props = defineProps({
    menuData: Array,
  });

  const emits = defineEmits([
    'getGraph',
    'nodeClick',
    'play',
    'playSelect',
    'pause',
    'refresh',
    'redo',
    'undo',
    'clear',
  ]);
  // 是否可以还原
  const canRedo = ref<boolean>(false);
  // 是否可以撤销
  const canUndo = ref<boolean>(false);
  // 以下均为x6的对象
  let history: any = null;
  let graph: Graph;
  let stencil: Addon.Stencil;

  /**
   * 初始化节点点击事件
   */
  const initNodeClickEvent = () => {
    graph.on('node:click', (node) => {
      emits('nodeClick', node);
    });
  };
  /**
   * 初始化历史记录变化事件监听
   */
  const initHistoryStore = () => {
    history = graph.history;
    history.on('change', () => {
      canRedo.value = history.canRedo();
      canUndo.value = history.canUndo();
    });
  };
  /**
   * 初始化流程图绘制
   */
  const initFlowGraph = () => {
    graph = FlowGraph.create(document.getElementById('graph') as HTMLElement);
    stencil = FlowGraph.initStencil(
      document.getElementById('stencil') as HTMLElement,
      props.menuData as any[]
    );
    emits('getGraph', graph);
    initNodeClickEvent();
    initHistoryStore();
  };
  // 工具栏类型及其事件处理回调
  const optTypes = {
    // 播放
    play: () => {
      // 将图谱内容的节点和边转成json结构
      const graphJSON = graph.toJSON();
      emits('play', graphJSON);
    },
    playSelect: () => {
      emits('playSelect');
    },
    // 暂停
    pause: () => {
      emits('pause');
    },
    // 刷新
    refresh: () => {
      emits('refresh');
    },
    // 复原
    redo: () => {
      graph.redo();
      emits('redo');
    },
    // 回撤
    undo: () => {
      graph.undo();
      emits('undo');
    },
    // 清空
    clear: () => {
      graph.clearCells();
      emits('clear');
    },
    // 保存
    save: () => {
      // 将图谱内容的节点和边转成json结构
      const graphJSON = graph.toJSON();
      emits('play', graphJSON);
    },
  };

  /**
   * 工具栏点击事件处理
   * @param type
   */
  const toolbarClick = (type: any) => {
    // eslint-disable-next-line no-unused-expressions
    optTypes[type] && optTypes[type]();
  };

  onMounted(() => {
    initFlowGraph();
  });
</script>

<style lang="less">
  .low-code-editor-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 8px 10px;
    background-color: var(--color-fill-2);

    .low-code-stencil {
      position: relative;
      width: 220px;
      height: 100%;
      background-color: var(--color-bg-3);
    }

    .low-code-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 100%;
      background-color: var(--color-bg-3);

      .low-code-toolbar {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;

        button {
          margin-left: 5px;
        }
      }

      .low-code-graph {
        flex: 1;
      }

      .x6-widget-minimap {
        position: absolute;
        right: 0;
      }
    }
  }
</style>
