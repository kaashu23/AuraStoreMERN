import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCategories from './pages/admin/Categories';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30">
        <Navbar />
        <main className="flex-grow bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>

            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout-success" 
              element={
                <ProtectedRoute>
                  <CheckoutSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/sign-in/*" 
              element={
                <div className="flex justify-center py-24 bg-gray-50">
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
                </div>
              } 
            />
            <Route 
              path="/sign-up/*" 
              element={
                <div className="flex justify-center py-24 bg-gray-50">
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
                </div>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#0B2B26',
            color: '#FFFFFF',
            borderRadius: '0px',
            fontSize: '12px',
            fontWeight: '900',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }
        }} />
      </div>
    </Router>
  );
}

export default App;
