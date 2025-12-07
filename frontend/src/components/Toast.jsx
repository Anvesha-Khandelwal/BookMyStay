import './Toast.css'

function Toast({ message, type }) {
  return (
    <div className={`toast ${type}`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
      <span>{message}</span>
    </div>
  )
}

export default Toast

