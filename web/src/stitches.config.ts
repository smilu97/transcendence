import { createStitches } from '@stitches/react';

const stitches = createStitches({
  theme: {
    colors: {
      c1: 'rgb(28, 12, 91)',
      c1hsl: 'hsl(252 76.7% 20.2%)',
      c2: 'rgb(61, 44, 141)',
      c2hsl: 'hsl(251 52.4% 36.3%)',
      c3: 'rgb(145, 107, 191)',
      c3hsl: 'hsl(267 39.6% 58.4%)',
      c4: 'rgb(201, 150, 204)',
      c4hsl: 'hsl(297 34.6% 69.4%)'
    },
  },
});

export const { styled } = stitches;
