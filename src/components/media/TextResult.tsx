import React, { useEffect, useState } from 'react';

const TextResult = ({ resultUrl }: { resultUrl: string }) => {
  const [text, setText] = useState<string>('');

  useEffect(() => {
    fetch(resultUrl)
      .then((response) => response.text())
      .then((text) => {
        setText(text);
      });
  }, [resultUrl]);


  return (
    <div>
      <h3>Text Result</h3>
      <p>{text}</p>
    </div>
  )
};

export default TextResult;
