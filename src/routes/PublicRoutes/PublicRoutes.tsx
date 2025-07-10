import CreateNote from '@/pages/CreateNote';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import NoteDetails from '@/pages/NoteDetails';
import Profile from '@/pages/Profile';
import Register from '@/pages/Register';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { Routes, Route } from 'react-router';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path='/create' element={<CreateNote />} />
      <Route path='/edit/:id' element={<CreateNote />} />
      <Route path='/noteDetails/:id' element={<NoteDetails />} />
    </Routes>
  );
};

export default PublicRoutes;
