import React, { useState } from 'react';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  email?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name,
  email,
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Filter out unwanted placeholder photos (especially the bearded man stock photo)
  const isBlockedImage = !avatar || 
    avatar.includes('photo-1535713875002-d1d0cf377fde') || 
    avatar.includes('1500648767791-00dcc994a43e') ||
    avatar.includes('placeholder') ||
    (avatar.includes('images.unsplash.com') && avatar.includes('?w=100'));

  // If it's a Google photo or valid external avatar, prioritize it
  const isGoogleAvatar = avatar?.includes('googleusercontent.com');
  const finalAvatarBlocked = !isGoogleAvatar && isBlockedImage;

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl sm:text-3xl'
  };

  // Get first letter of name or email (e.g. 'H' for hamze.zakarie@gmail.com)
  const displayName = name?.trim() || email?.split('@')[0] || 'U';
  const initial = displayName[0].toUpperCase();

  // Consistent pleasant gradient background based on initial
  const getGradient = (char: string) => {
    const code = (char.charCodeAt(0) + (email?.length || 0)) % 5;
    switch (code) {
      case 0: return 'from-blue-600 to-indigo-700';
      case 1: return 'from-blue-500 to-blue-700';
      case 2: return 'from-indigo-600 to-blue-800';
      case 3: return 'from-sky-600 to-blue-700';
      default: return 'from-blue-700 to-slate-800';
    }
  };

  if (!finalAvatarBlocked && !imgError) {
    return (
      <img
        src={avatar}
        alt={displayName}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 shadow-xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getGradient(initial)} text-white font-black flex items-center justify-center shrink-0 shadow-xs select-none tracking-tight ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
};
