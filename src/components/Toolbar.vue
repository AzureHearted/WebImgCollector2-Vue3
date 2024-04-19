<template>
  <div class="onlineGallery-toolBar">
    <!-- s数量统计 -->
    <el-statistic
      class="statistic-container"
      :value="cardsStore.filterCards.length"
      :prefix="cardsStore.selectedCards.length.toString() + ' /'"
      :suffix="'/ ' + cardsStore.allValidCards.length.toString()"
    >
      <template #title>
        <div style="display: flex; justify-content: center">选中 / 可见 / 总数</div>
      </template>
    </el-statistic>
    <!-- s过滤器 -->
    <div class="filter-container">
      <!-- s尺寸过滤 -->
      <div class="filter-size">
        <div class="width filter-size-row">
          <span class="filter-size-label">宽度</span>
          <el-slider
            :debounce="1000"
            class="filter-size-slider"
            label="宽度"
            v-model="filter.size.width.value"
            range
            range-start-label="0"
            :min="0"
            :max="filter.size.max"
            :marks="filter.size.marks"
            placement="right"
          />
        </div>
        <div class="height filter-size-row">
          <span class="filter-size-label">高度</span>
          <el-slider
            :debounce="1000"
            class="filter-size-slider"
            label="高度"
            v-model="filter.size.height.value"
            range
            :min="0"
            :max="filter.size.max"
            :marks="filter.size.marks"
            placement="right"
          />
        </div>
      </div>
      <!-- s格式过滤 -->
      <SelectorFormat
        :options="filter.formats.options"
        :value="filter.formats.value"
        @update="(val) => (filter.formats.value = val)"
      />
    </div>
    <!-- s列表控制 -->
    <div class="list-control-container">
      <!-- s最大显示行数控制条 -->
      <div class="list-control-column">
        <span class="list-control-column-label">行数</span>
        <el-input-number
          class="list-control-column-input-number"
          :min="1"
          :max="4"
          :step="1"
          step-strictly
          controls-position="right"
          @wheel.passive="showColum_Wheel"
          v-model="toolbar.listControl.showColumn"
        ></el-input-number>
      </div>
      <div class="list-control-sort-method">
        <span class="list-control-sort-method-label">排序</span>
        <el-select-v2
          class="list-control-sort-method-select"
          v-model="listControl.sortMethod.value"
          :options="listControl.sortMethod.options"
          placeholder="排序方法"
        ></el-select-v2>
      </div>
    </div>
    <!-- s预设规则选择 -->
    <div class="rule-selector-container">
      <span class="rule-selector-label">预设</span>
      <el-select-v2
        class="rule-selector-select"
        v-model="ruleSelector.value"
        filterable
        :options="ruleSelector.option"
        placeholder="选择当前预设"
      >
        <template #empty> 11 </template>
        <template #default="node">
          <div class="rule-item">
            <el-image
              class="rule-icon"
              :src="node.item.iconUrl"
            >
            </el-image>
            {{ node.item.label }}
          </div>
        </template>
      </el-select-v2>
    </div>
    <!-- s按钮组 -->
    <el-button-group class="button-group-container">
      <!-- s刷新按钮 -->
      <el-button
        type="primary"
        @click="refresh"
        :loading="loading.value"
      >
        刷新
        <template #icon>
          <el-icon><i-ep-RefreshRight /></el-icon>
        </template>
      </el-button>
      <!-- s全选按钮 -->
      <el-button
        type="primary"
        @click="allSelectSwitch"
        :loading="loading.value"
        :icon="toolbar.listControl.allSelected ? CheckboxAll : CheckboxNone"
      >
        {{ toolbar.listControl.allSelected ? "取消全选" : "全部选中" }}
      </el-button>
    </el-button-group>

    <!-- s下载按钮 - 下拉菜单 -->
    <el-dropdown type="primary">
      <el-button
        type="primary"
        @dblclick="downloadSelected"
        :loading="loading.value"
      >
        下载选中
        <template #icon>
          <el-icon><i-ep-Download /></el-icon>
        </template>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="eagleStore.saveBoxContainer.open = true"
            >下载到Eagle</el-dropdown-item
          >
        </el-dropdown-menu>
        <el-dropdown-menu>
          <el-dropdown-item @click="getJsonSelected">获取选中项的Json信息</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu>
          <el-dropdown-item @click="getUrlSelected">获取选中项的链接</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu>
          <el-dropdown-item @click="getImgUrlSelected">获取选中项的图链</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- s[其他] - 下拉菜单 -->
    <el-dropdown>
      <el-button type="primary">
        <template #icon>
          <el-icon><i-ep-MoreFilled /></el-icon>
        </template>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- s规则管理按钮 -->
          <el-dropdown-item @click="ruleEditor.container.open = true">
            <el-icon><i-ep-Management /></el-icon>
            规则管理
          </el-dropdown-item>
          <!-- s设置菜单入口按钮 -->
          <el-dropdown-item @click="">
            <el-icon><i-ep-Tools /></el-icon>
            设置
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
  import {ITask} from "@/ts/public";
  import CheckboxNone from "@/icon/checkbox-blank-line.svg?component"; //? svg导入
  import CheckboxAll from "@/icon/checkbox-fill.svg?component"; //? svg导入

  const appInfo = useAppInfoStore(); //s 实例化appInfo数据仓库
  const cardsStore = useCardsStore(); //s 实例化cardsStore数据仓库
  const toolbar = useToolBarStore(); //s 实例化Toolbar数据仓库
  const ruleEditor = useRuleEditorStore(); //s 实例化ruleEditor数据仓库
  const eagleStore = useEagleStore(); //s 实例化eagle api数据仓库

  //s 进度条
  const loading = appInfo.loading;

  //s 过滤器参数
  const filter = toolbar.filter;

  //s list控制项
  const listControl = toolbar.listControl;

  //s 预设规则选择器
  const ruleSelector = toolbar.ruleSelector;

  //f listControl - 显示行数 - 滚轮事件
  async function showColum_Wheel(e: WheelEvent) {
    if (e.deltaY < 0) {
      if (toolbar.listControl.showColumn < 4) toolbar.listControl.showColumn++;
    } else {
      if (toolbar.listControl.showColumn > 1) toolbar.listControl.showColumn--;
    }
  }

  //f 刷新函数
  async function refresh() {
    if (ruleSelector.value === "#") {
      await cardsStore.getCard(ruleEditor.defaultRule);
    } else {
      const ruleIndex = ruleEditor.data.ruleList.findIndex(
        (rule) => rule.id === ruleSelector.value
      );
      const rule = ruleEditor.data.ruleList[ruleIndex];
      if (rule) {
        await cardsStore.getCard(rule);
      } else {
        ElMessage({
          message: "请选择预设后再尝试此操作",
          type: "info",
          showClose: true,
          grouping: true,
          offset: 120,
        });
      }
    }
  }

  //f 全选切换
  async function allSelectSwitch() {
    toolbar.listControl.allSelected = !toolbar.listControl.allSelected; //s 全选标识符取反
    appInfo.loading.value = true;
    //s 刷新结果
    cardsStore.filterCards.forEach((card) => (card.selected = toolbar.listControl.allSelected));
    appInfo.loading.value = false;
  }

  //f 下载选中项
  async function downloadSelected() {
    const downloadCards = cardsStore.selectedCards;
    if (!downloadCards.length) {
      ElMessage({
        message: "请选择要下载的数据",
        type: "info",
        showClose: true,
        grouping: true,
        offset: 120,
      });
      return;
    }
    //s 初始化进度条
    loading.init();
    //s 创建队列对象
    const taskQueue = new TaskQueue({showMessage: false, max: 5, delay: 100});
    //s 创建zip容器
    let zipContainer: JSZipType = new JSZip();
    
    let finallyCount = 0;
    //s 创建任务清单
    const taskList: ITask[] = downloadCards.map((card, index) => {
      //s 队列任务定义
      return {
        index: index,
        //s 主要执行函数(定义)
        main: async () => {
          //s [1]获取blob
          const url = card.linkUrl;
          let blob: Blob | null = await getBlobByUrlAuto(url);
          //s [2]判断是否获取成功 - 成功-> [3.1] , 失败-> [3.0]
          if (blob) {
            //s [3.1]后缀名处理
            let ext = "";
            if (!isEmpty(card.linkUrlExt)) {
              ext = "." + card.linkUrlExt;
            }
            let fix = strAutofill(index.toString(), 0, 4);
            //s [3.2]存入zip容器
            zipContainer.file(`${fix} - ${card.name}${ext}`, blob);
            // zipContainer.file(`${card.name}`, blob);

            return [card.name, "处理成功!"];
          } else {
            //s [3.0]失败
            return [card.name, "处理失败"];
          }
          //s [4]处理结束blob释放
          blob = null;
        },
        //s 单次执行完成后的回调(定义)
        callback: async (res, index) => {
          finallyCount++;
          loading.percentage = (finallyCount / downloadCards.length) * 100;
        },
      } as ITask;
    });
    //s 将任务清单push进队列
    taskQueue.pushTask(taskList);
    //s 全部执行完成后的回调
    taskQueue.finallyCallback = async () => {
      ElMessage({
        message: "下载成功! (正在生成压缩包)",
        type: "success",
        showClose: true,
        grouping: true,
        offset: 120,
      });
      loading.init();
      //s 生成压缩包
      console.log("准备生成压缩包", zipContainer);
      let zip: Blob | null = await zipContainer.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
        },
        (metadata) => {
          // console.log(metadata.percent);
          loading.percentage = metadata.percent;
        }
      );
      console.log("压缩包生成成功", zip);

      // console.log(zip);
      //s 下载压缩包
      //! 获取标题
      let zipName: string;
      let titles = [
        document.title,
        ...[...document.querySelectorAll("h1")].map((dom) => dom.innerText),
        ...[...document.querySelectorAll("title")].map((dom) => dom.innerText),
      ]
        .filter((title) => !isEmpty(title))
        .map((title) => title.replace("\\", "-").replace(",", "_"));
      if (titles.length) {
        zipName = titles[0];
      } else {
        zipName = getNameByUrl(decodeURI(location.href));
      }
      console.log("压缩包名称:", zipName);
      await saveAs(zip, `${zipName}.zip`);
      //s 清除压缩包
      zip = null;
      //s 重置进度条
      loading.percentage = 100;
      loading.reset();
    };
    //s 开始执行
    taskQueue.run();
  }
  //f 获取选中项链接
  async function getUrlSelected() {
    const selectedCards = cardsStore.selectedCards;
    // console.log(downloadCards);
    if (!selectedCards.length) {
      ElMessage({
        message: "请选择要获取的项目",
        type: "info",
        showClose: true,
        grouping: true,
        offset: 120,
      });
      return;
    }
    const urls: string[] = selectedCards.map((card) => card.linkUrl);

    navigator.clipboard.writeText(urls.join("\n"));
  }
  //f 获取选中项图链
  async function getImgUrlSelected() {
    const selectedCards = cardsStore.selectedCards;
    // console.log(downloadCards);
    if (!selectedCards.length) {
      ElMessage({
        message: "请选择要获取的项目",
        type: "info",
        showClose: true,
        grouping: true,
        offset: 120,
      });
      return;
    }
    const urls: string[] = selectedCards.map((card) => card.picUrl);
    // console.log(urls);
    navigator.clipboard.writeText(urls.join("\n"));
  }
  //f 获取选中项的Json信息
  async function getJsonSelected() {
    const selectedCards = cardsStore.selectedCards;
    // console.log(downloadCards);
    if (!selectedCards.length) {
      ElMessage({
        message: "请选择要获取的项目",
        type: "info",
        showClose: true,
        grouping: true,
        offset: 120,
      });
      return;
    }
    let originalUrl = window.location.href;
    const jArray = selectedCards.map((card, index) => {
      return {
        url: card.linkUrl,
        name: card.name,
        website: originalUrl,
        tags: [],
        annotation: getNameByUrl(originalUrl),
        headers: {
          referer: getOriginByUrl(originalUrl),
        },
      };
    });
    // console.log(urls);
    navigator.clipboard.writeText(JSON.stringify(jArray));
  }
