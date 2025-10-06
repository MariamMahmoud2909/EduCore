import React from 'react';

function TestComponent() {
  console.log('🧪 Testing component imports...');
  
  const testComponents = async () => {
    const components = [
      './components/layout/Navbar.jsx',
      './components/layout/Footer.jsx',
      './pages/LandingPage.jsx',
      './pages/admin/Dashboard.jsx'
    ];
    
    for (const comp of components) {
      try {
        const module = await import(comp);
        console.log(`✅ ${comp} loaded successfully`);
      } catch (error) {
        console.error(`❌ ${comp} failed to load:`, error.message);
      }
    }
  };
  
  React.useEffect(() => {
    testComponents();
  }, []);
  
  return (
    <div style={{padding: '20px'}}>
      <h2>Component Load Test</h2>
      <p>Check browser console for results</p>
    </div>
  );
}

export default TestComponent;