import './App.css';
import sportyLogo from './assets/sporty-logo.webp';

function App() {
  return (     
    <main className="page">
      <header className="nav">
        <div className="nav-inner">
          <div className="nav-left">
            <img src={sportyLogo} alt="Sporty Group" className="brand-logo" />
            <div className="brand-text">
              <span className="title"> Sporty Leagues Explorer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="content">
        <div className="content-inner">
          <section className="controls" aria-label="Filters">
          </section>
          <section className="leagues" aria-label="Leagues List">
          </section>
        </div>
      </div>

      <footer className="footer">© 2025 Sporty Group</footer>
    </main>
  )
}

export default App
