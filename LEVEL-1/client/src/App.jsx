import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import ProductCard from "./components/ProductCard";

const TEST_PRODUCTS = [
  {
    _id: 'test-1',
    name: 'Mechanical Keyboard',
    description: 'Tactile switches, RGB backlight, TKL layout.',
    price: 89.99,
    stock: 14,
  },
  {
    _id: 'test-2',
    name: 'Ultrawide Monitor',
    description: '34-inch curved display, 144Hz, 1ms response time.',
    price: 549.00,
    stock: 0,           // ← intentionally out of stock to test the badge
  },
]



function App() {
  return (
    <div className="app">
      <Navbar/>

      <main className="main-content">
        <div className="container">


          {/* Test: LoadingSpinner */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#374151' }}>
              LoadingSpinner — isolated test
            </h2>
            <LoadingSpinner message="Fetching products..." />
          </section>


           {/* Test: ProductCard grid */}
          <section>
            <h2 style={{ marginBottom: '1rem', color: '#374151' }}>
              ProductCard — isolated test
            </h2>
            <div className="product-grid">
              {TEST_PRODUCTS.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </section>
          
        </div>
      </main>
    </div>
  )
}

export default App
