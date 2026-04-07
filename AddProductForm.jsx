
const AddProductForm = ({ isOpen, onClose, categoryName }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = (e) => {
    setIsSubmitting(true);
    // The form submission happens via the hidden iframe
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glassmorphism animate-in">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {!isSuccess ? (
          <>
            <h2 className="modal-title">Añadir Nuevo Ítem</h2>
            <p className="modal-subtitle">Agregando a la sección: <strong>{categoryName}</strong></p>
            
            <form 
              action="https://docs.google.com/forms/d/e/1FAIpQLSeMebN2f5094ti9XEM5CjO69-NvA092XcQXsO7rosY2IJExZg/formResponse"
              method="POST"
              target="hidden_iframe_add"
              onSubmit={handleSubmit}
              className="add-product-form"
            >
              <input type="hidden" name="entry.212367061" value={categoryName} />
              
              <div className="form-group">
                <label>Título del Ítem</label>
                <input 
                  type="text" 
                  name="entry.1216653391" 
                  required 
                  placeholder="Ej: SoloDrill Pro"
                  className="glass-input"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  name="entry.435979945" 
                  required 
                  rows="4"
                  placeholder="Describe brevemente el producto..."
                  className="glass-input"
                ></textarea>
              </div>

              <div className="form-group">
                <label>URL de la Imagen</label>
                <input 
                  type="url" 
                  name="entry.320511821" 
                  required 
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="glass-input"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn primary gradient-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Guardar Ítem'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="success-screen animate-fade-in">
            <div className="success-icon">✓</div>
            <h2>¡Ítem Añadido!</h2>
            <p>Los datos se han enviado correctamente a la base de datos de Google.</p>
            <p className="small-note">Recuerda sincronizar desde el panel para ver los cambios.</p>
          </div>
        )}
      </div>
      <iframe name="hidden_iframe_add" id="hidden_iframe_add" style={{ display: 'none' }}></iframe>
    </div>
  );
};

// Expose to window for global access in the static environment
window.AddProductForm = AddProductForm;
