<template>
  <div class="low-code-editor-wrapper">
    <LowCodeEditor
      :menu-data="menuData"
      @node-click="nodeClick"
      @get-graph="getGraph"
      @play="play"
    ></LowCodeEditor>
    <div class="low-code-editor-settings">
      <a-card :style="{ width: '250px', height: '100%' }" title="参数配置面板">
        {{ selectedNode }}
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // 业务层，仅处理业务数据，请求都放在该组件
  import { reactive, ref } from 'vue';
  import { Graph } from '@antv/x6';
  import { MenuGroup } from './components/graph/types';
  import LowCodeEditor from './components/low-code-editor.vue';

  const selectedNode = ref('');

  const menuData = reactive<MenuGroup[]>([
    {
      name: 'dataTest',
      title: '数据治理',
      children: [
        {
          id: 'dataMerge',
          img: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
          name: '数据合并',
        },
        {
          id: 'dataFilter',
          img: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
          name: '数据过滤',
        },
      ],
    },
    {
      name: 'dataAnalysis',
      title: '数据分析',
      children: [
        {
          id: 'dataRelative',
          img: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
          name: '关联分析',
        },
        {
          id: 'dataCluster',
          img: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
          name: '聚类分析',
        },
      ],
    },
  ]);
  const graph = ref<any>(null);
  const getGraph = (instance: Graph) => {
    graph.value = instance;
  };

  const nodeClick = (node: any) => {
    selectedNode.value = `你点击了${node?.cell?.store?.data?.data?.label}`;
  };

  const play = (graphJSON: any) => {
    // -------------------------测试数据开始---------------------------------------
    const nodes = graphJSON?.cells?.filter((cell: any) => {
      return cell?.shape !== 'edge';
    });
    let index = 0;

    const testData = () => {
      if (index > 0) {
        const lastNode = graph.value.getCellById(nodes[index - 1]?.id);
        const data = lastNode.getData();
        lastNode.setData({
          ...data,
          status: 'success',
        });
      }
      if (index === nodes.length - 1) {
        const node = graph.value.getCellById(nodes[index]?.id);
        const data = node.getData();
        node.setData({
          ...data,
          status: 'failed',
        });
        return;
      }
      const node = graph.value.getCellById(nodes[index]?.id);
      const data = node.getData();
      node.setData({
        ...data,
        status: 'running',
      });
      index += 1;
    };

    testData();

    const timer = setInterval(() => {
      if (index < nodes.length) {
        testData();
      } else {
        testData();
        clearInterval(timer);
      }
    }, 3000);

    // -------------------------测试数据结束---------------------------------------
  };
</script>

<style scoped lang="less">
  .low-code-editor-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .low-code-editor-settings {
      width: 300px;
    }
  }
</style>
