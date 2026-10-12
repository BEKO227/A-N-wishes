'use client';
import { useEffect, useMemo, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

const fmt = (t) => t ? t.toDate().toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

export default function Wishes() {
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q,
      (s) => { setFailed(false); setLoaded(true); setList(s.docs.map((d) => ({ id: d.id, ...d.data() }))); },
      () => { setFailed(true); setLoaded(true); });
  }, []);

  const shown = useMemo(() => {
    const s = search.trim().toLowerCase();
    return s ? list.filter((g) => (g.name + ' ' + g.message).toLowerCase().includes(s)) : list;
  }, [list, search]);

  const download = () => {
    const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const rows = [['Name', 'Message', 'Date'], ...list.map((g) => [g.name, g.message, fmt(g.createdAt)])];
    const csv = '\ufeff' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'wishes.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <header className="top">
        <div>
          <h1>Wishes</h1>
          <p className="sub">{failed || !loaded ? '' : `${list.length} message${list.length === 1 ? '' : 's'}`}</p>
        </div>
        <button className="btn ghost" onClick={download} disabled={!list.length}>Download CSV</button>
      </header>

      {!loaded && <p className="note">Loading...</p>}
      {failed && <p className="note">Messages could not be loaded.</p>}

      {loaded && !failed && (<>
        <div className="bar">
          <input className="in" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or message" aria-label="Search" dir="auto" />
        </div>
        {list.length === 0 && <p className="note">No messages yet.</p>}
        {list.length > 0 && shown.length === 0 && <p className="note">No matching messages.</p>}
        <div className="list">
          {shown.map((g) => (
            <article className="item" key={g.id}>
              <b dir="auto">{g.name}</b>
              <p dir="auto">{g.message}</p>
              <footer><time>{fmt(g.createdAt)}</time></footer>
            </article>
          ))}
        </div>
      </>)}
    </main>
  );
}