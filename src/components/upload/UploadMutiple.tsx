/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Upload } from "antd";
import { useState } from "react";
import { RcFile, UploadFile } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { UploadRequestOption } from "rc-upload/lib/interface";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
// form

interface imageList {
  url: string;
  uid: string;
}

interface UploadImageProps {
  imagesUrl: any;
  setImagesUrl: (_imageUrl: any) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  error: boolean;
}

type Props = UploadImageProps;
export const UploadImage = ({ imagesUrl, setImagesUrl }: Props) => {
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const hanldeRemoveFile = (file: UploadFile) => {
    const data = imagesUrl.reduce((acc: imageList[], curValue: imageList) => {
      return curValue.uid !== file.uid ? [...acc, curValue] : acc;
    }, []);
    setImagesUrl(data);
  };

  const hanldeUploadImageToFirebase = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;

    try {
      const firebaseUrl = await uploadImageToFirebase(file as RcFile);
      if (firebaseUrl) {
        const newFile = { url: firebaseUrl, uid: (file as RcFile).uid };
        setImagesUrl((prev: imageList[]) => [...prev, ...[newFile]]);
        onSuccess?.("ok");
      } else {
        onError?.(new Error("Upload to Firebase failed"));
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <div>
        <Upload
          listType="picture-card"
          multiple
          fileList={imagesUrl}
          onPreview={handlePreview}
          customRequest={hanldeUploadImageToFirebase}
          onRemove={(file) => hanldeRemoveFile(file)}
        >
          {uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </>
  );
};
