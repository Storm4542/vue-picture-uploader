<template>
    <div class="uploader">
        <ol class="fileList">
            <li v-for="file in fileList" :key="file.name">
                <div class="image-wrapper">
                    <template v-if="file.status === 'uploading'">
                        <g-icon class="spin icon-loading" iconname="loading2"></g-icon>
                    </template>
                    <template v-else-if="file.url.indexOf('http') >= 0">
                        <img class="addFile" :src="file.url" :style="{width:width+'px',height: height+'px'}"
                             alt="">
                        <div class="remove-wrapper">
                            <g-icon class="remove-icon" @click="onRemoveFile(file)" iconname="delete"></g-icon>
                        </div>
                    </template>
                    <template v-else>
                        <div class="defaultImage"></div>
                        <div class="remove-wrapper">
                            <g-icon class="remove-icon" @click="onRemoveFile(file)" iconname="delete"></g-icon>
                        </div>
                    </template>
                </div>
                <!--<span class="file-name" :class="{[file.status]:file.status}">{{file.name}}</span>-->
            </li>
            <li>
                <div @click="onClickUpload">
                    <div class="addFile" :style="{width:width+'px',height: height+'px'}">
                        <div class="row"></div>
                        <div class="col"></div>
                    </div>
                </div>
            </li>
        </ol>

        <img :src="blob" alt="">
        <div ref="temp" style="width: 0; height: 0; overflow: hidden;"></div>
    </div>
</template>

