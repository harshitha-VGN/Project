import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Footer from './components/Footer.jsx';
import Profile from './pages/profile.jsx';
import Dashboard from './pages/dashboard.jsx';
import MyExperiences from './pages/explore.jsx';
import SubmitExperience from './pages/submitexperience.jsx';
import AuthForm from './pages/authentication.jsx';
import Home from './pages/Home.jsx';
import MyContributions from './pages/MyContributions';
 
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';

const AppLayout = () => {
    const location = useLocation();
    
   
    const noNavbarPaths = ['/login', '/register'];
    const showNavbar = !noNavbarPaths.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
           <main className={showNavbar ? "pt-24" : ""}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<AuthForm />} />
                    <Route path="/register" element={<AuthForm />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/explore" element={<MyExperiences />} />
                    <Route path="/submitexperience" element={<SubmitExperience />} />
                    <Route path="/myexperience" element={<MyContributions />} />
                    <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
                </Routes>
            </main>
             {showNavbar && <Footer />}
        </>
    );
};

function App() {
    return (
          <div 
            className="w-full min-h-screen bg-cover bg-center bg-fixed"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto-format&fit=crop')"}}
        >
            <Router>
                <AppLayout />
            </Router>
        </div>
    );
}

export default App;
