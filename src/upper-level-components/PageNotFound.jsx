import React from 'react'

function PageNotFound() {
  const styles = {
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      height: '100vh',
      width: '100vw',
    },
  }

  return (
    <div style={styles.main}>
      <h1>Page not Found :(</h1>
    </div>
  )
}

export default PageNotFound
