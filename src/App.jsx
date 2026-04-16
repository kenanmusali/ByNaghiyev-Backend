import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import LogoSvg from '../public/assets/svg/logo.svg'
import bgSvg from '../public/assets/svg/bg-body.svg'
import "./Login.css"
import "./admin.css"

const App = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (email === "admin@bynaghiyev.com" && password === "HelloNaghiyev2026") {
      setIsLoading(true)
      setError("")
      
      try {
        // Clear any existing auth first
        localStorage.removeItem("isAuth")
        
        // Small delay to ensure removal is processed
        await new Promise(resolve => setTimeout(resolve, 50))
        
        // Set new auth
        localStorage.setItem("isAuth", "true")
        
        // Verify it was set
        const checkAuth = localStorage.getItem("isAuth")
        console.log("Auth set:", checkAuth) // Debug log
        
        // Ensure storage is committed
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Navigate with replace to prevent back button issues
        navigate("/admin", { replace: true })
      } catch (err) {
        console.error("Login error:", err)
        setError("Login failed. Please try again.")
        setIsLoading(false)
      }
    } else {
      setError("Wrong email or password")
    }
  }

  return (
    <div className='Login-Page'>
      <img src={bgSvg} className='bg-body' alt="" />
      
      <div className="Login">
        <img className='Logo' src={LogoSvg} alt="Logo" />
        
        <h1 className="Welcome-Title">Welcome</h1>
        <p className="Welcome-Subtitle">Sign in to access your Admin panel</p>

        <div className="SlotSection">
          <div className="Input-Group">
            <input
              type="email"
              className="InputField"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="InputField"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: "#ffffff",
                  mixBlendMode: "difference",
                  marginRight: "10px"
                
                }}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              className={`Login-Button ${isLoading ? 'loading' : ''}`} 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'ACCESSING...' : 'LOGIN'}
            </button>
          </div>
        </div>
        
        <div className="Footer-Note">
          <span>Protected area · Admin only</span>
        </div>
      </div>
    </div>
  )
}

export default App