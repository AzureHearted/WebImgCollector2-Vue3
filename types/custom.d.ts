import JSZip from "jszip";
import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存
//* 定义 svg 的扩展类型
export declare module "*.svg" {
  const content: any;
  export default content;
}

export {};

declare global {
  const JSZip: JSZip;
  const saveAs: saveAs;
  type JSZipType = JSZip;
}

//s 用于给ts在template中识别props类型
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    Img: typeof import("@/components/Img.vue")["default"];
    Body: typeof import("@/components/Body.vue")["default"];
    Card: typeof import("@/components/Card.vue")["default"];
    List: typeof import("@/components/List.vue")["default"];
    RightClickMenu: typeof import("@/components/RightClickMenu.vue")["default"];
    RuleEditor: typeof import("@/components/RuleEditor.vue")["default"];
    RuleForm: typeof import("@/components/RuleForm.vue")["default"];
    SettingMenu: typeof import("@/components/SettingMenu.vue")["default"];
    TestBoard: typeof import("@/components/TestBoard.vue")["default"];
    Toolbar: typeof import("@/components/Toolbar.vue")["default"];
    HoverButton: typeof import("@/components/HoverButton.vue")["default"];
    InputNumberRange: typeof import("@/components/public/InputNumberRange.vue")["default"];
    SelectorFormat: typeof import("@/components/public/SelectorFormat.vue")["default"];
    DragModal: typeof import("@/components/DragModal.vue")["default"];
  }
}
