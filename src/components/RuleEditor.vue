<template>
  <!-- s规则管理器 -->
  <xs-drag-modal
    v-model="ruleEditor.container.open"
    :modal-init-width="800"
    :modal-init-height="550"
    modal-resize="v"
    modal-class="onlineGallery-RuleEditor-modal"
    teleport=".onlineGallery-child-window-container"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <!-- s标题部分 -->
    <template #title>
      <h4 style="color: black; font-size: large">
        规则管理器 (共{{ ruleEditor.data.ruleList.length }}条规则)
      </h4>
    </template>
    <!-- s内容主体 -->
    <template #default>
      <el-container style="user-select: none">
        <!-- f左侧树形列表 -->
        <el-aside
          width="200px"
          show-checkbox
          highlight-current
        >
          <!-- s过滤框 -->
          <el-input
            clearable
            v-model="tree.query"
            placeholder="输入关键词"
            @input="onQueryChanged"
          />
          <!-- s树形列表本体 -->
          <el-tree-v2
            ref="treeRef"
            :data="tree.treeData"
            :props="tree.treeProps"
            :height="400"
            highlight-current
            :current-node-key="info.showRuleId"
            :filter-method="treeFilterMethod"
            @node-click="treeNodeClick"
            :item-size="32"
          >
            <!-- *节点样式 -->
            <template #default="{node}">
              <!-- s规则项 -->
              <div
                v-if="node.key != '#'"
                class="tree-item tree-item-normal"
              >
                <el-image
                  style="width: 24px; aspect-ratio: 1"
                  :src="node.data.iconUrl"
                ></el-image>
                <el-tooltip
                  :show-after="500"
                  effect="dark"
                  :content="node.label"
                  placement="top"
                >
                  <span class="label-ruleName">{{ node.label }}</span>
                </el-tooltip>
                <span class="icon-button-deleteRule">
                  <HoverButton @click.stop="deleteRule(node.key, node)"></HoverButton>
                </span>
              </div>
              <!-- s规则创建按钮 -->
              <div
                v-if="node.key == '#'"
                class="tree-item tree-item-add-button"
              >
                <var-button
                  type="primary"
                  size="small"
                  @click="createRule"
                >
                  <var-space
                    :size="[0, 2]"
                    style="align-items: center"
                  >
                    <span style="display: flex">
                      <i-ep-CirclePlusFilled />
                    </span>
                    <span> {{ node.label }} </span>
                  </var-space>
                </var-button>
                <!-- <el-button
                  type="primary"
                  @click="createRule"
                >
                  <template #icon>
                    <el-icon><i-ep-CirclePlusFilled /></el-icon>
                  </template>
                  <span> {{ node.label }} </span>
                </el-button> -->
              </div>
            </template>
          </el-tree-v2>
        </el-aside>
        <!-- f表单主体 -->
        <el-main style="padding: 5px">
          <RuleForm :formData="(form.realTimeData as MatchRule)" />
        </el-main>
      </el-container>
    </template>
    <!-- s底部 -->
    <template #footer>
      <var-space :size="[0, 4]">
        <var-button
          type="warning"
          @click="pasteRule"
        >
          粘贴规则
        </var-button>
        <var-button
          type="info"
          @click="copyNowRule"
        >
          复制当前规则
        </var-button>
        <var-button
          native-type="submit"
          type="success"
          @click="allSave"
        >
          全部保存
        </var-button>
        <var-button
          type="danger"
          @click="handleClose"
        >
          取消
        </var-button>
      </var-space>
    </template>
  </xs-drag-modal>
</template>

