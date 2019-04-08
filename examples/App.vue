<template>
    <div style="margin-top: 20px">
        <h3>图片压缩裁剪上传组件Demo</h3>
        {{fileList}}
        <h4> 当剪裁图片 imageCut === false 可使用多文件上传,blob = true</h4>
        <uploader
                :action=URL
                :imageCut="false"
                name="file"
                method="POST"
                :parseResponse="parseResponse"
                @addFile=addFile
                :file-list.sync="fileList"
        >
        </uploader>
        <h4> imageCut === true 多文件上传无效，因为一次只能裁剪一个图片</h4>
        <uploader
                :action=URL
                :imageCut="true"
                name="file"
                method="POST"
                :parseResponse="parseResponse"
                @addFile=addFile2
                :file-list.sync="fileList2"
        >
        </uploader>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                fileList: [],
                fileList2: [],
                URL: "http://127.0.0.1:3000/upload",
                // URL: 'https://image-server-gulu.herokuapp.com/upload',
            };
        },
        methods: {
            parseResponse(response) {
                // let object = JSON.parse(response);
                //返回url
                return response.data;
            },
            addFile(file) {
                this.fileList.push(file);
            },
            addFile2(file) {
                this.fileList2.push(file);
            }
        }
    };
</script>

<style lang="less">
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
</style>
