import About    from "./components/about"
import Blogs    from "./components/blogs"
import Category from "./components/category"
import Footer   from "./components/footer"
import Header   from "./components/header"
import Navbar   from "./components/navbar"
import Products from "./components/products"
import ZoomWrapper from "./ZoomWrapper"
import useSiteData from "./hooks/useSiteData"

const App = () => {
  const { data, loading, error } = useSiteData()

  return (
    <div className="AdminOn">
      {/* Navbar always shows – uses cached/default data instantly */}
      <Navbar navData={data?.navbar} />

      <Header headerData={data?.header} />

      <ZoomWrapper>
        <About aboutData={data?.about} />
      </ZoomWrapper>

      <Category />

      <ZoomWrapper>
        <Products productsData={data?.products} />
      </ZoomWrapper>

      <ZoomWrapper>
        <Blogs blogsData={data?.blogs} />
      </ZoomWrapper>

      <Footer footerData={data?.footer} />

      {/* Non-blocking error toast */}
      {error && !loading && (
        <div style={{
          position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#333', color: '#fff', padding: '10px 20px',
          borderRadius: 8, fontSize: 13, zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,.25)',
          maxWidth: 'calc(100vw - 32px)', textAlign: 'center',
        }}>
          ⚠️ Could not refresh content — showing cached version.
        </div>
      )}
    </div>
  )
}

export default App