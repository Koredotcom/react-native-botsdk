import Color from '../theme/Color';

interface IColorMappings {
  [key: string]: string;
}

const ColorMappings: IColorMappings = {
  ...Color,
};

export default ColorMappings;
