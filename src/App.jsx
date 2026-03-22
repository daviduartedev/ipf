import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Post from './pages/Post';
import Store from './pages/Store';
import Database from './pages/Database';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/store" element={<Store />} />
          <Route path="/db" element={<Database />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
