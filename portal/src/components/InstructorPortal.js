import React, {useEffect, useRef, useState } from 'react';
import { students, products as productsSeed, activities, instructors } from '../data/mockData';


const InstructorPortal = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentInstructor] = useState(instructors[0]);
  const [products, setProducts] = useState(productsSeed);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [{ id: `p_${Date.now()}`, ...newProduct }, ...prev]);
    setShowAddProductModal(false);
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
      <h1 className="page-title">Edit Products</h1>
      <div className="add-product-container">
        <button className="add-product-button" onClick={() => setShowAddProductModal(true)}>Add Product +</button>
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
      {currentView === 'products' && showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
};

const AddProductModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [termsInput, setTermsInput] = useState(''); // one term per line
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('input, textarea, button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Product name is required.';
    if (price === '' || Number.isNaN(Number(price)) || Number(price) < 0) {
      e.price = 'Enter a valid non-negative price.';
    }

    const lines = termsInput.split('\n').map(s => s.trim()).filter(Boolean);
    if (termsInput && lines.length === 0) e.terms = 'Enter at least one term or leave it blank.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const terms = termsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    onSubmit({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      terms
    });
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-title"
      ref={dialogRef}
    >
      <div className="modal-panel">
        <h2 id="add-product-title" className="modal-title">Add New Product</h2>
        <form onSubmit={submit} className="modal-form">
          <label className="form-label">
            Product Name
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Homework Extension"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </label>

          <label className="form-label">
            Price (Coins)
            <input
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 100"
            />
            {errors.price && <div className="form-error">{errors.price}</div>}
          </label>

          <label className="form-label">
            Terms
            <textarea
              className="form-textarea"
              value={termsInput}
              onChange={(e) => setTermsInput(e.target.value)}
              rows={4}
            />
            {errors.terms && <div className="form-error">{errors.terms}</div>}
          </label>

          <label className="form-label">
            Description
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorPortal;

