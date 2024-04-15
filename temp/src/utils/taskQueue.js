// 任务队列
export class TaskQueue {
    tasks = []; // 任务队列数组，存储待执行的任务对象或函数。
    running = false; // 执行标识符，用于控制队列的执行状态。
    paused = false; // 执行标识符，用于控制队列的执行状态。
    interval; // 执行间隔，用于控制任务之间的间隔时间。
    maxConcurrent; // 最大并发数，用于控制同时执行的任务数量。
    currentConcurrent = 0; // 当前并发数，用于记录当前正在执行的任务数量。
    completedCount = 0; // 执行完成的任务。
    failedTasks = []; // 失败的任务数组。
    isComplete = false; // 是否已经完成。
    timer = null; // 计时器
    runningTasks = []; // 记录正在执行的任务
    // 每次任务完成时的回调
    onTaskComplete;
    // 任务执行出错时的回调
    onTaskError;
    // 所有任务完成时的回调
    onAllTasksComplete;
    constructor(options) {
        // 默认配置
        const defaultOptions = {
            interval: 300,
            maxConcurrent: 1,
            onTaskComplete: () => { },
            onTaskError: () => { },
            onAllTasksComplete: () => { },
        };
        const { interval, maxConcurrent, onTaskComplete, onTaskError, onAllTasksComplete, } = {
            ...defaultOptions,
            ...options,
        };
        this.interval = interval;
        this.maxConcurrent = maxConcurrent;
        this.onTaskComplete = onTaskComplete;
        this.onTaskError = onTaskError;
        this.onAllTasksComplete = onAllTasksComplete;
    }
    // 添加任务
    addTask(task) {
        if (Array.isArray(task)) {
            this.tasks.push(...task);
        }
        else {
            this.tasks.push(task);
        }
    }
    // 运行队列
    run() {
        if (this.paused)
            return; // 如果处于暂停中就不执行
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
        this.timer = setTimeout(() => {
            this.handleRun();
        }, this.interval);
    }
    // 处理运行队列
    handleRun() {
        if (this.paused)
            return; // 如果处于暂停中就不执行
        while (this.currentConcurrent < this.maxConcurrent) {
            // 如果队列并发数<最大并发数就执行
            this.currentConcurrent++; // 执行前++当前并发数
            // console.log("准备执行任务");
            this.executeTask().then(() => {
                this.currentConcurrent--; // 执行完成后--当前并发数
                // 如果队列中已经没有任务就执行回调并且返回
                if (!this.tasks.length) {
                    this.stop(); // 先停止队列循环(清除定时器)
                    // 等待正在执行的任务完成
                    Promise.all(this.runningTasks).then(() => {
                        this.handleComplete(); // 如果没有任务了就停止循环
                    });
                }
                else {
                    this.run(); // 递归执行;
                }
            });
        }
    }
    // 停止运行
    stop() {
        this.running = false;
        // 清除定时器
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    // 执行队列中的任务
    async executeTask() {
        // 判断队列里面是否还有任务
        if (!this.tasks.length)
            return; // 没有任务就直接返回
        // 取出首个任务
        const task = this.tasks.shift();
        // 执行任务
        if (task) {
            try {
                const p = task();
                this.runningTasks.push(p); // 记录正在执行的任务
                const res = await p;
                this.onTaskComplete(res, this.completedCount); // 执行任务完成后的回调
            }
            catch (error) {
                this.onTaskError(error, task);
                this.failedTasks.push({ task, error }); // 记录失败的任务
            }
        }
        else {
            this.failedTasks.push({ task, error: "is not Function" }); // 记录失败的任务
        }
        this.completedCount++; // 任务执行完成后++已完成任务数量
    }
    // 暂停执行
    pause() {
        if (this.paused || this.isComplete)
            return;
        // console.log("任务暂停");
        this.paused = true;
    }
    // 继续执行
    continue() {
        if (!this.paused || this.isComplete)
            return;
        // console.log("任务继续");
        this.paused = false;
        this.run();
    }
    // 处理执行完成
    handleComplete() {
        if (!this.isComplete) {
            this.isComplete = true;
            this.onAllTasksComplete(this.completedCount, this.failedTasks.length);
        }
    }
}
