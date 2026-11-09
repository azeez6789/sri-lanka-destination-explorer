import Image from 'next/image';

export default function BrandMark() {
  return (
    <Image
      className="brand-icon"
      src="/destinations/sigiriya.png"
      alt=""
      width={38}
      height={38}
    />
  );
}