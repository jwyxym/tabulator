class UniappFuncs {
    async selectFile (f : Function) : Promise<any> {
        let result;
        try {
            // @ts-ignore
            uni.chooseFile({
                extension : ['.cdb'],
                // @ts-ignore
                success : async (res : UniApp.ChooseFileSuccessCallbackResult) => { result = await f(res); }
            });
        } catch (err) {
            console.error('选择文件失败:', err);
        } finally {
            return result;
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
}

const Uniapp = new UniappFuncs()

export default Uniapp;