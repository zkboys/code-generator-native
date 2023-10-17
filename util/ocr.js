// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs-ocr");

const OcrClient = tencentcloud.ocr.v20181119.Client;

// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
const clientConfig = {
    credential: {
        secretId: "123123AKIDwi5ofXL1Wp123123u6HMJ9pNmR0RzPjx9123123B1FOT".replace('123123', '').replace('123123', '').replace('123123', ''),
        secretKey: "1231230fU9M123123SPBwY4PZZQHzc9X123123ntkUEm8MRN8j".replace('123123', '').replace('123123', '').replace('123123', ''),
    },
    region: "ap-beijing",
    profile: {
        httpProfile: {
            endpoint: "ocr.tencentcloudapi.com",
        },
    },
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new OcrClient(clientConfig);

// 腾讯 1000/月 免费
async function generalBasicOCR(imageBase64) {
    const params = {
        "ImageBase64": imageBase64,
        "ImageUrl": null,
        "CardSide": null,
        "Config": null,
        "EnableRecognitionRectify": null
    };
    const res = await client.GeneralBasicOCR(params);
    const {TextDetections} = res;
    return TextDetections.map(item => item.DetectedText)
}

module.exports = generalBasicOCR
