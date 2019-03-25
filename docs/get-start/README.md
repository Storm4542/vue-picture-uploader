

### 开始

`vue-lnsoft-uploader`是针对移动端图片上传、剪裁、压缩功能开发的。

### 依赖

`[AlloyCrop](https://github.com/AlloyTeam/AlloyCrop)` 腾讯团队开源的移动端裁剪组件

`[localResizeIMG](https://github.com/think2011/localResizeIMG)`lrz前端图片压缩组件

### 安装 

```
yarn add vue-lnsoft-uploader
```

or

```
npm install vue-lnsoft-uploader
```

### 使用

```javascript
import uploader from 'vue-lnsoft-uploader'
Vue.use(uploader)
```

### 注意

页面中必须加入改`meta`标签，否则裁剪组件将会失效

```html
<meta name="viewport" 
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

