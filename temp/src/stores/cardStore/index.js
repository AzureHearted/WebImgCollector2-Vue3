import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
// 导入类
import Card from "./class/Card";
import { TaskQueue } from "@/utils/taskQueue"; // 任务队列
// 导入工具
import getCard from "./utils/get-cards";
import { getNameByUrl } from "@/utils/common";
// 导入网络工具请求
import { getBlobByUrlAuto } from "@/utils/http";
// 导入打包和保存工具
import JSZip from "jszip";
import { saveAs } from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存
// 导入其他仓库
import { useLoadingStore } from "@/stores";
export default defineStore("cardStore", () => {
    const loadingStore = useLoadingStore();
    // 数据定义
    const data = reactive({
        cardList: [], //s 卡片列表
        // 所有匹配到的链接集合
        urlSet: new Set(),
        // 所有匹配到的dom集合
        domSet: new Set(),
        // 所有被排除的卡片集合
        excludeIdSet: new Set(),
    });
    // 卡片数据信息定义，用于过滤。
    const info = reactive({
        size: {
            width: ref([0, 2000]), //宽度范围
            height: ref([0, 2000]), //高度范围
        },
    });
    // 过滤器
    const filters = reactive({
        size: {
            width: ref([350, info.size.width[1]]), //宽度过滤器
            height: ref([350, info.size.height[1]]), //高度过滤器
        },
    });
    // 有效的卡片
    const validCardList = computed(() => {
        return data.cardList.filter((x) => !!x);
    });
    // 计算属性定义
    // j 过滤后的卡片
    const filteredCardList = computed(() => {
        // 后续添加处理逻辑，例如过滤、排序等操作。
        return data.cardList.filter((x) => {
            const isMatch = !!x && // 过滤排除
                !data.excludeIdSet.has(x.id) && // 过滤被排除的项
                x.source.meta?.width >= filters.size.width[0] &&
                x.source.meta?.width <= filters.size.width[1] &&
                x.source.meta?.height >= filters.size.height[0] &&
                x.source.meta?.height <= filters.size.height[1];
            if (!isMatch) {
                // 如果不匹配的需要将选中状态设置为false
                x.isSelected = false;
                // console.log("未被选中");
            }
            return isMatch;
        });
    });
    // 获取页面资源
    async function getPageCard() {
        loadingStore.start();
        // 记录开始前的cardList长度
        await getCard({
            region: {
                enable: false,
                selector: "",
            },
            source: {
                selector: "img",
                infoType: "property",
                name: "src",
            },
            preview: {
                origin: "source",
                enable: false,
                selector: "",
                infoType: "property",
                name: "src",
            },
            description: {
                origin: "source",
                enable: false,
                selector: "",
                infoType: "property",
                name: "src",
            },
            filter: {
                formats: [],
                width: [350, 2000],
                height: [350, 2000],
            },
        }, async (doms) => {
            // console.log("匹配到的DOM", doms);
            loadingStore.update(0, doms.length);
            return doms;
        }, async (card, index, dom, addCard) => {
            loadingStore.update(index + 1); // 刷新进度
            // 判断该卡片中的链接是否已经存在于集合中，如果存在则不添加到卡片列表中。
            if (card.source.meta.valid && !data.urlSet.has(card.source.url)) {
                // console.log(`第${oldLength + index}张卡片获取成功!`, card);
                if (dom) {
                    data.domSet.add(dom); // 记录dom用于排序
                }
                data.urlSet.add(card.source.url); // 添加到链接集合中
                // data.cardList.push(card); // 添加到卡片列表中。
                data.cardList[index] = card; // 添加到卡片列表中。
                updateMaxSize(card.source.meta.width, card.source.meta.height); // 更新最大宽高。
                await addCard(); //执行回调函数
            }
        });
        loadingStore.end();
    }
    // 更新最大宽高
    function updateMaxSize(width, height) {
        info.size.width[1] = Math.max(info.size.width[1], width ? width : 0); // 更新最大宽度。
        info.size.height[1] = Math.max(info.size.height[1], height ? height : 0); // 更新最大高度。
        filters.size.width[1] = info.size.width[1]; // 更新过滤器最大宽度。
        filters.size.height[1] = info.size.height[1]; // 更新过滤器最大宽度。
    }
    // 清空卡片
    function clearCardList() {
        data.urlSet.clear(); // 清空链接集合
        data.domSet.clear(); // 清空DOM集合
        data.excludeIdSet.clear(); //清空被排除卡片id集合
        data.cardList = []; // 清空卡片列表
        info.size.width = [0, 2000]; // 重置宽度范围。
        info.size.height = [0, 2000]; // 重置高度范围。
        filters.size.width = [350, 2000];
        filters.size.height = [350, 2000];
    }
    // 移除卡片
    function removeCard(id) {
        data.excludeIdSet.add(id);
        return;
    }
    // 下载卡片
    async function downloadCards(ids) {
        if (!ids.length)
            return;
        loadingStore.start(ids.length); // 开启进度条
        // 先找到对应的卡片
        const cards = validCardList.value.filter((x) => ids.includes(x.id));
        if (cards.length === 1) {
            const card = cards[0];
            // 等于1的时候不打包，直接下载
            if (!card.source.blob) {
                // 如果没有blob先获取
                const blob = await getBlobByUrlAuto(card.description.title);
                if (blob) {
                    card.source.blob = blob;
                }
            }
            // 保存
            saveAs(card.source.blob, getNameByUrl(card.source.url));
            loadingStore.end(); // 结束进度条
        }
        else {
            // 大于1的时候进行打包
            // 创建zip容器
            const zipContainer = new JSZip();
            // 创建任务队列实例
            const taskQueue = new TaskQueue({
                interval: 500, // 至少2s的循环间隔
                maxConcurrent: 4,
                // 每个任务处理完成时的回调
                onTaskComplete(_, completed) {
                    loadingStore.update(completed);
                },
                // 所有任务处理完成时的回调
                async onAllTasksComplete() {
                    // console.log("全部处理完成", zipContainer);
                    loadingStore.update(0, zipContainer.length);
                    //s 生成压缩包
                    // console.log("准备生成压缩包", zipContainer);
                    const zip = await zipContainer.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                    }, 
                    // 压缩的进度回调
                    (metadata) => {
                        // console.log(`压缩进度：${metadata.percent.toFixed(2)}%`);
                        loadingStore.updatePercent(metadata.percent * 0.01);
                    });
                    // console.log("压缩包生成成功", zip);
                    // 下载压缩包
                    // 获取标题
                    let zipName;
                    const titles = [
                        document.title,
                        ...[...document.querySelectorAll("h1")].map((dom) => dom.innerText),
                        ...[...document.querySelectorAll("title")].map((dom) => dom.innerText),
                    ]
                        .filter((title) => !!title && !!title.trim().length)
                        .map((title) => title.replace("\\", "-").replace(",", "_"));
                    if (titles.length) {
                        zipName = titles[0]; // 如果标题获取成功就使用首个标题
                    }
                    else {
                        zipName = getNameByUrl(decodeURI(location.href)); // 如果标题获取失败就直接使用href提取标题
                    }
                    // console.log("压缩包名称:", zipName);
                    saveAs(zip, `${zipName}.zip`);
                    loadingStore.end(); // 结束进度条
                },
            });
            // 添加任务
            taskQueue.addTask(cards.map((card, i) => {
                return () => new Promise((resolve) => {
                    (async () => {
                        if (!card.source.blob) {
                            // 如果没有blob先获取
                            const blob = await getBlobByUrlAuto(card.description.title);
                            if (blob) {
                                card.source.blob = blob;
                            }
                            else {
                                // 如果获取失败就跳过
                                resolve();
                                return;
                            }
                        }
                        // 将blob存入zip容器
                        zipContainer.file(`${i} - ${getNameByUrl(card.description.title)}`, card.source.blob);
                        resolve(zipContainer);
                    })();
                });
            }));
            // 运行队列
            taskQueue.run();
        }
    }
    return {
        data,
        info,
        filters,
        validCardList,
        filteredCardList,
        getPageCard,
        clearCardList,
        removeCard,
        downloadCards,
    };
});
