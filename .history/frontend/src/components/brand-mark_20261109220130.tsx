import Image from 'next/image';

export default function BrandMark() {
  return (
    <Image
      className="brand-icon"
      src="/sri-lanka-mark.svg"
      alt=""
      width={38}
      height={38}
    />
  );
}