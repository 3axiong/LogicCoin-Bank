import React, { useState } from 'react';
import { students, products, activities, instructors } from '../data/mockData';

const InstructorPortal = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentInstructor] = useState(instructors[0]);

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
          Bank Faculty<br />
          Portal
        </h1>
        <button className="cta-button" onClick={() => setCurrentView('students')}>
          Students' List
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

  const StudentsView = () => (
    <div className="students-container">
      <button className="back-button" onClick={() => setCurrentView('welcome')}>Back</button>
      <h1 className="page-title">Students' List</h1>
      <div className="students-table">
        {students.map(student => (
          <div key={student.id} className="student-row">
            <div className="student-name">{student.name}</div>
            <button 
              className="view-activities-button"
              onClick={() => {
                setSelectedStudent(student);
                setCurrentView('studentActivities');
              }}
            >
              View Activities
            </button>
          </div>
        ))}
      </div>
      <div className="page-indicators">
        <div className="indicator"></div>
        <div className="indicator active"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
      </div>
    </div>
  );

  const StudentActivitiesView = () => {
    const studentActivities = activities.filter(activity => 
      activity.studentId === selectedStudent?.id
    );

    return (
      <div className="activities-container">
        <h1 className="page-title">{selectedStudent?.name}'s Activities</h1>
        <div className="activities-table">
          <div className="activity-row activity-header">
            <div>Purchase ID</div>
            <div>Product</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Action</div>
          </div>
          {studentActivities.map(activity => (
            <div key={activity.id} className="activity-row">
              <div>{activity.description}</div>
              <div>{activity.product}</div>
              <div>{activity.date}</div>
              <div>{activity.amount} coins</div>
              <button 
                className="edit-button"
                onClick={() => {
                  setSelectedActivity(activity);
                  setCurrentView('editActivity');
                }}
              >
                Edit Activity
              </button>
            </div>
          ))}
        </div>
        <div className="page-indicators">
          <div className="indicator"></div>
          <div className="indicator"></div>
          <div className="indicator active"></div>
          <div className="indicator"></div>
        </div>
      </div>
    );
  };

  const EditActivityView = () => (
    <div className="edit-activity-container">
      <div className="edit-activity-card">
        <div className="student-info">
          <h2>{selectedStudent?.name}</h2>
          <h3>{selectedActivity?.product}</h3>
          <p>{selectedActivity?.date}</p>
        </div>
        <div className="activity-details">
          <h3>{selectedActivity?.amount} Coins</h3>
        </div>
        <div className="balance-info">
          {selectedStudent?.name}'s Balance: {selectedStudent?.balance} coins
        </div>
        <div className="action-buttons">
          <button className="action-button">Edit Price</button>
          <button className="action-button">Refund</button>
          <button className="action-button">Cancel Purchase</button>
        </div>
        <div className="page-indicators">
          <div className="indicator"></div>
          <div className="indicator"></div>
          <div className="indicator"></div>
          <div className="indicator active"></div>
        </div>
      </div>
    </div>
  );

  const ProductsManagementView = () => (
    <div className="products-container">
      <button className="back-button" onClick={() => setCurrentView('welcome')}>Back</button>
      <h1 className="page-title">Edit Products</h1>
      <div className="add-product-container">
        <button className="add-product-button">Add Product +</button>
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
            <div className="product-price">{product.price} Coins</div>
            <button className="purchase-button">Edit Product</button>
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

  return (
    <div className="app">
      <header className="header">
        <div className="user-info">{currentInstructor.name}</div>
        <nav className="nav-menu">
          <button className="nav-item" onClick={() => setCurrentView('students')}>
            Students List
          </button>
          <button className="nav-item" onClick={() => setCurrentView('products')}>
            Products Settings
          </button>
        </nav>
      </header>
      
      {currentView === 'welcome' && <WelcomeView />}
      {currentView === 'students' && <StudentsView />}
      {currentView === 'studentActivities' && <StudentActivitiesView />}
      {currentView === 'editActivity' && <EditActivityView />}
      {currentView === 'products' && <ProductsManagementView />}
    </div>
  );
};

export default InstructorPortal;

