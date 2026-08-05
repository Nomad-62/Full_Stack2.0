import { useMemo, useState, useCallback, memo } from 'react';
import { addDays, format, startOfWeek, endOfWeek, isToday } from 'date-fns';

const initialPosts = [
  { id: 1, title: 'Product launch', date: '2026-07-22', time: '09:00', type: 'Marketing' },
  { id: 2, title: 'Blog recap', date: '2026-07-24', time: '14:00', type: 'Content' },
  { id: 3, title: 'Community check-in', date: '2026-07-23', time: '18:00', type: 'Community' }
];

const PostPill = memo(function PostPill({ post, onSelect }) {
  return (
    <button className={`post-pill ${post.type === 'Content' ? 'secondary' : ''}`} onClick={() => onSelect(post)}>
      {post.title} • {post.time}
    </button>
  );
});

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-07-22'));
  const [draft, setDraft] = useState({ title: '', date: '2026-07-22', time: '12:00', type: 'Marketing' });
  const [selectedPost, setSelectedPost] = useState(initialPosts[0]);

  const safeSelectedDate = useMemo(() => {
    return selectedDate instanceof Date && !Number.isNaN(selectedDate.getTime()) ? selectedDate : new Date();
  }, [selectedDate]);

  const weekStart = startOfWeek(safeSelectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(safeSelectedDate, { weekStartsOn: 1 });

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i += 1) {
      result.push(addDays(weekStart, i));
    }
    return result;
  }, [weekStart]);

  const postsByDay = useMemo(() => {
    return days.reduce((acc, day) => {
      const key = format(day, 'yyyy-MM-dd');
      acc[key] = posts.filter((post) => post.date === key);
      return acc;
    }, {});
  }, [days, posts]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;

    const nextPost = {
      id: Date.now(),
      title: draft.title.trim(),
      date: draft.date,
      time: draft.time,
      type: draft.type
    };

    setPosts((current) => [...current, nextPost]);
    const parsedDate = new Date(`${draft.date}T00:00:00`);
    if (!Number.isNaN(parsedDate.getTime())) {
      setSelectedDate(parsedDate);
    }
    setSelectedPost(nextPost);
    setDraft({ title: '', date: draft.date, time: draft.time, type: draft.type });
  }, [draft]);

  const handleSelect = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  return (
    <div className="app-shell">
      <div className="card">
        <div className="toolbar">
          <div>
            <h1>Interactive Post Calendar</h1>
            <p>Plan and manage scheduled posts for the week.</p>
          </div>
          <button onClick={() => setSelectedDate(new Date())}>Jump to today</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            aria-label="Post title"
            placeholder="Add a post"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          />
          <input
            aria-label="Post date"
            type="date"
            value={draft.date}
            onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
          />
          <input
            aria-label="Post time"
            type="time"
            value={draft.time}
            onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
          />
          <select
            aria-label="Post type"
            value={draft.type}
            onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}
          >
            <option value="Marketing">Marketing</option>
            <option value="Content">Content</option>
            <option value="Community">Community</option>
          </select>
          <button type="submit">Schedule post</button>
        </form>

        <div className="calendar-grid" role="grid" aria-label="Weekly calendar">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            return (
              <div key={key} className={`day-cell ${isToday(day) ? 'is-today' : ''}`} role="gridcell">
                <div className="day-header">{format(day, 'EEE d')}</div>
                {postsByDay[key].map((post) => (
                  <PostPill key={post.id} post={post} onSelect={handleSelect} />
                ))}
              </div>
            );
          })}
        </div>

        <div className="summary">
          <span>Total posts: {posts.length}</span>
          <span>Week: {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}</span>
          <span>Selected: {selectedPost?.title || 'None'}</span>
        </div>
      </div>
    </div>
  );
}
