import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { CartContext, CartProvider } from './context/CartContext';

const API_URL = 'http://localhost:5001/api';

function BookCard({ book }) {
  const { addToCart } = useContext(CartContext);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'all var(--transition-fast)' }} className="book-card">
      <Link to={'/books/' + book.id} style={{ display: 'block' }}>
        <img src={book.image} alt={book.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderBottom: '1px solid #eee' }} />
      </Link>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link to={'/books/' + book.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>{book.title}</h3>
        </Link>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>by {book.author}</p>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>${book.price}</span>
          <button onClick={() => addToCart(book)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    // Fetch limited books for featured
    axios.get(`${API_URL}/books`)
      .then(res => setFeaturedBooks(res.data.data.books.slice(0, 4)))
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        height: '400px', 
        backgroundImage: 'linear-gradient(to bottom, rgba(43, 43, 43, 0.4), rgba(43, 43, 43, 0.8)), url(/absolute/path/to/hero)',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center'
      }}>
        <img src="/Users/sidduhamigi/.gemini/antigravity/brain/e501fb5f-f672-4283-b211-d1c5c01a76c0/hero_banner_1776281634863.png" style={{position:'absolute', width: '100%', height: '400px', objectFit: 'cover', zIndex: -1}} alt="Hero" />
        <div style={{ zIndex: 1, padding: '2rem' }}>
          <h1 style={{ fontSize: '3.5rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Discover Your Next Great Read</h1>
          <p style={{ fontSize: '1.25rem', marginTop: '1rem', opacity: 0.9 }}>Join our community of book lovers and explore thousands of titles.</p>
          <Link to="/books" className="btn btn-primary" style={{ marginTop: '2rem', fontSize: '1.125rem' }}>Start Browsing</Link>
        </div>
      </div>

      {/* Featured Section */}
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Featured Arrivals</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {featuredBooks.map(book => (
            <BookCard 
              key={book.id}
              book={book}
            />
          ))}
          {featuredBooks.length === 0 && <p style={{textAlign: 'center', gridColumn: '1 / -1'}}>Loading books from database...</p>}
        </div>
      </div>
    </div>
  );
}

function AuthForm({ type }) {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '500px' }}>
      <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        {error && <div style={{ color: 'red', background: '#fee', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" placeholder="you@domain.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary mt-4 w-full" style={{ fontSize: '1.125rem' }}>
            {type === 'login' ? 'Enter Bookstore' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          {type === 'login' ? "Don't have an account? " : "Already reading with us? "}
          <Link to={type === 'login' ? "/register" : "/login"} style={{ fontWeight: '600' }}>
            {type === 'login' ? 'Sign Up' : 'Log In'}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/books`)
      .then(res => {
        setBooks(res.data.data.books);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Book Catalog</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
        {loading ? (
          <p>Loading catalog...</p>
        ) : books.length === 0 ? (
          <p>The catalog is currently empty. Please run the database seeder!</p>
        ) : (
          books.map(book => (
            <BookCard 
              key={book.id}
              book={book}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`${API_URL}/books/${id}`)
      .then(res => setBook(res.data.data.book))
      .catch(err => console.error("Error fetching book:", err));
  }, [id]);

  if (!book) return <div className="container mt-8"><p style={{textAlign: 'center'}}>Loading Book Details...</p></div>;

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <img src={book.image} alt={book.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
        </div>
        <div style={{ flex: '2 1 400px', paddingLeft: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{book.title}</h1>
          <h3 className="text-muted" style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '2rem' }}>{book.author}</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>${book.price}</span>
            {book.originalPrice && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.25rem' }}>${book.originalPrice}</span>}
          </div>
          
          <button onClick={() => addToCart(book)} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem', marginBottom: '3rem' }}>
            Add to Cart
          </button>
          
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Synopsis</h4>
            <p style={{ lineHeight: 1.8, fontSize: '1.125rem' }}>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  const fetchBooks = () => {
    axios.get(`${API_URL}/books`).then(res => setBooks(res.data.data.books));
  };
  
  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`);
      fetchBooks();
    } catch (err) { alert('Failed to delete'); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Very basic mock payload for quick add
      await axios.post(`${API_URL}/books`, {
        title: newTitle, author: "System Admin", description: "Admin generated book.",
        price: 10.99, category: "Misc", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600"
      });
      setNewTitle('');
      fetchBooks();
    } catch (err) { alert('Failed to add book'); }
  };

  if (!user) return <div className="container mt-8"><p style={{textAlign: 'center'}}>Access Denied. Admins only.</p></div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Add Book</h3>
        <form onSubmit={handleAdd} className="flex gap-4">
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Book Title..." className="input-field" style={{ maxWidth: '300px' }} />
          <button type="submit" className="btn btn-primary">Add Book</button>
        </form>
      </div>

      <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Inventory Management</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}><th>Title</th><th>Price</th><th>Stock</th><th>Action</th></tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem 0' }}>{b.title}</td>
                <td>${b.price}</td>
                <td>{b.stock}</td>
                <td><button onClick={() => handleDelete(b.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CartView() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please sign in to checkout.");
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({ bookId: item.id, quantity: item.quantity, price: parseFloat(item.price) })),
        total: parseFloat(total)
      };
      // Send token with request natively (Axios intercepts this from context now)
      await axios.post(`${API_URL}/orders`, payload);
      clearCart();
      alert("Order placed successfully! Enjoy your new books.");
      navigate('/');
    } catch (err) {
      alert("Checkout failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="container mt-8"><h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Your cart is empty.</h2><p style={{ textAlign: 'center' }} className="mt-4"><Link to="/books" className="btn btn-primary">Browse Books</Link></p></div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Your Cart</h2>
      <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center" style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div className="flex gap-4 items-center">
              <img src={item.image} alt={item.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <h4 style={{ fontSize: '1.125rem' }}>{item.title}</h4>
                <p className="text-muted">${item.price} x {item.quantity}</p>
              </div>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem', marginRight: '1rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.bookId)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center mt-8">
          <div><span style={{ fontSize: '1.25rem' }}>Total:</span> <strong style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>${total}</strong></div>
          <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.25rem' }}>
            {loading ? "Processing..." : "Checkout Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{ background: '#ffffff', padding: '1rem 0', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>
          BookNest
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/books" style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>Catalog</Link>
          {user ? (
            <>
              <span className="text-muted">Hello, {user.email.split('@')[0]}</span>
              <Link to="/admin" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.875rem' }}>Admin</Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-muted)' }}>Log Out</button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>Sign In</Link>
          )}
          <Link to="/cart" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', borderRadius: '50px' }}>Cart ({cartItemCount})</Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Catalog />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<AuthForm type="login" />} />
                <Route path="/register" element={<AuthForm type="register" />} />
                <Route path="/cart" element={<CartView />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
