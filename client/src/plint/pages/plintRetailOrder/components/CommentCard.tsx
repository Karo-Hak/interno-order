import React from 'react';

const CommentCard: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="card">
    <div className="card-header"><strong>Комментарий</strong></div>
    <div className="card-body">
      <textarea className="inp" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  </div>
);

export default CommentCard;
