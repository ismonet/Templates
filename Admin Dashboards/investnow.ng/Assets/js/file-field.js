(function () {
    'use strict'

    Vue.component('file-field', {
        template: `<input type="file" ref="fileInput" :accept="accept" :id="fieldId" v-on:change="extractBase64"/>`,
        props: ['value', 'accept'],
        computed: {
            fieldId: function () {
                return `file-input-${this.compId}`
            }
        },
        data: () => ({
            compId: null,
        }),
        methods: {
            extractBase64() {
                this.getFile(this.$refs.fileInput).then(base64 => {
                    this.$emit('input', base64)
                })
            },
            getFile: function (input) {
                let reader = new FileReader();
                return new Promise(function (resolve, reject) {
                    if (input.type.toLowerCase() !== 'file' || input.files.length <= 0) {
                        reject("Invalid file input");
                    }
                    let file = input.files[0];

                    reader.onerror = function () {
                        reader.abort();
                        reject(new Error("Error parsing file"));
                    };
                    reader.onload = function () {

                        //This will result in an array that will be recognized by C#.NET WebApi as a byte[]
                        let bytes = Array.from(new Uint8Array(this.result));

                        //if you want the base64encoded file you would use the below line:
                        let base64StringFile = btoa(bytes.map(function (item) {
                            return String.fromCharCode(item)
                        }).join(""));

                        //Resolve the promise with your custom file structure
                        resolve(base64StringFile);
                    };
                    reader.readAsArrayBuffer(file);
                });
            }
        },
        beforeMount() {
            this.compId = utils.generateRandomNumber()
        }
    })
})()