import RootLayout from './layouts/RootLayout';
import PublicRoutes from './routes/PublicRoutes/PublicRoutes';

function App() {
  return (
    <>
      <RootLayout>
        <div className='max-w-7xl mx-auto p-4'>
          <PublicRoutes />
        </div>
      </RootLayout>
    </>
  );
}

export default App;
