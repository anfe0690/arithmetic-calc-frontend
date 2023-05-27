export default function PageMessage({ pageMessage, setPageMessage }) {
  let className = 'alert alert-primary alert-dismissible';
  if (pageMessage && pageMessage.type) {
    switch (pageMessage.type) {
      case 'success':
        className = 'alert alert-success alert-dismissible'
        break;
      case 'failure':
        className = 'alert alert-danger alert-dismissible'
        break;
      default:
        break;
    };
  }

  function handleCloseAlert() {
    setPageMessage(null);
  }

  return (
    <>
      { pageMessage && pageMessage.message ? (
        <div className='row'>
          <div className={className}>
            {pageMessage.message}
            <button type="button" className="btn-close" onClick={handleCloseAlert}></button>
          </div>
        </div>
      ) : null }
    </>
  );
}