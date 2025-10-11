import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '../AddCoopCeilinOrder';

type Props = {
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
};

const PhotoUrls: React.FC<Props> = ({ register, setValue, watch }) => {
  const urls: string[] = watch('picUrl') || [];
  const draft: string = watch('_picUrlDraft') || '';

  const add = () => {
    const v = String(draft || '').trim();
    if (!v) return;
    setValue('picUrl', [...urls, v], { shouldDirty: true });
    setValue('_picUrlDraft', '');
  };
  const remove = (idx: number) => {
    const next = urls.slice();
    next.splice(idx, 1);
    setValue('picUrl', next, { shouldDirty: true });
  };

  return (
    <section className="card" style={{ padding: 12, marginBottom: 12 }}>
      <h3>Photos (URLs)</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input placeholder="https://..." {...register('_picUrlDraft')} />
        <button type="button" onClick={add}>+ Add</button>
      </div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {urls.map((u, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href={u} target="_blank" rel="noreferrer">{u}</a>
            <button type="button" onClick={() => remove(i)}>remove</button>
          </li>
        ))}
        {urls.length === 0 && <li style={{ opacity: 0.6 }}>No urls</li>}
      </ul>
    </section>
  );
};

export default PhotoUrls;
