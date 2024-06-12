// indexDB打开(创建)
export interface IndexDBOption {
	version: number;
	storeName?: string;
	keyPath: string;
	autoIncrement: boolean;
	handleUpgradeNeeded?: (store: IDBObjectStore) => Promise<void>;
}
//f 打开indexDB数据库
export async function openIndexDB(
	dbName: string,
	storeOption?: Partial<IndexDBOption>
) {
	const defaultOption: IndexDBOption = {
		version: 1,
		keyPath: "id",
		autoIncrement: true,
	};
	const { version, storeName, keyPath, autoIncrement, handleUpgradeNeeded } = {
		...defaultOption,
		...storeOption,
	};

	return new Promise<IDBDatabase | null>((resolve, reject) => {
		const request = window.indexedDB.open(dbName, version);
		request.onerror = (event) => {
			console.log("indexDB打开失败");
			reject(event);
		};
		request.onsuccess = (event) => {
			console.log("indexDB打开成功!");
			const db = (event.target as IDBOpenDBRequest).result;
			resolve(db);
		};
		request.onupgradeneeded = async (event) => {
			console.log("indexDB首次打开");
			const db = (event.target as IDBOpenDBRequest).result;
			if (!storeName) resolve(db);
			const store = db.createObjectStore(storeName!, {
				keyPath,
				autoIncrement,
			});
			if (handleUpgradeNeeded) {
				await handleUpgradeNeeded(store);
			}
			resolve(db);
		};
	});
}

//f 删除数据库
export function deleteDB(dbName: string) {
	return new Promise<boolean>((resolve, reject) => {
		const deleteRequest = window.indexedDB.deleteDatabase(dbName);
		deleteRequest.onerror = (event) => {
			console.log("删除失败", event.target);
			reject(false);
		};
		deleteRequest.onsuccess = (event) => {
			console.log("删除成功", event.target);
			resolve(true);
		};
	});
}

//f 清空指定仓库
export function clearDBStore(db: IDBDatabase, storeName: string) {
	return new Promise<boolean>((resolve, reject) => {
		const transaction = db.transaction([storeName], "readwrite"); // 创建事务
		const store = transaction.objectStore(storeName); // 取出指定的仓库
		const request = store.clear();
		request.onsuccess = (event) => {
			console.log(`成功将仓库${storeName}中的所有数据清空！`, event.target);
			resolve(true);
		};
		request.onerror = () => {
			console.log(`清空仓库${storeName}中的所有数据失败`);
			reject(false);
		};
	});
}

//f 向指定db仓库添加项目
export async function dbStoreAddItem<T>(
	/** indexDB数据库对象 */
	db: IDBDatabase,
	/** 仓库名 */
	storeName: string,
	/** 要添加的数据 */
	data: T
) {
	const transaction = db.transaction([storeName], "readwrite"); // 创建事务
	const store = transaction.objectStore(storeName); // 取出指定的仓库
	return new Promise<boolean>((resolve, reject) => {
		const request = store.add(data);
		request.onsuccess = (event) => {
			console.log(`成功向仓库${storeName}添加数据！`, event.target);
			resolve(true);
		};
		request.onerror = () => {
			console.log(`向仓库${storeName}添加数据失败`);
			reject(false);
		};
	});
}

//f 根据主键删除向指定db仓库中的一项
export async function dbStoreDeleteItemByKey(
	/** indexDB数据库对象 */
	db: IDBDatabase,
	/** 仓库名 */
	storeName: string,
	/** 要删除的数据主键 */
	key: string
) {
	const transaction = db.transaction([storeName], "readwrite"); // 创建事务
	const store = transaction.objectStore(storeName); // 取出指定的仓库
	return new Promise<boolean>((resolve, reject) => {
		const request = store.delete(key);
		request.onsuccess = (event) => {
			console.log(`成功将仓库${storeName}中id为${key}数据删除！`, event.target);
			resolve(true);
		};
		request.onerror = () => {
			console.log(`删除仓库${storeName}中id为${key}数据失败`);
			reject(false);
		};
	});
}

// 根据主键查询向指定db仓库中的一项
export function dbStoreGetItemByKey<T = any>(
	/** indexDB数据库对象 */
	db: IDBDatabase,
	/** 仓库名 */
	storeName: string,
	/** 要查询的数据主键 */
	key: string,
	option?: {
		/** 数据处理函数(用于加工查询到的数据) */
		handleData?: (rowData: any) => T;
	}
) {
	const transaction = db.transaction([storeName], "readwrite"); // 创建事务
	const store = transaction.objectStore(storeName); // 取出指定的仓库
	return new Promise<T>((resolve, reject) => {
		const request = store.get(key);
		request.onsuccess = (event) => {
			const result = (event.target as IDBRequest).result;
			console.log(`从仓库${storeName}查询id为${key}数据成功！`, result);
			if (option?.handleData) {
				resolve(option.handleData(result));
			} else {
				resolve(result);
			}
		};
		request.onerror = (event) => {
			console.log(`从仓库${storeName}查询id为${key}数据失败`, event.target);
			reject(event);
		};
	});
}

// 使用游标查询向指定db仓库中的多项
export function dbStoreGetItemByCursor<T = any>(
	/** indexDB数据库对象 */
	db: IDBDatabase,
	/** 仓库名 */
	storeName: string,
	option?: {
		/** 匹配判断函数(用于判断是否将当前循环的结果记录) */
		handleMatch?: (currData: any) => boolean;
		/** 数据处理函数(用于加工查询到的数据) */
		handleData?: (rowData: any) => T;
	}
) {
	const transaction = db.transaction([storeName], "readwrite"); // 创建事务
	const store = transaction.objectStore(storeName); // 取出指定的仓库
	return new Promise<T[]>((resolve) => {
		const request = store.openCursor();
		const rowDataList: any[] = [];
		// 游标开启成功，逐行读数据
		request.onsuccess = function (event) {
			const cursor = (event.target as any).result;
			// console.log("cursor", cursor);
			if (cursor) {
				// 判断是否需要进行匹配
				if (option?.handleMatch) {
					// 判断是否匹配
					if (option.handleMatch(cursor.value)) {
						rowDataList.push(cursor.value);
					}
				} else {
					rowDataList.push(cursor.value);
				}
				cursor.continue(); // 遍历了存储对象中的所有内容
			} else {
				// console.log("游标读取的数据：", rowDataList);
				// 判断是否需要二次加工数据
				if (option?.handleData) {
					resolve(rowDataList.map((x) => option.handleData!(x)));
				}
				resolve(rowDataList);
			}
		};
	});
}
