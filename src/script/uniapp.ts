class UniappFuncs {
    selectFile (type : Array<string>, f : Function, count : number = 100) : any {
        let result;
        try {
            // @ts-ignore
            uni.chooseFile({
                extension : type,
                count: count,
                success : async (res : UniApp.ChooseFileSuccessCallbackResult) => { result = await f(res); }
            });
        } catch (err) {
            console.error('选择文件失败:', err);
        } finally {
            return result;
        }
    }

    async uploadFile (url : string, files : Array<UniApp.UploadFileOptionFiles>, header : object) : Promise<any> {
        return uni.uploadFile({
            url : url,
            files : files,
            header : header,
        });
    }

    async readFile (file) : Promise<string> {
        if (typeof window !== 'undefined' && window.FileReader) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                // @ts-ignore
                reader.onload = (e) => resolve(e.target.result as string);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        } else {
            return new Promise((resolve, reject) => {
                // @ts-ignore
                uni.readFile({
                    filePath: file.path,
                    encoding: 'utf-8',
                    success: (res) => resolve(res.data),
                    fail: reject
                });
            });
        }
    }

    chkScreen (chk : Function) : void {
        chk();
        // #ifdef H5
        // @ts-ignore
        window.addEventListener('resize', chk)
        // #endif
        
        // #ifdef APP-PLUS
        // @ts-ignore
        uni.onDeviceOrientationChange(chk)
        // #endif
    }

    unchkScreen (chk : Function) : void {
        // #ifdef H5
        // @ts-ignore
        window.removeEventListener('resize', chk)
        // #endif
        
        // #ifdef APP-PLUS
        // @ts-ignore
        uni.offDeviceOrientationChange(chk)
        // #endif
    }

    copy (string) : void {
        uni.setClipboardData({
            data: string,
            success: () => {
                uni.showToast({
                    title: '复制成功',
                });
            },
            fail: () => {
                    uni.showToast({
                    title: '复制失败',
                });
            }
        });
    }

    error (content : string, title : string) : void {
        uni.showModal({
            title : title,
            content : content,
            showCancel : false
        });
    }
}

const UniApp = new UniappFuncs()

export default UniApp;