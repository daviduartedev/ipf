import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminShell from './admin/AdminShell.jsx';
import Layout from './components/Layout';
import Home from './pages/Home';
import Post from './pages/Post';
import Store from './pages/Store';
import Database from './pages/Database';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminipf/*" element={<AdminShell />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/store" element={<Store />} />
          <Route path="/db" element={<Database />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
