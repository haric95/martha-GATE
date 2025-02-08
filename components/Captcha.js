import { useEffect, useState } from "react";

export default function Captcha({ onChange, captchaKey }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  useEffect(() => {
    onChange(selectedIndexes);
  }, [selectedIndexes]);
  useEffect(() => {
    setSelectedIndexes([]);
  }, [captchaKey]);

  const imageLocations = new Array(9).fill(null).map((value, index) => {
    return `/api/captcha-image?index=${index}&key=${captchaKey}`;
  });
  function toggleIndex(index) {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((v) => v !== index);
      } else {
        return [...prev, index];
      }
    });
  }
  return (
    <div className="captcha">
      <h4 style={{ marginBottom: 0 }}>To Join GATE:</h4>
      <h2 style={{ marginTop: 0 }}>Select All The Electronics:</h2>
      <div className="captcha-images">
        {imageLocations.map((imageUrl, index) => (
          <div
            key={index}
            onClick={() => toggleIndex(index)}
            className={selectedIndexes.includes(index) ? "selected" : ""}
          >
            <img src={imageUrl} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
