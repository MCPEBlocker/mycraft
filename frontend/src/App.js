import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Nav from './components/navbar/nav';
import HomePage from './routes/Home';
import NewsPage from './routes/News';
// import News from './components/news/news';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/news">
          <NewsPage />
        </Route>
        <Route path="/blog">
          <Nav title="Blog">
            <h1>Blog</h1>
          </Nav>
        </Route>
        <Route path="/profile">
          <Nav title="Profile">
            <h1>Profile</h1>
          </Nav>
        </Route>
        <Route path="/notifications">
          <Nav title="Notifications">
            <h1>Notifications</h1>
          </Nav>
        </Route>
        <Route path="/crafts">
          <Nav title="Crafts">
            <h1>Crafts</h1>
          </Nav>
        </Route>
        <Route path="/chat">
          <Nav title="Chat">
            <h1>Chat</h1>
          </Nav>
        </Route>
        <Redirect from="/home" to="/" />
      </Switch>
    </Router>
  );
}

export default App;
