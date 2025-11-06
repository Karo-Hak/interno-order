import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { BuyerMode, FormValues } from '../wholesaleOrderPage';

type BuyerShort = { _id: string; name: string; phone1?: string };
type AgentShort = { _id: string; name: string; phone1?: string };

export type BuyerSectionPlintProps = {
  buyerMode: BuyerMode;
  setBuyerMode: (m: BuyerMode) => void;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  buyers: BuyerShort[];
  agents: AgentShort[];
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
};

const BuyerSectionPlint: React.FC<BuyerSectionPlintProps> = ({
  buyerMode,
  setBuyerMode,
  register,
  errors,
  buyers,
  agents,
  setValue,
  watch,
}) => {
  const [query, setQuery] = React.useState('');
  const selectedBuyerId = watch('buyerId');

  // --- AGENT state ---
  const [agentQuery, setAgentQuery] = React.useState('');
  const selectedAgentId = watch('agentId');
  const agentDiscount = watch('agentDiscount');
  const agentSum = watch('agentSum');

  const normalized = (s: string) => s.toLowerCase().trim();

  const filtered = React.useMemo(() => {
    const q = normalized(query);
    if (!q) return buyers.slice(0, 20);
    return buyers
      .filter((b) =>
        [b.name, b.phone1 ?? ''].map(normalized).some((x) => x.includes(q)),
      )
      .slice(0, 20);
  }, [buyers, query]);

  const filteredAgents = React.useMemo(() => {
    const q = normalized(agentQuery);
    if (!q) return agents.slice(0, 20);
    return agents
      .filter((a) =>
        [a.name, a.phone1 ?? ''].map(normalized).some((x) => x.includes(q)),
      )
      .slice(0, 20);
  }, [agents, agentQuery]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const exact = buyers.find(
      (b) =>
        `${b.name} ${b.phone1 ?? ''}`.trim().toLowerCase() ===
        val.trim().toLowerCase(),
    );
    if (exact) {
      setValue('buyerId', exact._id, { shouldDirty: true });
    }
  };

  const clearSelection = () => {
    setQuery('');
    setValue('buyerId', '', { shouldDirty: true });
  };

  // --- AGENT handlers ---
  const handleAgentQueryChange = (val: string) => {
    setAgentQuery(val);
    const exact = agents.find(
      (a) =>
        `${a.name} ${a.phone1 ?? ''}`.trim().toLowerCase() ===
        val.trim().toLowerCase(),
    );
    if (exact) {
      setValue('agentId', exact._id, { shouldDirty: true });
    }
  };

  const clearAgent = () => {
    setAgentQuery('');
    setValue('agentId', '', { shouldDirty: true });
    // При снятии агента чистим и связанные поля
    setValue('agentDiscount', '', { shouldDirty: true });
    setValue('agentSum', '', { shouldDirty: true });
  };

  return (
    <section className="card" style={{ padding: 8, marginBottom: 8 }}>
      {/* ---- BUYER ---- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6 }}>
        <strong>Գնորդ / Buyer</strong>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="radio" value="existing" checked={buyerMode === 'existing'} onChange={() => setBuyerMode('existing')} />
          Existing
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="radio" value="new" checked={buyerMode === 'new'} onChange={() => setBuyerMode('new')} />
          New
        </label>
      </div>

      {buyerMode === 'existing' ? (
        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr auto' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <input
              list="plint-buyer-list"
              placeholder="Search buyer by name or phone…"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
            <datalist id="plint-buyer-list">
              {filtered.map((b) => (
                <option key={b._id} value={`${b.name} ${b.phone1 ?? ''}`.trim()} />
              ))}
            </datalist>

            <input type="hidden" {...register('buyerId', { required: buyerMode === 'existing' })} />
            {errors.buyerId && <span style={{ color: 'crimson' }}>Ընտրեք գնորդին ցանկից</span>}

            {!!selectedBuyerId && (
              <small style={{ opacity: 0.7 }}>
                Selected Buyer ID: <code>{selectedBuyerId}</code>
              </small>
            )}
          </div>
          <button type="button" onClick={clearSelection}>Clear</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
          <input placeholder="Անուն" {...register('buyer.name', { required: true, minLength: 2, maxLength: 200 })} />
          <input placeholder="Հեռ․ 1" {...register('buyer.phone1', { required: true, pattern: /^[0-9+()\-\s]{6,20}$/ })} />
          <input placeholder="Հեռ․ 2" {...register('buyer.phone2', { pattern: /^[0-9+()\-\s]{6,20}$/ })} />
          <input placeholder="Մարզ" {...register('buyer.region', { maxLength: 120 })} />
          <input placeholder="Հասցե" {...register('buyer.address', { maxLength: 300 })} style={{ gridColumn: '1 / span 2' }} />
          {(errors?.buyer?.name || errors?.buyer?.phone1) && (
            <span style={{ color: 'crimson' }}>Անունը և Հեռ․ 1 պարտադիր են</span>
          )}
        </div>
      )}

      {/* ---- AGENT (только select) ---- */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <strong>Գործակալ / Agent</strong>
          <small style={{ opacity: 0.7 }}>(ըստ ցանկության)</small>
        </div>

        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr auto' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <input
              list="plint-agent-list"
              placeholder="Search agent by name or phone…"
              value={agentQuery}
              onChange={(e) => handleAgentQueryChange(e.target.value)}
            />
            <datalist id="plint-agent-list">
              {filteredAgents.map((a) => (
                <option key={a._id} value={`${a.name} ${a.phone1 ?? ''}`.trim()} />
              ))}
            </datalist>

            {/* агент НЕ обязателен */}
            <input type="hidden" {...register('agentId')} />

            {!!selectedAgentId && (
              <small style={{ opacity: 0.7 }}>
                Selected Agent ID: <code>{selectedAgentId}</code>
              </small>
            )}
          </div>
          <button type="button" onClick={clearAgent}>Clear</button>
        </div>

        {/* Если выбран агент — показываем скидку и сумму */}
        {selectedAgentId ? (
          <div style={{ marginTop: 10, display: 'grid', gap: 6, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Agent Discount, %</span>
              <input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register('agentDiscount')}
                onChange={(e) => {
                  // храним как число/пусто, пересчёт agentSum сделает верхний useEffect
                  const v = e.target.value;
                  setValue('agentDiscount', v === '' ? '' : Number(v), { shouldDirty: true });
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: 4 }}>
              <span>Agent Sum</span>
              <input
                type="number"
                step="0.01"
                placeholder="0"
                value={agentSum === '' ? '' : Number(agentSum)}
                readOnly
              />
            </label>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default BuyerSectionPlint;
