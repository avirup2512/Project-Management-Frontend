import Alert from 'react-bootstrap/Alert';

function AlertComponent({param}) {
  return (
    <>
      <Alert key={param.alertType} variant={param.alertType}>
          {param.message}
        </Alert>
    </>
  );
}

export default AlertComponent;