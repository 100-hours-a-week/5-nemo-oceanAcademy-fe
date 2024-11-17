import profile1 from '../assets/images/profile/crab.png';
import profile2 from '../assets/images/profile/jellyfish.png';
import profile3 from '../assets/images/profile/seahorse.png';
import profile4 from '../assets/images/profile/turtle.png';
import profile5 from '../assets/images/profile/whale.png';

const profileImages = [profile1, profile2, profile3, profile4, profile5];

export const getProfileImage = (nickname: string): string => {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % profileImages.length);
  return profileImages[index];
};