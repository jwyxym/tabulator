class DownloadFile {
    start = async (blob, fileName) => {
        // #ifdef H5
            if (window.showSaveFilePicker) {
                let opts = {
                    suggestedName: `${fileName}.ydk`,
                    types: [{
                        description: '',
                        accept: {
                            'application/octet-stream': ['.ydk']
                        }
                    }],
                    excludeAcceptAllOption: true
                };
    
                let handle = await window.showSaveFilePicker(opts);
                let writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}.ydk`;
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 10000);
            }
        // #endif
        // #ifdef APP-PLUS
        // #endif
    };
}

const Download = new DownloadFile();

export default Download;