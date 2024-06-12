<template>
	<n-flex class="test__container" vertical :size="4">
		<n-flex :size="4">
			<n-button-group>
				<n-button type="primary" @click="indexDBOpenOrCreate">
					打开or创建indexDB
				</n-button>
				<n-button type="error" @click="indexDBStoreClear"
					>清空仓库数据</n-button
				>
			</n-button-group>
			<n-button-group>
				<n-button type="primary" @click="addCard">添加项目</n-button>
				<!-- <n-button type="primary"></n-button> -->
			</n-button-group>
			<!-- <n-button-group>
				<n-button type="primary" @click="queryData">查询数据</n-button>
			</n-button-group> -->
		</n-flex>
		<n-flex class="waterfall-wrapper" :size="4">
			<BaseScrollbar>
				<WaterFallList :data="(dataList as any)" item-padding="2px">
					<template #default="{ item }">
						<GalleryCard :data="(item as any)" @delete="deleteCard" />
					</template>
				</WaterFallList>
			</BaseScrollbar>
		</n-flex>
	</n-flex>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, onUnmounted } from "vue";
	import {
		openIndexDB,
		clearDBStore,
		dbStoreAddItem,
		dbStoreDeleteItemByKey,
		dbStoreGetItemByCursor,
		dbStoreGetItemByKey,
	} from "@/utils/indexDB";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import WaterFallList from "@/components/base/waterfall-list.vue";
	import GalleryCard from "../gallery/gallery-card.vue";

	import Card from "@/stores/cardStore/class/Card";

	const info = reactive({
		dbName: "WebImgCollector2",
		storeName: "cards",
	});
	const db = ref<IDBDatabase | null>();
	const dataList = ref<Card[]>([]);

	onMounted(async () => {
		// 组件挂载后链接数据库
		db.value = await indexDBOpenOrCreate();
		getData();
	});
	onUnmounted(async () => {
		db.value?.close();
	});

	//f 创建或打开indexDB
	const indexDBOpenOrCreate = async () => {
		return await openIndexDB(info.dbName, {
			storeName: info.storeName,
			keyPath: "id",
			autoIncrement: false,
			handleUpgradeNeeded: async (store) => {
				console.log(`仓库'cards'创建成功! 准备创建索引`, store);
				store.createIndex("id", "id", { unique: true });
				store.createIndex("name", "name", { unique: false });
			},
		});
	};

	//f 清空仓库数据
	const indexDBStoreClear = async () => {
		if (!db.value) return console.log("indexDB未创建(或打开)");
		clearDBStore(db.value, info.storeName);
		getData();
	};

	//f 从indexDB获取数据
	const getData = async () => {
		if (db.value) {
			dataList.value = await dbStoreGetItemByCursor<Card>(
				db.value,
				info.storeName,
				{
					handleData(rowData: any) {
						const { id, source, preview, description } = rowData;
						return new Card({ id, source, preview, description });
					},
				}
			);
		}
	};

	//f 添加卡片
	const addCard = async () => {
		const card = new Card();
		if (!db.value) return console.log("indexDB未创建(或打开)");
		if (await dbStoreAddItem(db.value, info.storeName, card)) {
			getData();
		}
	};

	//f 删除卡片
	const deleteCard = async (id: string) => {
		if (!db.value) return console.log("indexDB未创建(或打开)");
		if (await dbStoreDeleteItemByKey(db.value, info.storeName, id)) {
			getData();
		}
	};
</script>

<style lang="scss" scoped>
	.test__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		overflow: hidden;
	}

	.waterfall-wrapper {
		flex: 1;
		padding: 4px;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
	}
</style>
