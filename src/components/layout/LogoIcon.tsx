import { CSSProperties, FC } from 'react';

const LogoIcon: FC<{ width?: number; height?: number; fill?: string; style?: CSSProperties }> = ({ width, height, fill = 'currentcolor', style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 120 109"
      style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', aspectRatio: 1, ...style }}
    >
      <g transform="translate(-91,205) scale(0.05,-0.05)" fill={fill}>
        <path d="M1840 3010 l0 -1070 60 0 60 0 0 1070 0 1070 -60 0 -60 0 0 -1070z" />
        <path d="M2100 3005 l0 -1065 60 0 60 0 0 1067 0 1067 -60 -2 -60 -2 0 -1065z" />
        <path d="M2357 3165 c-1 -503 -5 -985 -9 -1070 l-6 -155 69 0 69 0 0 532 0 531 59 -46 59 -47 1 -485 1 -485 70 0 70 0 1 405 1 405 394 -405 c354 -364 401 -406 459 -405 l65 0 0 1070 0 1070 -60 0 -60 0 0 -525 0 -524 -65 65 -65 65 -3 434 c-2 239 -5 446 -5 460 -1 14 -28 25 -62 25 l-60 0 0 -395 -1 -395 -390 395 c-358 363 -396 395 -460 395 l-69 0 -3 -915z m1182 -465 l0 -130 -83 90 c-46 50 -287 297 -535 551 l-451 461 7 119 8 119 527 -540 527 -540 0 -130z m-187 -136 l188 -207 0 -110 0 -110 -535 544 -535 544 7 122 8 123 340 -350 c187 -192 424 -443 527 -556z" />
        <path d="M3800 3010 l0 -1070 60 0 60 0 0 1070 0 1070 -60 0 -60 0 0 -1070z" />
        <path d="M4053 4067 c-7 -8 -13 -489 -13 -1070 l0 -1057 70 0 70 0 0 1070 0 1070 -57 0 c-31 0 -62 -6 -70 -13z" />
      </g>
    </svg>
  );
};

export default LogoIcon;
