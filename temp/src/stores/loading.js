import { nextTick, ref } from "vue";
import { defineStore } from "pinia";
export default defineStore("loadingStore", () => {
    const loading = ref(false);
    const total = ref(1);
    const current = ref(0);
    // 开始
    function start(_total = 1) {
        total.value = _total;
        loading.value = true;
    }
    // 更新
    function update(_current, _total) {
        current.value = _current;
        if (_total) {
            total.value = _total;
        }
    }
    // 更新(百分比)
    function updatePercent(percent, _total) {
        if (_total) {
            total.value = _total;
        }
        current.value = percent * total.value;
    }
    // 停止
    function end() {
        loading.value = false;
        current.value = total.value;
        setTimeout(() => {
            nextTick(() => {
                current.value = 0;
            });
        }, 100);
    }
    return { loading, current, total, start, update, updatePercent, end };
});
