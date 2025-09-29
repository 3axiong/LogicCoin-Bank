import React, { useState } from 'react';
import { students, products, activities } from '../data/mockData';

const StudentPortal = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [currentStudent, setCurrentStudent] = useState(students[0]); // Bob as default student

  const studentActivities = activities.filter(activity => activity.studentId === currentStudent.id);

  const handlePurchase = (product) => {
    if (currentStudent.balance >= product.price) {
      // Update student balance
      const updatedStudent = {
        ...currentStudent,
        balance: currentStudent.balance - product.price
      };
      setCurrentStudent(updatedStudent);
      
      // Add new activity (in a real app, this would be sent to backend)
      const newActivity = {
        id: activities.length + 1,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        type: "Purchase",
        product: product.name,
        date: new Date().toLocaleDateString('en-US'),
        amount: product.price,
        description: `Purchase ${activities.filter(a => a.studentId === currentStudent.id).length + 1}`
      };
      activities.push(newActivity);
      
      // Redirect back to welcome screen
      setCurrentView('welcome');
      
      // Show success message (optional)
      alert(`Successfully purchased ${product.name} for ${product.price} coins!`);
    } else {
      alert(`Insufficient balance! You need ${product.price} coins but only have ${currentStudent.balance} coins.`);
    }
  };

  const WelcomeView = () => (
    <div className="main-content">
      <div className="left-section">
        <div className="logo-section">
          <div className="logo-circle">
            <div className="logo-text">ASU LOGO</div>
            <div className="globe-icon">🌐</div>
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="welcome-text">Welcome To</div>
        <h1 className="main-title">
          LogicCoin<br />
          Bank Portal
        </h1>
        <div className="center-balance">
          <div className="balance-label">Your Balance</div>
          <div className="balance-amount">{currentStudent.balance}</div>
          <div className="balance-currency">coins</div>
        </div>
        <button className="cta-button" onClick={() => setCurrentView('products')}>
          Use coins
        </button>
      </div>
      <div className="page-indicators">
        <div className="indicator active"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
      </div>
    </div>
  );

  const ProductsView = () => (
    <div className="products-container">
      <h1 className="page-title">Products' List</h1>
      <div className="current-balance-display">
        Your Current Balance: <span className="balance-highlight">{currentStudent.balance} coins</span>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-title">{product.name}</div>
            <div className="product-description">
              {product.description.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <div className="product-terms">
              {product.terms.map((term, index) => (
                <span key={index} className="term">{term}</span>
              ))}
            </div>
            <div className="product-price-section">
              <div className="price-label">Price:</div>
              <div className="product-price">{product.price} Coins</div>
            </div>
            <button 
              className={`purchase-button ${currentStudent.balance < product.price ? 'insufficient-funds' : ''}`}
              onClick={() => handlePurchase(product)}
              disabled={currentStudent.balance < product.price}
            >
              {currentStudent.balance < product.price ? 'Insufficient Funds' : 'Purchase'}
            </button>
            <div className="page-indicators">
              <div className="indicator"></div>
              <div className="indicator"></div>
              <div className="indicator active"></div>
              <div className="indicator"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ActivitiesView = () => (
    <div className="activities-container">
      <h1 className="page-title">Account Activities</h1>
      <div className="activities-table">
        {studentActivities.map(activity => (
          <div key={activity.id} className="activity-row">
            <div>{activity.description}</div>
            <div>{activity.product}</div>
            <div>{activity.date}</div>
            <div>{activity.amount} coins</div>
          </div>
        ))}
      </div>
      <div className="page-indicators">
        <div className="indicator"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
        <div className="indicator active"></div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="user-info">{currentStudent.name}</div>
        <nav className="nav-menu">
          <button className="nav-item" onClick={() => setCurrentView('products')}>
            Use Coins
          </button>
          <button className="nav-item" onClick={() => setCurrentView('activities')}>
            Account Activities
          </button>
          <button className="nav-item">Contact Instructor</button>
        </nav>
        <div className="coin-balance">
          <span className="amount">{currentStudent.balance}</span>
          coins
        </div>
      </header>
      
      {currentView === 'welcome' && <WelcomeView />}
      {currentView === 'products' && <ProductsView />}
      {currentView === 'activities' && <ActivitiesView />}
    </div>
  );
};

export default StudentPortal;
