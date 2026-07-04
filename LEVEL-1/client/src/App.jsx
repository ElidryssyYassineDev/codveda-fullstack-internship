// Cleaned up — test data removed.
// ProductList now owns all product state internally.

import Navbar from './components/Navbar'
import ProductList from './components/ProductList'

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <ProductList />
        </div>
      </main>
    </div>
  )
}

export default App