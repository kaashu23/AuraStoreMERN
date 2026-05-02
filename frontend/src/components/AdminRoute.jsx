import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  // Check role from Clerk public metadata (synced from MongoDB)
  // Note: We'll need to make sure the sync actually puts the role there.
  const isAdmin = user.publicMetadata.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
