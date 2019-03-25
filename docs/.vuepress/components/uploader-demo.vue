<template>
    <div style="margin-top: 20px">
        <h4> 不可裁剪模式（可多文件上传）</h4>
        <g-uploader
                height="80"
                width="80"
                :action=URL
                :imageCut="false"
                name="file"
                method="POST"
                :parseResponse="parseResponse"
                @addFile=addFile
                :file-list.sync="fileList"
        >
        </g-uploader>
        <h4> 可裁剪模式(请在移动端尝试，否则会有bug)</h4>
        <g-uploader
                height="80"
                width="80"
                :action=URL
                :imageCut="true"
                name="file"
                method="POST"
                :parseResponse="parseResponse"
                @addFile=addFile2
                :file-list.sync="fileList2"
        >
        </g-uploader>
    </div>
</template>

<script>
    import GUploader from '../../../examples/components/uploader';

    export default {
        name: 'app',
        components: {
            GUploader
        },
        data() {
            return {
                fileList: [],
                fileList2: [],
                // URL: "http://127.0.0.1:3000/upload",
                URL: 'https://image-server-gulu.herokuapp.com/upload',
            };
        },
        methods: {
            parseResponse(response) {
                // let object = JSON.parse(response);
                return response;
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
