import { useState, useEffect } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { ProfileData } from 'src/types';

export function useProfile() {
  const { getProfile, user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getProfile();
      
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.message || 'Không thể lấy thông tin profile');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lấy thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  // Sync với user từ AuthContext
  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    refetch: fetchProfile,
  };
}