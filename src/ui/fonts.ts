import { Figtree_500Medium, Figtree_700Bold, Figtree_800ExtraBold, useFonts } from '@expo-google-fonts/figtree';

export const figtreeFaces = {
  Figtree_500Medium,
  Figtree_700Bold,
  Figtree_800ExtraBold,
};

export function useGastitoFonts() {
  return useFonts(figtreeFaces);
}
