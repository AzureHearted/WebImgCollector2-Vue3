interface Options {
	interval: number;
	maxConcurrent: number;
	overtime: number;
	onTaskComplete: (result: any, completedCount: number) => void;
	onTaskError: (error: any, task: Task) => void;
	onTaskOvertime: (task: Task, overtimeTasks: Task[]) => void;
	onAllTasksComplete: (completedCount: number, failedCount: number) => void;
}

// 任务接口
export interface Task {
	handle: () => Promise<any>;
	handleOvertime?: () => Promise<any>;
	[key: string]: any;
}

// 任务队列
export class TaskQueue {
	private tasks: Task[] = []; // 任务队列数组，存储待执行的任务对象或函数。
	private running = false; // 执行标识符，用于控制队列的执行状态。
	private paused = false; // 执行标识符，用于控制队列的执行状态。
	private interval: number; // 执行间隔，用于控制任务之间的间隔时间。
	private overtime: number; // 超时重置事件
	private maxConcurrent: number; // 最大并发数，用于控制同时执行的任务数量。
	private currentConcurrent = 0; // 当前并发数，用于记录当前正在执行的任务数量。
	private completedCount: number = 0; // 执行完成的任务。
	private failedTasks: Task[] = []; // 失败的任务数组。
	private isComplete = false; // 是否已经完成。
	private timer: number | null = null; // 计时器
	private runningTasks: Promise<any>[] = []; // 记录正在执行的任务
	private overtimeTasks: Task[] = []; // 记录超时的任务

	// 每次任务完成时的回调
	private onTaskComplete: Options["onTaskComplete"];
	// 任务执行出错时的回调
	private onTaskError: Options["onTaskError"];
	// 任务超时时的回调
	private onTaskOvertime: Options["onTaskOvertime"];
	// 所有任务完成时的回调
	private onAllTasksComplete: Options["onAllTasksComplete"];

	constructor(options?: Partial<Options>) {
		// 默认配置
		const defaultOptions: Options = {
			interval: 300,
			overtime: 5000,
			maxConcurrent: 1,
			onTaskComplete: () => {},
			onTaskError: () => {},
			onTaskOvertime: () => {},
			onAllTasksComplete: () => {},
		};

		const {
			interval,
			overtime,
			maxConcurrent,
			onTaskComplete,
			onTaskError,
			onTaskOvertime,
			onAllTasksComplete,
		} = {
			...defaultOptions,
			...options,
		};

		this.interval = interval;
		this.overtime = overtime;
		this.maxConcurrent = maxConcurrent;
		this.onTaskComplete = onTaskComplete;
		this.onTaskError = onTaskError;
		this.onTaskOvertime = onTaskOvertime;
		this.onAllTasksComplete = onAllTasksComplete;
	}
	// 添加任务
	public addTask(task: Task | Task[]): void {
		if (Array.isArray(task)) {
			this.tasks.push(...task);
		} else {
			this.tasks.push(task);
		}
	}

	// 运行队列
	public run(): void {
		if (this.paused) return; // 如果处于暂停中就不执行
		if (this.timer) {
			// 如果定时器不为空则清除定时器,防止重复执行
			clearTimeout(this.timer);
			this.timer = null;
		}
		// 如果是首次运行就立即执行一次
		if (!this.currentConcurrent && !this.running) {
			this.running = true;
			this.handleRun();
			return;
		}
		// 设置定时器开始计时
		this.timer = window.setTimeout(() => {
			this.handleRun();
		}, this.interval);
	}

	// 处理运行队列
	private handleRun(): void {
		if (this.paused) return; // 如果处于暂停中就不执行

		while (this.currentConcurrent < this.maxConcurrent) {
			// 如果队列并发数<最大并发数就执行
			this.currentConcurrent++; // 执行前++当前并发数

			this.executeTask();
		}
	}
	// 停止运行
	public stop(): void {
		this.running = false;
		// 清除定时器
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	// 执行队列中的任务
	private async executeTask(): Promise<void> {
		// 判断是否还有任务
		if (!this.tasks.length) {
			this.stop(); // 先停止队列循环(清除定时器)
			// 等待正在执行的任务完成
			Promise.all(this.runningTasks).finally(() => {
				this.handleComplete(); // 如果没有任务了就停止循环
			});
			return;
		}

		// 取出首个任务
		const task = this.tasks.shift()!;
		task.complete = false;
		task.isOvertime = false;

		// 处理完成事件
		const accomplish = () => {
			// 如果队列中已经没有任务就执行回调并且返回
			if (!this.tasks.length) {
				this.stop(); // 先停止队列循环(清除定时器)
				// 等待正在执行的任务完成
				Promise.all(this.runningTasks).finally(() => {
					this.handleComplete(); // 如果没有任务了就停止循环
				});
			} else {
				this.run(); // 递归执行;
			}
		};

		// 超时处理
		if (this.overtime) {
			setTimeout(() => {
				// 若超时还未完成任务则腾出一个队列空间
				if (!task.complete) {
					// console.log("任务超时");

					this.overtimeTasks.push(task);
					this.onTaskOvertime(task, this.overtimeTasks);

					// 标记为超时
					task.isOvertime = true;
					this.currentConcurrent--; // 执行完成后--当前并发数
					// 同时立即执行完成事件
					accomplish();
				}
			}, this.overtime);
		}

		// 执行任务
		try {
			const p = task.handle();
			this.runningTasks.push(p); // 记录正在执行的任务
			const res = await p;
			this.onTaskComplete(res, this.completedCount); // 执行任务完成后的回调
		} catch (error: any) {
			this.onTaskError(error, task);
			task.error = error;
			this.failedTasks.push(task); // 记录失败的任务
		}

		// 标记为完成
		task.complete = true;

		// 如果没有超时才腾出空间(因为如果超时必定腾出空间,防止重复腾出空间)
		if (!task.isOvertime) {
			this.currentConcurrent--; // 执行完成后--当前并发数
			// 执行完成事件
			accomplish();
		}

		this.completedCount++; // 任务执行完成后++已完成任务数量
	}

	// 暂停执行
	public pause(): void {
		if (this.paused || this.isComplete) return;
		// console.log("任务暂停");
		this.paused = true;
	}
	// 继续执行
	public continue(): void {
		if (!this.paused || this.isComplete) return;
		// console.log("任务继续");
		this.paused = false;
		this.run();
	}

	// 处理执行完成
	private handleComplete() {
		if (!this.isComplete) {
			this.isComplete = true;
			this.onAllTasksComplete(this.completedCount, this.failedTasks.length);
		}
	}
}
