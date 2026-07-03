// Purpose: Site-wide header. Displays the app title.
// Receives no props for now — it always shows the same content.
// Will receive a theme toggle callback in Milestone 7.

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar__brand">
                <span className="navbar__title">Product Manager</span>
            </div>
            <nav className="navbar__links">
                <span className="navbar__tag">level 2 - React</span>
            </nav>
        </header>
    )
}

export default Navbar