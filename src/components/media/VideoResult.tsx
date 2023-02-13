const VideoResult = ({ resultUrl }: { resultUrl: string }) => {
  return <video src={resultUrl} autoPlay={true} muted={true} loop={true} controls={true} />;
};

export default VideoResult;
