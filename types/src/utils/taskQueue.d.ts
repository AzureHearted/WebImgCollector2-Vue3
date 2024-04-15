interface Options {
    interval: number;
    maxConcurrent: number;
    onTaskComplete: (result: any, completedCount: number) => void;
    onTaskError: (error: any, task: Function) => void;
    onAllTasksComplete: (completedCount: number, failedCount: number) => void;
}
export declare class TaskQueue {
    private tasks;
    private running;
    private paused;
    private interval;
    private maxConcurrent;
    private currentConcurrent;
    private completedCount;
    private failedTasks;
    private isComplete;
    private timer;
    private runningTasks;
    private onTaskComplete;
    private onTaskError;
    private onAllTasksComplete;
    constructor(options?: Partial<Options>);
    addTask(task: Function | Function[]): void;
    run(): void;
    private handleRun;
    stop(): void;
    private executeTask;
    pause(): void;
    continue(): void;
    private handleComplete;
}
export {};
