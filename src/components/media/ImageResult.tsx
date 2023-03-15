import { Image } from "antd";

const ImageResult = ({
  resultUrl,
}: {
  resultUrl: string;
}) => {
  return (
    <Image
      src={resultUrl}
      style={{ width: "100%", height: "auto" }}
      alt="result"
      fallback="placeholder.png"
      preview={false}
    />
  );
};

export default ImageResult;
