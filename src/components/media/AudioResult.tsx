const AudioResult = ({ resultUrl }: { resultUrl: string }) => {
  return <audio controls src={resultUrl} />
};

export default AudioResult;
