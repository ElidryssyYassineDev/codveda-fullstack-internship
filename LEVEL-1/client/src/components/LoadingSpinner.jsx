// Purpose: Reusable loading indicator.
// Props:
//   message (string, optional) — label shown below the spinner.
//                                Defaults to "Loading..." if not provided.

function LoadingSpinner({message = 'Loading...'}){
    return(
        <div className="spinner-wrapper">
            <div className="spinner"/>
            <p className="spinner-message">{message} </p>
        </div>
    )
}

export default LoadingSpinner