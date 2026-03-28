import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LogoSvg from '../public/assets/svg/logo.svg'
import bgSvg from '../public/assets/svg/bg-body.svg'
import "./Login.css"

const App = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    if (email === "admin@bynaghiyev.com" && password === "HelloNaghiyev2026") {
      setIsLoading(true)
      localStorage.setItem("isAuth", "true")
      setTimeout(() => {
        navigate("/admin")
      }, 500)
    } else {
      alert("Wrong email or password")
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
            />
            
            <input
              type="password"
              className="InputField"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            
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