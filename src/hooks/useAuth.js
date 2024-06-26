import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = (setUser) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      setUser(user);
    } else {
      navigate('/login');
    }
  }, [navigate, setUser]);
};

export default useAuth;
