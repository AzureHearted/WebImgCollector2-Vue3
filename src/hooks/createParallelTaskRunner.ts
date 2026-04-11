// 令牌桶算法实现的并发任务调度器
class TokenBucket {
	private capacity: number; // 令牌桶的总容量
	private tokens: number; // 当前令牌的数量
	private refillRate: number; // 每毫秒补充的令牌数量
	private lastRefill: number; // 上次补充令牌的时间戳（毫秒）

	/**
	 * 创建令牌桶
	 * @param capacity 容量，表示令牌桶的最大容量
	 * @param refillPerSecond 每秒补充的令牌数量
	 */
	constructor(capacity: number, refillPerSecond: number) {
		this.capacity = capacity; // 初始化令牌桶的容量
		this.tokens = capacity; // 初始令牌数量等于容量
		this.refillRate = refillPerSecond / 1000; // 计算每毫秒补充的令牌数量
		this.lastRefill = Date.now(); // 记录当前时间作为上次补充令牌的时间戳
	}

	// 私有方法，用于补充令牌
	private refill() {
		const now = Date.now(); // 获取当前时间
		const delta = now - this.lastRefill; // 计算自上次补充令牌以来的时间差（毫秒）

		const add = delta * this.refillRate; // 计算需要补充的令牌数量
		this.tokens = Math.min(this.capacity, this.tokens + add); // 更新令牌数量，但不能超过容量

		this.lastRefill = now; // 更新上次补充令牌的时间戳为当前时间
	}

	// 尝试移除指定数量的令牌
	tryRemove(count = 1): boolean {
		this.refill(); // 补充令牌

		if (this.tokens >= count) {
			// 如果当前令牌数量足够
			this.tokens -= count; // 减去指定数量的令牌
			return true; // 返回成功
		}

		return false; // 返回失败，令牌不足
	}

	// 异步等待令牌
	async waitForToken(count = 1, shouldStop?: () => boolean): Promise<boolean> {
		while (true) {
			if (shouldStop?.()) return false;

			// 无限循环，直到获取到足够的令牌
			if (this.tryRemove(count)) return true; // 尝试获取令牌，如果成功则返回

			// 等一小段时间再试（可调优）
			await new Promise((r) => setTimeout(r, 10)); // 等待10毫秒后重试
		}
	}
}

export interface Task<T> {
	/** 任务执行函数 */
	handle: () => Promise<T> | Awaited<T>;
}

interface Options<T> {
	/** 并发数 @default 3 */
	parallelCount: number;

	// 新增令牌桶配置
	tokenBucket?: {
		/** 令牌桶容量 */
		capacity: number;
		/** 每秒补充的令牌数量  */
		refillPerSecond: number;
	};

	onTaskBeforeRun: (index: number, task: Task<T>, stop: () => void) => void;

	onTaskComplete: (
		index: number,
		result: T,
		completedCount: number,
		stop: () => void,
		duration: number,
	) => void;

	onTaskError: (index: number, error: any, task: Task<T>) => void;

	onAllTasksComplete: (
		completedCount: number,
		failedCount: number,
		QPS: number,
	) => void;
}

export function createParallelTaskRunner<T = void>(
	tasks: Task<T>[],
	options?: Partial<Options<T>>,
) {
	const { parallelCount = 3, tokenBucket } = options || {};

	const bucket = tokenBucket
		? new TokenBucket(tokenBucket.capacity, tokenBucket.refillPerSecond)
		: null;

	let nextIndex = 0; // 下一个要执行的任务索引
	const finishedTaskSet = new Set<Task<T>>(); // 已完成任务集合
	const failedTaskSet = new Set<Task<T>>(); // 出错的任务集合
	const runningTaskSet = new Set<Task<T>>(); // 正在运行的任务集合

	let stopFlag = false;
	let resolved = false;

	function stop() {
		stopFlag = true;
	}

	function run() {
		const parallelStart = Date.now();
		return new Promise<void>((resolve) => {
			if (tasks.length === 0) {
				options?.onAllTasksComplete?.(0, 0, 0);
				resolve();
				return;
			}

			// 统一收尾（只会触发一次）
			function tryFinish() {
				if (resolved) return;

				// 正常完成
				if (finishedTaskSet.size + failedTaskSet.size === tasks.length) {
					resolved = true;
					const QPS =
						((finishedTaskSet.size + failedTaskSet.size) /
							(Date.now() - parallelStart)) *
						1000;
					options?.onAllTasksComplete?.(
						finishedTaskSet.size,
						failedTaskSet.size,
						QPS,
					);
					resolve();
					return;
				}

				// 停止后：只要没有在运行的任务，就结束
				if (stopFlag && runningTaskSet.size === 0) {
					resolved = true;
					const QPS =
						((finishedTaskSet.size + failedTaskSet.size) /
							(Date.now() - parallelStart)) *
						1000;
					options?.onAllTasksComplete?.(
						finishedTaskSet.size,
						failedTaskSet.size,
						QPS,
					);
					resolve();
				}
			}

			// 核心调度器：补任务
			function schedule() {
				if (stopFlag) return;

				// 有空位 && 有任务
				while (
					runningTaskSet.size < parallelCount &&
					nextIndex < tasks.length
				) {
					runNext();
				}
			}

			// 执行一个任务
			async function runNext() {
				if (stopFlag) return;

				const currentIndex = nextIndex++;
				const task = tasks[currentIndex];

				runningTaskSet.add(task);

				try {
					// 等待 token
					if (bucket) {
						const ok = await bucket.waitForToken(1, () => stopFlag);
						if (!ok) return;
					}
					options?.onTaskBeforeRun?.(currentIndex, task, stop);
					const start = Date.now();
					const res = await task.handle();
					const end = Date.now();

					finishedTaskSet.add(task);
					options?.onTaskComplete?.(
						currentIndex,
						res,
						finishedTaskSet.size,
						stop,
						end - start,
					);
				} catch (err) {
					failedTaskSet.add(task);
					options?.onTaskError?.(currentIndex, err, task);
				} finally {
					runningTaskSet.delete(task);

					if (stopFlag) {
						tryFinish();
						return;
					}

					schedule();

					tryFinish();
				}
			}

			// 初始化启动
			schedule();
		});
	}

	return {
		run,
		stop,
	};
}
