import uploader from './src/uploader';

// 为组件提供 install 安装方法，供按需引入
uploader.install = function (Vue) {
    Vue.component(uploader.name, uploader);
};

// 默认导出组件
export default uploader;

