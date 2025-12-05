import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, onAuthChange } from "../lib/auth";
import type { User } from "firebase/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const updateUserState = (authUser: User | null) => {
      if (isMounted) {
        setUser(authUser);
        setIsLoading(false);
      }
    };
    
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      updateUserState(currentUser);
      return;
    }
    
    const unsubscribe = onAuthChange(updateUserState);
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
