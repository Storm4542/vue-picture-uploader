export default imageCompress;

function imageCompress(file, obj = {}) {
    return new Promise((resolve, reject) => {

        let {
            size,
            width,
            height,
            fileType,
            qualityArgument
        } = obj;

        if (typeof obj === 'number') {
            size = obj;
        }

        if (file && file.size) {
            //不需要压缩
            if (size && file.size <= size) {
                resolve(file);
                return;
            }
        } else {
            reject({
                msg: '文件参数错误，请确认是否传入了文件'
            });
            return;
        }

        size = size || 100000;

        if (!/(jpg|jpeg|png)$/.test(file.type)) {
            reject({
                msg: '文件格式不是jpg或者png，请确认文件格式'
            });
            return;
        }
        fileType = fileType || file.type;
        switch (fileType) {
            case 'jpg':
            case 'jpeg':
            case 'image/jpeg':
                fileType = 'image/jpeg';
                break;
            case 'png':
            case 'image/png':
                fileType = 'image/png';
                break;
            default:
                reject({
                    msg: '不支持的文件格式'
                });
                return;
        }
        //canvas检测。canvas用来压缩图片
        let canvas = document.createElement('canvas');
        if (!canvas || !canvas.getContext) {
            reject({
                msg: '浏览器不支持canvas'
            });
            return;
        }
        let context = canvas.getContext('2d');

        //FileReader检测。FileReader用来转base64
        if (!window.FileReader) {
            reject({
                msg: '浏览器不支持FileReader'
            });
            return;
        }
        let reader = new FileReader(),
            img = new Image();
        reader.readAsDataURL(file);

        reader.onload = function (e) {
            // e.target.result就是图片base64
            img.src = e.target.result;
        };
        img.onload = function () {
            let originWidth = img.width,
                originHeight = img.height;
            if (width && height) {
                if (width > originWidth && height > originHeight) {
                    //原始分辨率比设定的分辨率小，不需要压缩
                    resolve(file);
                    return;
                }
            } else if (width) {
                if (width > originWidth) {
                    //原始分辨率比设定的分辨率小，不需要压缩
                    resolve(file);
                    return;
                }
                height = originHeight * width / originWidth;
            } else if (height) {
                if (height > originHeight) {
                    //原始分辨率比设定的分辨率小，不需要压缩
                    resolve(file);
                    return;
                }
                width = originWidth * height / originHeight;
            } else {
                let ratio = (size > 0 && size < 1) ? size : 0.9;

                width = (originWidth * ratio) | 0;
                height = (originHeight * ratio) | 0;
            }
            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, 0, 0, width, height);
            canvas.toBlob(function (blob) {
                if (size && size > 1) {

                    if (blob.size <= size) {
                        resolve(blob);
                    } else {
                        imageCompress(blob, obj).then((newBlob) => {
                            resolve(newBlob);
                        });
                    }

                } else {
                    resolve(blob);
                }
            }, fileType, qualityArgument || .8);

        };
    });
}
