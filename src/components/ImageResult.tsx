import { Image } from "antd";

const ImageResult = ({
  imageUrl,
  width,
  height,
}: {
  imageUrl: string;
  width: number;
  height: number;
}) => {
  return (
    <Image
      src={imageUrl}
      width={width}
      height={height}
      alt="result"
      fallback="placeholder.png"
      preview={false}
    />
  );
};

export default ImageResult;
