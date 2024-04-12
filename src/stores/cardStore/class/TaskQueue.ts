import { throttle } from "@/utils/common";
/**
 * f 任务队列
 * - 可控制并发数量且能自动执行
 */
export class TaskQueue {
	public max: number;
	public initMax: number;
	public delay: number;
	public taskList: ITask[];
	public showMessage: boolean;
	public finallyCallback: Function;

	constructor(options?: {
		showMessage?: false;
		max?: number;
		delay?: number;
		finallyCallback?: () => {};
	}) {
		this.max = options?.max || 4;
		this.initMax = options?.max || 4;
		this.delay = options?.delay || 300;
		this.taskList = [];
		this.showMessage = options?.showMessage || false;
		this.finallyCallback = options?.finallyCallback || Function();
	}
	/**
	 * * 添加任务到队列
	 * @param {ITask} task 任务项
	 */
	public addTask(task?: ITask): void {
		if (task) {
			this.taskList.push(task);
		}
	}
	/**
	 * * push任务到队列
	 * @param {ITask[]} taskList 任务项
	 */
	public pushTask(taskList: ITask[]): void {
		if (taskList) {
			this.taskList.push(...taskList);
		}
	}
	// f 启动任务队列(必须使用异步否则节流函数无效)
	public async run() {
		//s 外部 - 节流实现
		throttle(async () => {
			// console.log("每次请求->", this.max, "执行间隔->", this.delay);
			const length = this.taskList.length;
			// console.log(this.max, this.initMax);
			if (!length) {
				if (this.max === this.initMax) {
					this.finallyCallback();
				}
				return;
			}
			const min = Math.min(length, this.max);
			for (let i = 0; i < min; i++) {
				const task = this.taskList.shift();
				this.max--; //s 占用一个空间
				// console.log("当前剩余空间", this.max);
				if (task && task.main) {
					task
						?.main()
						.then((res) => {
							if (this.showMessage) console.log(res);
							if (task.callback) {
								task.callback(res, task.index); //s 单个任务执行完成时的回调
							}
						})
						.catch((err) => {
							if (this.showMessage) console.log(err);
							if (task.callback) {
								task.callback(err, task.index); //s 单个任务执行完成时的回调
							}
						})
						.finally(() => {
							this.max++; //s 还原一个空间
							//s 执行过后任务置空防止重复执行
							task.main = null;
							if (this.max === this.initMax) {
								this.run();
							}
						});
				}
			}
		}, this.delay)();
	}
}
//s 任务类型的接口
export interface ITask {
	index: number;
	main: FnReturnPromise;
	callback?: (res: any, index: number) => any;
}
type FnReturnPromise = (() => Promise<any>) | null;
