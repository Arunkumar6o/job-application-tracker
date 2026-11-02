import React from 'react';

/**
 * ConfirmModal Component
 * Simple modal prompting the user to confirm before destructive actions (e.g. deleting an application).
 */
const ConfirmModal = ({
  isOpen,
  title = 'Delete Application',
  message = 'Are you sure you want to delete this application? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-container-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="confirm-warning-text">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner spinner-white" />
                <span>Deleting...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
