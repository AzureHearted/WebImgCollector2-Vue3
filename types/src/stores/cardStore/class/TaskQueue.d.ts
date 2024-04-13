/**
 * f 任务队列
 * - 可控制并发数量且能自动执行
 */
export declare class TaskQueue {
    max: number;
    initMax: number;
    delay: number;
    taskList: ITask[];
    showMessage: boolean;
    finallyCallback: Function;
    constructor(options?: {
        showMessage?: false;
        max?: number;
        delay?: number;
        finallyCallback?: () => {};
    });
    /**
     * * 添加任务到队列
     * @param {ITask} task 任务项
     */
    addTask(task?: ITask): void;
    /**
     * * push任务到队列
     * @param {ITask[]} taskList 任务项
     */
    pushTask(taskList: ITask[]): void;
    run(): Promise<void>;
}
export interface ITask {
    index: number;
    main: FnReturnPromise;
    callback?: (res: any, index: number) => any;
}
type FnReturnPromise = (() => Promise<any>) | null;
export {};
