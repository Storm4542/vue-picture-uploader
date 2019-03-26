文档&&示例地址

 <https://storm4542.github.io/vue-picture-uploader/>

### 示例

```html
 <g-uploader
                height="80"
                width="80"
                :action=URL
                :imageCut="true"
                name="file"
                method="POST"
                :parseResponse="parseResponse"
                @addFile=addFile
                :file-list.sync="fileList"
        >
</g-uploader>
```

```javascript
 export default {
        data() {
            return {
                fileList: [],
                URL: 'https://image-server-gulu.herokuapp.com/upload',
            };
        },
        methods: {
            parseResponse(response) {
              	//对response做处理
               	// ...
                return response;
            },
            addFile(file) { 
              //固定写入
                this.fileList.push(file);
            }
        }
    };
```



### API

| 名称          | 描述                                                      | 默认值 | 是否必须 | 数据类型         |
| :------------ | --------------------------------------------------------- | ------ | -------- | ---------------- |
| action        | 上传图片地址                                              | -      | 是       | String           |
| imageCut      | 是否开启剪裁模式(注:开启剪裁模式后，每次只能上传一张图片) | true   | 否       | Boolean          |
| name          | 传给后台的 name                                           | -      | 是       | String           |
| method        | 方法                                                      | POST   | 否       | String           |
| parseResponse | 响应处理函数                                              | -      | 是       | Function         |
| fileList      | 文件列表                                                  | [ ]    | 否       | Array            |
| addFile       | 更新文件列表函数(按照示例写在项目中即可)                  | -      | 是       | Function         |
| height        | 图片和添加图片按钮的高度                                  | 80     | 否       | String\|\|Number |
| width         | 图片和添加图片按钮的宽度                                  | 80     | 否       | String\|\|Number |

