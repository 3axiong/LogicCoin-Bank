import React, {useEffect, useRef, useState } from 'react';
import { students, products as productsSeed, activities, instructors } from '../data/mockData';


const InstructorPortal = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentInstructor] = useState(instructors[0]);
  const [products, setProducts] = useState(productsSeed);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productFilter, setProductFilter] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activityList, setActivityList] = useState(activities);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [studentList, setStudentList] = useState(students);
  const [confirm, setConfirm] = useState({ open: false, message: '', onConfirm: null });
  const [alert, setAlert] = useState({ open: false, message: '' });

  const showAlert = (message) => setAlert({ open: true, message });
  const closeAlert = () => setAlert({ open: false, message: '' });

  const askConfirm = (message, onConfirm) => {
    setConfirm({ open: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirm({ open: false, message: '', onConfirm: null });
  };

  const openEditTransaction = (activity) => {
    setEditingTxn(activity);
    setShowTxnModal(true);
  };
  const adjustStudentBalance = (studentId, delta) => {

    setStudentList(prev =>
      prev.map(s => (s.id === studentId ? { ...s, balance: s.balance + delta } : s))
    );
    setSelectedStudent(prev =>
      prev && prev.id === studentId ? { ...prev, balance: prev.balance + delta } : prev
    );
  };

  const saveTransaction = ({ amount }) => {
    if (!editingTxn) return;

    const id = editingTxn.id;
    const oldAmount = Number(editingTxn.amount);
    const newAmount = Number(amount);
    const delta = oldAmount - newAmount;

    setActivityList(prev =>
      prev.map(a => (a.id === id ? { ...a, amount: newAmount } : a))
    );

    if (selectedActivity?.id === id) {
      setSelectedActivity(prev => (prev ? { ...prev, amount: newAmount } : prev));
    }

    if (!editingTxn.refunded) {
      adjustStudentBalance(editingTxn.studentId, delta);
    }

    setShowTxnModal(false);
    setEditingTxn(null);
    setCurrentView('studentActivities');
  };

  const refundTransaction = (activity) => {
    const act = activity ?? editingTxn;
    if (!act) return;
    if (act.refunded) return; 

    const { id, studentId } = act;
    const refundAmount = Number(act.amount) || 0;

    setActivityList(prev =>
      prev.map(a => (a.id === id ? { ...a, refunded: true } : a))
    );

    if (selectedActivity?.id === id) {
      setSelectedActivity(prev => (prev ? { ...prev, refunded: true } : prev));
    }

    adjustStudentBalance(studentId, refundAmount);

    setShowTxnModal(false);
    setEditingTxn(null);
    setCurrentView('studentActivities');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const saveProduct = (data) => {
    if (editingProduct) {
      // edit existing
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? { ...p, ...data } : p))
      );
    } else {
      // create new
      setProducts(prev => [{ id: `p_${Date.now()}`, ...data }, ...prev]);
    }
    setShowProductModal(false);
  };

  // Return unique purchasers (student summary) for a product by matching activity.product name
  const purchasersFor = (product) => {
    if (!product) return [];
    const pname = (product.name || '').toLowerCase();
    const matches = activityList.filter(a => (a.product || '').toLowerCase().includes(pname));

    const byStudent = {};
    matches.forEach(a => {
      const sid = a.studentId;
      if (!byStudent[sid]) {
        byStudent[sid] = { studentId: sid, name: a.studentName || 'Unknown', count: 0, total: 0 };
      }
      byStudent[sid].count += 1;
      byStudent[sid].total += Number(a.amount || 0);
    });

    return Object.values(byStudent);
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
        <div className="welcome-cta-row">
          <button className="cta-button" onClick={() => setCurrentView('students')}>
            Students List
          </button>
          <button className="cta-button" onClick={() => setCurrentView('productsList')}>
            Products List
          </button>
        </div>
      </div>
    </div>
  );

  const StudentsView = () => (
    <div className="students-container">
      <button className="back-button" onClick={() => setCurrentView('welcome')}>Back</button>
      <h1 className="page-title">Students List</h1>
      <div className="students-table">
        {studentList.map(student => (
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
    </div>
  );

  const StudentActivitiesView = () => {
    const studentActivities = activityList.filter(activity => 
      activity.studentId === selectedStudent?.id
    );

    return (
      <div className="activities-container">
        <h1 className="page-title">{selectedStudent?.name}'s Activities</h1>
        <h2 className="page-title balance-title">
          Current Balance: <span className="balance-highlight">{selectedStudent?.balance ?? 0}</span>
        </h2>
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
              <div>
                {activity.amount} coins
                {activity.refunded && <span className="term refunded">Refunded</span>}
              </div>
              <button
                className={`edit-button ${activity.refunded ? 'disabled' : ''}`}
                onClick={() => {
                  if (activity.refunded) {
                    showAlert('This transaction has been refunded.');
                    return;
                  }
                  setSelectedActivity(activity);
                  setCurrentView('editActivity');
                }}
                aria-disabled={activity.refunded}
              >
                Edit Activity
              </button>
            </div>
          ))}
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
        <button
          className="action-button"
          onClick={() => {
            if (selectedActivity?.refunded) {
              showAlert('This transaction has been refunded.');
              return;
            }
            openEditTransaction(selectedActivity);
          }}
        >
          Edit Transaction
        </button>
        <button
          className="action-button"
          disabled={selectedActivity?.refunded}
          onClick={() => {
            if (!selectedActivity || selectedActivity.refunded) return;
            askConfirm(
              'Refund this transaction?',
              () => refundTransaction(selectedActivity)
            );
          }}
        >
          Refund
        </button>
        </div>
      </div>
    </div>
  );

  const ProductsListView = () => {
    // Treat productFilter as selected product id when using dropdown; empty => show all
    const filteredProducts = products.filter(p => !productFilter || String(p.id) === String(productFilter));

    
    return (
      <div className="students-container">
        <button className="back-button" onClick={() => setCurrentView('welcome')}>Back</button>
        <h1 className="page-title">Products List</h1>

        <div className="filter-row">
          <label className="form-label">
              <select
                className="form-input filter-select"
                value={productFilter}
                onChange={(e) => {
                  setProductFilter(e.target.value);
                }}
              >
              <option value="">All products</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
          </label>
        </div>

        <div className="students-table">
          {filteredProducts.map(p => (
            <div key={p.id} className="student-row">
              <div className="student-name">{p.name} <span className="balance-highlight">{p.price} coins</span></div>
              <button
                className="view-activities-button"
                onClick={() => {
                  // select product in dropdown and open purchasers modal
                  setProductFilter(String(p.id));
                  setSelectedProduct(p);
                }}
              >
                View Purchasers
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PurchasersModal = ({ product, onClose }) => {
    const list = purchasersFor(product);
    const onView = (studentId) => {
      const student = studentList.find(s => s.id === studentId);
      if (student) setSelectedStudent(student);
      onClose();
      setCurrentView('studentActivities');
    };

    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-panel">
          <h2 className="modal-title">Purchasers of "{product.name}"</h2>
          <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
            {list.length === 0 && <div className="confirm-message">No purchases found for this product.</div>}
            {list.map(p => (
              <div key={p.studentId} className="student-row" style={{ color: '#1e8b5c', background: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="student-name">{p.name} <span style={{ marginLeft: 8, fontSize: 14, color: '#666' }}>({p.count} purchase(s), {p.total} coins)</span></div>
                <button className="view-activities-button" onClick={() => onView(p.studentId)}>View Activities</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  const ProductsManagementView = () => (
    <div className="products-container">
      <button className="back-button" onClick={() => setCurrentView('welcome')}>Back</button>
      <h1 className="page-title">Edit Products</h1>
      <div className="add-product-container">
        <button className="add-product-button" onClick={openAddModal}>Add Product +</button>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-title">{product.name}</div>
            <div className="product-description">
              {product.description?.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <div className="product-terms">
              {product.terms?.map((term, index) => (
                <span key={index} className="term">{term}</span>
              ))}
            </div>
            <div className="product-price">{product.price} Coins</div>
            <button className="purchase-button"
            onClick={() => openEditModal(product)}>Edit Product</button>
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
          <button className="nav-item" onClick={() => setCurrentView('productsList')}>
            Products List
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
      {currentView === 'productsList' && (
        <ProductsListView />
      )}
      {currentView === 'products' && <ProductsManagementView />}
      {selectedProduct && (
        <PurchasersModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {currentView === 'products' && showProductModal && (
        <ProductModal
          key={editingProduct?.id || 'new'} 
          initialValues={editingProduct}
          onClose={() => setShowProductModal(false)}
          onSubmit={saveProduct}
        />
      )}
      {showTxnModal && currentView === 'editActivity' && editingTxn && (
        <EditTransactionModal
          key={editingTxn.id}
          initialValues={editingTxn}
          onClose={() => setShowTxnModal(false)}
          onSave={(data) => askConfirm(
            `Save changes? New amount: ${Number(data.amount)} coins.`,
            () => saveTransaction(data)
          )}
          onRefund={() => askConfirm(
            'Refund this transaction?',
            () => refundTransaction() 
          )}
        />
      )}
      {confirm.open && (
        <ConfirmModal
          message={confirm.message}
          onCancel={closeConfirm}
          onConfirm={() => {
            confirm.onConfirm?.();
            closeConfirm();
          }}
        />
      )}
      {alert.open && (
        <AlertModal
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

const ProductModal = ({ initialValues, onClose, onSubmit }) => {
  const isEdit = !!initialValues;

  const [name, setName] = useState(initialValues?.name || '');
  const [price, setPrice] = useState(
    initialValues?.price !== undefined ? String(initialValues.price) : ''
  );
  const [termsInput, setTermsInput] = useState(
    initialValues?.terms?.join('\n') || ''
  );
  const [description, setDescription] = useState(initialValues?.description || '');
  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('input, textarea, button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // If the product to edit changes while modal is open, refresh fields
  useEffect(() => {
    setName(initialValues?.name || '');
    setPrice(initialValues?.price !== undefined ? String(initialValues.price) : '');
    setTermsInput(initialValues?.terms?.join('\n') || '');
    setDescription(initialValues?.description || '');
  }, [initialValues]);

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
    const terms = termsInput.split('\n').map(s => s.trim()).filter(Boolean);
    onSubmit({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      terms
    });
  };

  const onBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="modal-backdrop"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      ref={dialogRef}
    >
      <div className="modal-panel">
        <h2 id="product-modal-title" className="modal-title">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={submit} className="modal-form">
          <label className="form-label">
            Product Name
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bronze Membership"
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
            Terms (one per line)
            <textarea
              className="form-textarea"
              value={termsInput}
              onChange={(e) => setTermsInput(e.target.value)}
              rows={4}
            />
            {errors.terms && <div className="form-error">{errors.terms}</div>}
          </label>

          <label className="form-label">
            Description (optional; supports multiple lines)
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
            <button type="submit" className="btn-primary" disabled={price === '' || Number(price) < 0}>
              {isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const EditTransactionModal = ({ initialValues, onClose, onSave, onRefund }) => {
  const [amount, setAmount] = useState(
    initialValues?.amount !== undefined ? String(initialValues.amount) : ''
  );
  const [error, setError] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('input, button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const validate = () => {
    if (amount === '' || Number.isNaN(Number(amount)) || Number(amount) < 0) {
      setError('Enter a valid non-negative price.');
      return false;
    }
    setError('');
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ amount: Number(amount) });
  };

  const onBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="modal-backdrop"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-transaction-title"
      ref={dialogRef}
    >
      <div className="modal-panel">
        <h2 id="edit-transaction-title" className="modal-title">Edit Transaction</h2>

        <form onSubmit={submit} className="modal-form">
          <label className="form-label">
            Paid Price (Coins)
            <input
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 250"
            />
            {error && <div className="form-error">{error}</div>}
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              type="button"
              className="btn-danger"
              onClick={onRefund}
              title="Mark this transaction as refunded"
            >
              Refund
            </button>

            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmModal = ({ message, onCancel, onConfirm }) => {
  const dialogRef = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  const onBackdropClick = (e) => { if (e.target === e.currentTarget) onCancel(); };

  return (
    <div
      className="modal-backdrop"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      ref={dialogRef}
    >
      <div className="modal-panel confirm">
        <h2 id="confirm-title" className="modal-title">Please Confirm</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              if (busy) return;
              setBusy(true);
              onConfirm();
            }}
            disabled={busy}
          >
            {busy ? 'Working…' : 'Yes, Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
const AlertModal = ({ message, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const onBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="modal-backdrop"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      ref={dialogRef}
    >
      <div className="modal-panel confirm">
        <h2 id="alert-title" className="modal-title">Notice</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorPortal;

