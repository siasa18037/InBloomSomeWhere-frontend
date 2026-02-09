export default function Loading({ text = "กำลังโหลดความสดใส..." }) {
  return (
    <div 
      className="d-flex flex-column align-items-center justify-content-center" 
      style={{ 
        top: 0, 
        left: 0, 
        height: '100vh', 
      }}
    >
      <div 
        className="spinner-border text-danger mb-3" 
        role="status" 
        style={{ width: '3rem', height: '3rem', borderWeight: '0.25em' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      
      <div 
        className="fw-medium text-secondary animate-pulse" 
        style={{ letterSpacing: '1px' }}
      >
        {text}
      </div>
    </div>
  );
}