<script>
    import GIcon from './icon';
    import alloycrop from '../../packages/uploader/src/AlloyCrop';
    // import imageCompress from '../../plugins/imageCompression';
    import lrz from 'lrz';
    import axios from 'axios';

    export default {
        name: "uploader",
        components: {GIcon,},
        props: {
            imageCut: {
                type: Boolean,
                default: true,
            },
            blob: {
                type: Boolean,
                default: false
            },
            action: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            method: {
                type: String,
                default: 'POST'
            },
            parseResponse: { //处理响应的函数,用于返回图片url
                type: Function,
                required: true
            },
            fileList: {  //已上传的文件列表
                type: Array,
                default: () => []
            },
            height: {
                type: [Number, String],
                default: 80
            },
            width: {
                type: [Number, String],
                default: 80
            }
        },
        methods: {
            //计算宽度,保证能装下4个图片框
            // calculateWidth() {
            //     let width = document.documentElement.clientWidth;
            //     return ((width - 64) / 4) + 'px';
            // },
            onClickUpload() { //点击事件
                let input = this.createInput();
                input.addEventListener('change', () => {
                    if (this.imageCut) {
                        this.choosePhoto(input.files[0]);
                    } else {
                        this.uploadFiles(undefined, input.files);
                    }
                    //this.uploadFiles(input.files[0]); //单文件
                    // this.uploadFiles(input.files); //多文件
                    input.remove(); //销毁该input
                });
                input.click();
            },
            createInput() { //生成 input
                this.$refs.temp.innerHTML = '';
                let input = document.createElement('input');
                input.type = 'file';
                input.multiple = !this.imageCut; //是否允许多文件
                this.$refs.temp.appendChild(input);
                return input;
            },
            beforeUploadFile(rawFile, newName) {
                //上传之前
                //用于生成菊花
                let {size, type} = rawFile;
                this.$emit('addFile', {name: newName, size, type, status: 'uploading'});
                //this.$emit('update:fileList', [...this.fileList, {name: newName, size, type, status: 'uploading'}]);
                //更新父组件的fileList（增加文件），改变上传状态为 uploading(用于显示菊花图)
                return true;
            },
            choosePhoto(file) {
                // 压缩，剪裁图片需要的一些元素和对象
                const reader = new FileReader();
                // 利用fileReader 预览图片
                if (typeof FileReader === 'undefined') {
                    alert('浏览器不支持图片预览功能，请换浏览器重试');
                } else {
                    // 实例化图片读取
                    reader.readAsDataURL(file); // 将文件读取为base64
                    reader.onload = () => {
                        this.clipImg(reader.result, file); // 剪裁图片的方法
                    };
                }
            },
            clipImg(src, rawFiles) {
                new alloycrop({
                    image_src: src,
                    circle: false,
                    width: 300,
                    height: 300,
                    output: 1,
                    ok: (base64, canvas) => {
                        console.log('ok');
                        this.uploadFiles(base64, rawFiles);
                    },
                    cancel: () => { },
                    ok_text: '确定',
                    cancel_text: '取消',
                });
            },
            uploadFiles(cutFile, rawFile) { //上传函数
                if (!this.imageCut) {
                    Array.from(rawFile).map(file => {
                        let {name} = file; //找到 上传文件名
                        let newName = this.generateName(name); //生成新的名字（因为可能会有重复）
                        this.beforeUploadFile(rawFile, newName); //生成菊花图
                        lrz(file, {
                            width: 800,
                            quality: 0.5,
                        }).then(res => {
                            if (this.blob) {
                                let formData = new FormData(); //创建表单
                                formData.append(this.name, res.file, newName); // formData 的 append 方法 https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/append
                                console.log('lrz formdata', formData.getAll(this.name));
                                this.ajax(formData, newName, true);
                            } else {
                                let file = {
                                    filename: newName,
                                    file: res.base64,
                                    time: new Date()
                                };
                                this.ajax(file, newName, false);
                            }

                        });

                    });
                } else {
                    let {name} = rawFile; //找到 上传文件名
                    let newName = this.generateName(name); //生成新的名字（因为可能会有重复）
                    this.beforeUploadFile(rawFile, newName); //生成菊花图
                    if (this.blob) {
                        let formData = new FormData(); //创建表单
                        formData.append(this.name, this.convertBase64ToBlob(cutFile), newName); // formData 的 append 方法 https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/append
                        this.ajax(formData, newName, true);
                    } else {
                        let file = {
                            filename: newName,
                            file: cutFile,
                            time: new Date()
                        };
                        this.ajax(file, newName, false);
                    }

                }
            },
            afterUploadFiles(url, newName) {
                console.log(this.fileList);
                let file = this.fileList.filter(item => item.name === newName)[0]; //找到该上传文件
                let index = this.fileList.indexOf(file); // 找到在 fileList 中的位置
                let copyFile = JSON.parse(JSON.stringify(file)); //深拷贝
                copyFile.url = url;
                copyFile.status = 'success'; //更改状态为 success (去掉菊花)
                let fileListCopy = [...this.fileList]; //展开运算符浅拷贝 fileList
                fileListCopy.splice(index, 1, copyFile); // 把更新新状态后的文件 添加到 fileList
                this.$emit('update:fileList', fileListCopy); //提交给父组件
            },
            convertBase64ToBlob(base64) {
                let base64Arr = base64.split(',');
                let imgtype = '';
                let base64String = '';
                if (base64Arr.length > 1) {
                    //如果是图片base64，去掉头信息
                    base64String = base64Arr[1];
                    imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
                }
                // 将base64解码
                let bytes = atob(base64String);
                //var bytes = base64;
                let bytesCode = new ArrayBuffer(bytes.length);
                // 转换为类型化数组
                let byteArray = new Uint8Array(bytesCode);

                // 将base64转换为ascii码
                for (let i = 0; i < bytes.length; i++) {
                    byteArray[i] = bytes.charCodeAt(i);
                }
                // 生成Blob对象（文件对象）
                return new Blob([bytesCode], {type: imgtype});
            },
            generateName(name) {
                //有重复name的时候处理一下
                while (this.fileList.filter((file) => file.name === name).length > 0) {
                    let dotIndex = name.lastIndexOf('.');
                    let nameWithOutExtension = name.substring(0, dotIndex);
                    let extension = name.substring(dotIndex);
                    name = nameWithOutExtension + '(1)' + extension;
                }
                return name;
            },
            ajax(data, newName, isFormData) {
                if (isFormData) {
                    axios.request({
                        url: this.action,
                        method: 'post',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: data
                    }).then(r => {
                        console.log(r);
                        let url = this.parseResponse(r); // 使用用户提供的方法，处理成功时的响应,获取预览图(服务器一般返回该图片在服务器上的ID,用户的方法用来 拼接为 地址,)
                        this.afterUploadFiles(url, newName); //
                    }).catch(() => {
                        this.uploadError(newName);
                    });
                } else {
                    axios.request({
                        url: this.action,
                        method: 'post',
                        data: data
                    }).then(r => {
                        console.log(r);
                        let url = this.parseResponse(r); // 使用用户提供的方法，处理成功时的响应,获取预览图(服务器一般返回该图片在服务器上的ID,用户的方法用来 拼接为 地址,)
                        this.afterUploadFiles(url, newName); //
                    }).catch(() => {
                        this.uploadError(newName);
                    });
                }

            },
            uploadError(newName) { //失败状态
                let errorFile = this.fileList.filter(f => f.name === newName)[0];
                let errorFileCopy = JSON.parse(JSON.stringify(errorFile));
                errorFileCopy.status = 'fail';
                let fileList = [...this.fileList];
                let index = fileList.indexOf(errorFile);
                fileList.splice(index, 1, errorFileCopy);
                this.$emit('update:fileList', fileList);
            },
            onRemoveFile(file) { //移除文件
                let copy = JSON.parse(JSON.stringify(this.fileList));
                copy.filter((item, index) => {
                    if (item.name === file.name) {
                        copy.splice(index, 1);
                    }
                });
                this.$emit('update:fileList', copy);
            }
        }
    };
</script>

<style lang="less" scoped>

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .spin {
        animation: spin 2s infinite linear;
    }

    .uploader {
        .addFile {
            /*height: 80px;*/
            /*width: 80px;*/
            border: 1px solid #ddd;
            position: relative;
            margin: 8px 4px;

            .row {
                width: 60%;
                height: 0;
                border: 1px solid #ddd;
                position: absolute;
                top: 50%;
                left: 20%;
            }

            .col {
                width: 0;
                height: 60%;
                border: 1px solid #ddd;
                position: absolute;
                left: 50%;
                top: 20%;
            }
        }

        .fileList {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            margin-left: 12px;

            .image-wrapper {
                height: 80px;
                width: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .icon-loading {
                    height: 50%;
                    width: 50%;
                }

                .remove-wrapper {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: flex-end;
                }
            }

            li {
                display: flex;
                align-items: center;
                margin: 8px 4px;
                /*padding: 5px;*/

                .defaultImage {
                    height: 80px;
                    width: 80px;
                    background-color: #ddd;
                }
            }

            .file-name {
                margin-right: auto;
            }

            .success {
                color: green;
            }

            .fail {
                color: red;
            }

            .upload {
                color: #ddd;
            }

        }
    }


</style>
