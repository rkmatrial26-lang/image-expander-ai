import React, { useEffect } from 'react';

const AdComponent: React.FC = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="w-full my-4 flex justify-center">
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-5351996954376656"
            data-ad-slot="1103581418"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdComponent;
