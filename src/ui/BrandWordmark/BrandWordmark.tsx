import { Image, StyleSheet } from 'react-native';

const LOCKUP = require('../../../assets/brand/lockup-light.png');
const ASPECT = 492 / 168;

type BrandWordmarkProps = {
  height?: number;
};

export function BrandWordmark({ height = 40 }: BrandWordmarkProps) {
  return (
    <Image
      accessibilityRole="image"
      accessibilityLabel="gastito"
      source={LOCKUP}
      resizeMode="contain"
      style={[styles.image, { width: height * ASPECT, height }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flexShrink: 0,
  },
});