<script setup lang="ts">
  import {MatchRule} from "@/ts/class/MatchRule";
  const {text, isSupported, copy} = useClipboard(); //s 剪切板

  const appInfo = useAppInfoStore(); //s 实例化appInfo数据仓库
  const ruleEditor = useRuleEditorStore(); //s 实例化ruleEditor数据仓库

  //s 用于接收树形列表的实例对象
  const treeRef = ref();

  //s 信息对象
  const info = ruleEditor.info;

  //s 表单信息
  const form = ruleEditor.info.form;

  //s 虚拟列表信息
  const tree = ruleEditor.info.tree;

  //s 数据对象
  const data = ruleEditor.data;

  /**
   *f 导入表单数据 & 显示
   * @param {MatchRule} ruleData 留空 - 表示还原表单到初始状态
   */
  async function inputFormData(ruleData?: MatchRule | null) {
    if (ruleData) {
      if (!ruleData.status.editing && !ruleData.status.isNewCreated) {
        ruleData.createBackup(); //s 创建备份
        ruleData.status.editing = true; //s 标记为编辑ing
      }
      ruleData.status.isNewCreated = false; //s 只要查看过都不再是新创建的规则
      form.realTimeData = ruleData; //s 将待编辑rule对象传递给表单
      info.showRuleId = ruleData.id; //s 同步左侧树形列表激活的位置
      form.activeName = "main"; //s 标签页位置初始化
    } else {
      form.realTimeData = undefined;
      info.showRuleId = "-1"; //s 同步左侧树形列表激活的位置
    }
  }

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
    return node.label.includes(query);
  }

  /**
   * f 树形列表节点点击(左键点击)事件
   * @param {TreeNodeData} nodeData 所点击的节点data数据
   * @param {TreeNode} node 所点击的节点node数据
   * @param {MouseEvent} e 鼠标对象
   */
  function treeNodeClick(nodeData: any, node: any, e: MouseEvent) {
    // console.log(node);
    const ruleIndex = data.ruleList.findIndex((item) => item.id === nodeData.id);

    if (ruleIndex >= 0) {
      const rule = data.ruleList[ruleIndex];
      inputFormData(<any>rule);
    }
  }

  /**
   * f 创建规则
   */
  async function createRule() {
    const rule = await ruleEditor.createRule();
    //s 激活表单
    inputFormData(rule);
  }

  /**
   * f 删除规则
   * @param {string} id 要删除的规则的id
   * @param {*} node
   */
  async function deleteRule(id: string, node: any) {
    const ruleName = node.label;
    ElMessageBox.confirm(`确认删除规则 “${ruleName}” ？`, "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      lockScroll: false,
    })
      .then(() => {
        ruleEditor.deleteRule(id);
        inputFormData();
        ElMessage({
          type: "success",
          grouping: true,
          center: true,
          offset: 120,
          message: `规则 “${ruleName}” 删除成功!`,
        });
      })
      .catch(() => {});
  }

  //f 复制当前规则
  async function copyNowRule() {
    if (form.realTimeData) {
      const content = form.realTimeData.getJsonData() as string;
      await copy(content);
      ElMessage({
        type: "success",
        // showClose: true,
        grouping: true,
        center: true,
        duration: 1000,
        offset: 120,
        message: h("p", {style: "display:flex;gap:10px"}, [
          h("i", {style: "color: teal"}, "(规则)" + form.realTimeData?.main.name),
          h("span", {style: "color: black"}, "复制成功！"),
        ]),
      });
    } else {
      ElMessage({
        type: "warning",
        // showClose: true,
        grouping: true,
        center: true,
        duration: 1000,
        offset: 120,
        message: `请选择一个要复制的规则!`,
      });
    }
  }

  //f 粘贴规则
  async function pasteRule() {
    //s 从剪切板获取文本
    let text = await getClipBoardText();
    //s 尝试转为对象
    let ruleObj: Object | null = null;
    try {
      ruleObj = JSON.parse(text);
    } catch (err) {
      // console.log("从剪切板获取rule对象文本 - 失败");
    }
    //s 通过对象创建规则
    let rule: MatchRule | null = null;
    if (ruleObj) {
      rule = await ruleEditor.createRule(ruleObj);
    }
    //s 判断是否创建成功
    if (!rule) {
      ElMessage({
        type: "warning",
        grouping: true,
        center: true,
        offset: 120,
        message: `剪切板中没有合适的规则!`,
      });
    } else {
      ElMessage({
        type: "success",
        grouping: true,
        center: true,
        offset: 120,
        message: `规则粘贴成功`,
      });
    }
  }

  //f 打开时的处理
  function handleOpen() {
    //s 初始化窗口
    initDialog();
    console.log("规则管理器 - Open");
  }

  //f 关闭前的处理(不保存关闭)
  async function handleClose() {
    ElMessageBox.confirm("确认关闭？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      lockScroll: false,
    })
      .then(() => {
        ruleEditor.container.open = false; //! 关闭窗口
      })
      .catch(() => {});
  }

  //f 关闭后的处理(任何关闭操作)
  async function handleClosed() {
    initDialog();
    console.log("规则管理器 - Close");
  }

  /**
   * f 初始化窗口
   */
  async function initDialog() {
    form.activeName = "main";
    inputFormData();
  }

  //f 全部保存操作
  async function allSave() {
    //s	存储修改后的最新数据到脚本的用户存储中
    await ruleEditor.saveRuleToLocation();
    ruleEditor.container.open = false; //! 关闭窗口
  }
</script>

<style lang="scss" scoped>
  //s tree-item通用样式
  .tree-item {
    & {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      overflow: hidden !important;
    }

    //s 普通tree-item
    &.tree-item-normal {
      // position: relative !important;
      flex-grow: 1;
      //s 名称样式
      > .label-ruleName {
        flex-grow: 1;
        padding-left: 4px;
        //! 防止文本换行
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      //s 规则删除 - 图标按钮
      > .icon-button-deleteRule {
        position: relative;
        right: 2px;
        width: 24px;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        color: red;
        font-size: medium;
      }
    }

    //s 增加按钮的tree-item
    &.tree-item-add-button {
      > button {
        width: 100%;
      }
    }
  }
</style>

<style lang="scss"></style>
