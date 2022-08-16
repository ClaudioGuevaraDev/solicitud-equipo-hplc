function CanceledModal({ handleCanceled }) {
  return (
    <div
      className="modal fade"
      id="canceledModal"
      tabIndex={-1}
      aria-labelledby="canceledModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              ¿Estás seguro de cancelar la solicitud?
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={handleCanceled}
            >
              CANCELAR SOLICITUD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanceledModal;
