<template>
  <div class="onlineGallery-modal">
    <xs-drag-modal
      v-model="eagleStore.saveBoxContainer.open"
      teleport=".onlineGallery-child-window-container"
      :modal-init-width="appInfo.window.width > 500 ? 500 : 370"
      :modal-init-height="550"
      @open="handleOpen"
      @closed="handleClosed"
    >
      <!-- s标题部分 -->
      <template #title>
        <h2 style="color: black; font-size: large">选择保存位置</h2>
      </template>
      <!-- s内容主体 -->
      <template #default>
        <el-container style="user-select: none;height:100% !important">
          <!-- f左侧树形列表 -->
          <el-aside
            width="300px"
            show-checkbox
            highlight-current
            style="padding: 5px;height:90% !important"
          >
            <!-- s过滤框 -->
            <el-input
              clearable
              v-model="treeQuery"
              placeholder="输入关键词"
              @input="onQueryChanged"
            />
            <!-- s树形列表本体 -->
            <el-tree-v2
              ref="treeRef"
              :data="treeData"
              :props="treeProps"
              :height="330"
              highlight-current
              :filter-method="treeFilterMethod"
              @node-click="treeNodeClick"
              :item-size="32"
              show-checkbox
            >
              <template #default="{node}">
                <!-- s规则项 -->
                <div
                  v-if="node.key != '#'"
                  class="tree-item tree-item-normal"
                >
                  <el-tooltip
                    :show-after="500"
                    effect="dark"
                    :content="node.label"
                    placement="top"
                  >
                    <span class="tree-node-label">{{ node.label }}</span>
                  </el-tooltip>
                  <!-- <span class="icon-button-deleteRule">
                    <HoverButton></HoverButton>
                  </span> -->
                </div>
              </template>
            </el-tree-v2>
          </el-aside>
          <!-- f主体区域 -->
          <el-main style="padding: 5px"> </el-main>
        </el-container>
      </template>
      <!-- s底部 -->
      <template #footer>
        <var-space :size="[0, 2]">
          <var-button
            type="primary"
            @click="submit"
          >
            提交
          </var-button>
          <var-button
            type="danger"
            @click="eagleStore.saveBoxContainer.open = false"
          >
            取消
          </var-button>
        </var-space>
      </template>
    </xs-drag-modal>
  </div>
</template>

<script setup lang="ts">
  import type {TreeNode, TreeNodeData} from "element-plus/es/components/tree-v2/src/types";

  import {IEagleLibraryData, IEagleFolder} from "@/ts/class/EagleAPI";
  const appInfo = useAppInfoStore();
  const eagleStore = useEagleStore();
  const eagle = eagleStore.eagle;

  //s eagle 远程信息
  const data = ref<IEagleLibraryData>({
    folders: <IEagleFolder[]>[],
    smartFolders: [],
    quickAccess: [],
    tagsGroups: [],
    modificationTime: <number>0,
    applicationVersion: <string>"none",
    library: {
      path: <string>"none",
      name: <string>"none",
    },
  });

  const treeQuery = ref(""); //s 查询(过滤)文本

  //s 树形列表配置信息对象
  const treeProps = ref({
    value: "id",
    label: "name",
    children: "children",
    disabled: "disabled",
  });

  //j 树形列表数据
  const treeData = computed(() => {
    let result = data.value.folders;
    return result;
  });

  //f 开启时的处理
  async function handleOpen() {
    await nextTick();
    await getEagleLibraryInfo();
  }

  //* 挂载时就执行
  onMounted(async () => {
    await nextTick();
    await getEagleLibraryInfo();
  });

  //f 获取libraryInfo
  async function getEagleLibraryInfo() {
    if (!(await eagle.queryAppIsOnline())) {
      console.log("eagle不在线或无法找到");
      return;
    }
    let libraryInfo = await eagle.getLibraryInfo();
    if (libraryInfo) {
      data.value = libraryInfo;
      console.log("eagle libraryInfo 获取成功");
    } else {
      console.log("eagle libraryInfo 获取失败");
    }
  }

  //f 提交结果
  async function submit() {
    console.log("提交结果");
    eagleStore.saveBoxContainer.open = false;
  }

  const treeRef = ref();
  /**
   * f el-input查询框内容变化时触发的回调函数 (定义)
   * @param {string} query 查询(过滤)内容
   * - 由el-input组件返回
   */
  function onQueryChanged(query: string) {
    treeRef.value.filter(query); //s 触发过滤
  }

  /**
   * f 树形节点的过滤方法/逻辑（定义）
   * @param {string} query 过滤文本(查询文本)
   * @param {TreeNode} node 树形节点数据
   * @returns {Boolean}
   * - 返回值为 true 表示 显示
   * - 返回值为 false 表示 隐藏
   */
  function treeFilterMethod(query: string, node: any): boolean {
    return node.name!.includes(query);
  }

  /**
   * f 树形列表节点点击(左键点击)事件
   * @param {TreeNodeData} nodeData 所点击的节点data数据
   * @param {TreeNode} node 所点击的节点node数据
   * @param {MouseEvent} e 鼠标对象
   */
  function treeNodeClick(nodeData: TreeNodeData, node: TreeNode, e: MouseEvent) {
    // console.log("点击了节点", nodeData, node);
  }

  //f 关闭前的处理
  function handleClose() {
    console.log("准备关闭");
  }

  //f 完全关闭后的处理
  function handleClosed() {
    console.log("已关闭");
  }
</script>

<style lang="scss" scoped>
  .onlineGallery-modal {
    //s 遮罩层样式
    & {
      pointer-events: none !important;
    }

    .onlineGallery-dialog {
      &:focus {
        z-index: 1;
      }
    }
  }
</style>