</script>

<style lang="scss" scoped>
  * {
    font-family: win-bug-omega, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell,
      "Noto Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif !important;
  }

  $my-font-family: win-bug-omega, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell,
    "Noto Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;

  .onlineGallery-toolBar {
    & {
      position: relative;
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-flow: row wrap;
      justify-content: start;
      align-items: center;
      // align-items:center;

      gap: 10px;

      // color: black;

      /* 禁止选中文字 */
      user-select: none;
      /* 禁止图文拖拽 */
      -webkit-user-drag: none;
      @media (max-width: 500px) {
        gap: 4px;
        margin-top: 4px;
        margin-bottom: 8px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }

    // *统计组件样式
    .statistic-container {
      flex-shrink: 0;
      width: 140px;
      font-size: 14px !important;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      @media (max-width: 500px) {
        width: 100%;
        align-items: start;
      }
    }

    // *过滤器控制条样式
    .filter-container {
      & {
        width: fit-content;
        width: 220px;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        @media (max-width: 500px) {
          align-items: start;
          gap: 2px;
        }
      }

      //s 尺寸过滤器
      .filter-size {
        & {
          position: relative;
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          @media (max-width: 500px) {
            gap: 2px;
          }
        }
        //s 每一行的样式
        .filter-size-row {
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          gap: 8px;
          justify-content: start;
          align-items: center;
          .filter-size-slider {
            flex-grow: 1;
            padding-right: 10px;
          }
          .filter-size-label {
            margin: 0;
            white-space: nowrap; //s 防止换行
            font-size: 16px !important;
            color: black !important;
          }
        }
      }

      //s 格式过滤器
      .filter-format {
        & {
          position: relative;
          width: 100%;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .format-select {
          flex-grow: 1;
        }
        .format-label {
          margin: 0;
          text-align: center;
          white-space: nowrap; //s 防止换行
          font-size: 16px !important;
        }
      }
    }

    // *列表控制区
    .list-control-container {
      & {
        position: relative;
        width: fit-content;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: start;
        gap: 8px;
        @media (max-width: 500px) {
          flex-flow: row;
        }
      }

      // *缩放控制条样式
      .list-control-column {
        & {
          position: relative;
          width: fit-content;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .list-control-column-input-number {
          width: 80px;
        }
        .list-control-column-label {
          margin: 0;
          text-align: center;
          white-space: nowrap; //s 防止换行
          font-size: 16px !important;
        }
      }
      // *排序方式选择器
      .list-control-sort-method {
        & {
          position: relative;
          width: fit-content;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .list-control-sort-method-select {
          width: 120px;
        }
        .list-control-sort-method-label {
          margin: 0;
          text-align: center;
          white-space: nowrap; //s 防止换行
          font-size: 16px !important;
        }
      }
    }

    //s 按钮组样式
    .button-group-container {
      width: fit-content;
    }

    //s 规则选择器样式
    .rule-selector-container {
      & {
        position: relative;
        width: fit-content;
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }
      .rule-selector-select {
        width: 160px;
      }
      .rule-selector-label {
        margin: 0;
        text-align: center;
        white-space: nowrap; //s 防止换行
        font-size: 16px !important;
      }
    }
  }

  //s 规则项样式
  .rule-item {
    height: 100% !important;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: black !important;
  }

  //s 规则图标样式
  .rule-icon {
    flex-shrink: 0;
    width: 16px !important;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
