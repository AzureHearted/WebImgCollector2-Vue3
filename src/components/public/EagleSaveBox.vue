<template>
  <div class="onlineGallery-RuleEditor-modal">
    <!-- s规则管理器 -->
    <el-dialog
      style="pointer-events: auto !important; padding: 0px"
      v-model="eagleStore.saveBoxContainer.open"
      :width="appInfo.window.width > 800 ? '800px' : '100%'"
      :modal="false"
      :close-on-click-modal="false"
      :lock-scroll="false"
      destroy-on-close
      draggable
      :before-close="handleClose"
      @open="handleOpen"
      @closed="handleClosed"
    >
      <!-- s标题部分 -->
      <template #header>
        <span style="color: black; font-size: large">选择保存位置</span>
      </template>
      <!-- s内容主体 -->
      <template #default>
        <el-container style="user-select: none">
          <!-- f左侧树形列表 -->
          <el-aside
            width="400px"
            show-checkbox
            highlight-current
            style="padding: 5px"
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
              :height="400"
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
                    <span class="label-ruleName">{{ node.label }}</span>
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
        <el-button
          type="primary"
          @click="submit"
        >
          提交
        </el-button>
        <el-button @click="eagleStore.saveBoxContainer.open = false">取消</el-button>
      </template>
    </el-dialog>
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

  //s 树形列表数据
  const tree = reactive({
    query: "", //s 查询(过滤)文本
  });

  const treeQuery = ref("");

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

<style lang="scss" scoped></style>
