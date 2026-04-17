import { useState, useMemo } from 'react';
import { dbData } from '../services/data';
import logonv from '../assets/img/logonv.png';
import BannerCarousel from '../components/BannerCarousel';
import './Database.css';

const PAGE_SIZE = 50;

function matchesDate(dateStr, q) {
  if (!dateStr) return false;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr.includes(q);
  
  const [yyyy, mm, dd] = parts;
  const dataYMD = `${yyyy}-${mm}-${dd}`;
  const dataDMY = `${dd}/${mm}/${yyyy}`;
  const dataDM = `${dd}/${mm}`;
  const dataY = yyyy;
  const dataY2 = yyyy.slice(2);

  if (q.includes('/')) {
    return dataDMY.startsWith(q) || dataDM.startsWith(q);
  } else if (q.length === 4 || q.length === 2) {
    return dataY.includes(q) || dataY2.includes(q);
  } else {
    return dataYMD.includes(q);
  }
}

export default function Database() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(''); // '' means show all, false would be idle
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'banda', direction: 'asc' });

  const filteredData = useMemo(() => {
    let result = [...dbData];
    
    if (activeFilter !== '') {
      const q = activeFilter.toLowerCase().trim();
      result = result.filter(d => 
        (d.banda && d.banda.toLowerCase().includes(q)) ||
        (d.album && d.album.toLowerCase().includes(q)) ||
        (d.data && matchesDate(d.data, q))
      );
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;

        if (sortConfig.key === 'data') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.data) - new Date(b.data)
            : new Date(b.data) - new Date(a.data);
        } else {
          try {
            return sortConfig.direction === 'asc'
              ? a[sortConfig.key].localeCompare(b[sortConfig.key])
              : b[sortConfig.key].localeCompare(a[sortConfig.key]);
          } catch (e) { return 0; }
        }
      });
    }

    return result;
  }, [activeFilter, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filteredData.length);
  const currentItems = filteredData.slice(start, end);

  const handleSearch = () => {
    setActiveFilter(searchQuery);
    setCurrentPage(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleShowAll = () => {
    setSearchQuery('');
    setActiveFilter(''); 
    setSortConfig({ key: 'banda', direction: 'asc' });
    setCurrentPage(0);
  };

  const handleSort = (key) => {
    if (filteredData.length === 0) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(0);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="pagination">
        <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>
          ◀ Voltar
        </button>
        <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}>
          Próxima ▶
        </button>
      </div>
    );
  };

  return (
    <div className="db-container">
      <BannerCarousel />

      <p className="intro-text">
        PESQUISE POR ÁLBUM, BANDA OU DATA <br /> OU CLIQUE EM ALL
      </p>

      <div className="controls">
        <input 
          type="text" 
          placeholder="PROCURE AQUI" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off" 
        />
        <button onClick={handleSearch}>BUSCAR</button>
        <button onClick={handleShowAll}>ALL</button>
      </div>

      <div className="counter">
        REGISTROS: {filteredData.length > 0 ? `${start + 1} - ${end} de ${filteredData.length}` : '0'}
      </div>

      <Pagination />

      <div className="table-wrapper desktop-only">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('banda')}>
                BANDA <span className="sort">▲▼</span>
              </th>
              <th onClick={() => handleSort('album')}>
                ÁLBUM <span className="sort">▲▼</span>
              </th>
              <th onClick={() => handleSort('data')}>
                RELEASE <span className="sort">▲▼</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx}>
                <td title={item.banda}>{item.banda}</td>
                <td title={item.album}>{item.album}</td>
                <td title={item.data}>{item.data ? item.data.split('-').reverse().join('/') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-only records-list">
        {currentItems.map((item, idx) => (
          <div key={idx} className="record-card">
            <div className="record-header">
              <span className="record-band">{item.banda}</span>
              <span className="record-date">{item.data ? item.data.split('-').reverse().join('/') : ''}</span>
            </div>
            <div className="record-album">{item.album}</div>
          </div>
        ))}
      </div>

      <Pagination />
    </div>
  );
}
