import api from "../apis/api";
import { ensureTrailingSlash } from "./util";

export const arrayBufferToTempFile = (buffer: ArrayBuffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/qr_${Date.now()}.png`;

    fs.writeFile({
      filePath,
      data: buffer,
      encoding: "binary",
      success: () => resolve(filePath),
      fail: reject
    });
  });
};

export const arrayBufferToImage = (
  canvas: any,
  buffer: ArrayBuffer
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/qr_${Date.now()}.png`;
    fs.writeFile({
      filePath,
      data: buffer,
      encoding: "binary",
      success: () => {
        // 2. 创建 Image 对象
        const img = canvas.createImage();
        img.src = filePath;

        img.onload = () => resolve(img);
        img.onerror = reject;
      },
      fail: reject
    });
  });
};

export const networkUrlToImage = (canvas: any, url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: res => {
        if (res.statusCode !== 200) {
          reject("download failed");
          return;
        }

        const img = canvas.createImage();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = res.tempFilePath;
      },
      fail: reject
    });
  });
}

const uploadFileWithAliyunFormData = (filePath: string, uploadUrl: string, formData: any) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: uploadUrl,
      filePath,
      name: 'file', // 默认 file
      formData: formData,
      success(res) {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res);
        } else {
          console.log('上传失败', res.data)
          reject(new Error('上传失败'));
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}
export const uploadFileToAliyunOss = async (filePath: string) => {
  const fileName = filePath.split('/').pop() || '';
  const formRes = await api.common.aliyunOssFormdata();
  let formData = { ...formRes.data.formData }
  formData.key = formRes.data.filePath + fileName
  formData.success_action_status = 201
  
  await uploadFileWithAliyunFormData(filePath, formRes.data.uploadUrl, formData);
  const url = ensureTrailingSlash(formRes.data.bucketDomain) + formData.key
  return url;
}
