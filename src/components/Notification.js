const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`${message.error ? 'error' : 'success'} notification`}>
      {message.text}
    </div>
  )
}

export default Notification;