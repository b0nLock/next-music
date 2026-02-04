import React, { useCallback, useMemo, useState } from "react";

type User = {
  id?: number;
  name?: string;
  [k: string]: unknown;
};

const NameDisplay = React.memo(function NameDisplay({
  name,
  onFetch,
}: {
  name: string;
  onFetch: () => void;
}) {
  console.log("NameDisplay render");
  return (
    <div
      style={{
        border: "1px solid #0066cc",
        padding: 12,
        borderRadius: 6,
        background: "#f0f5ff",
      }}
    >
      <div style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
        📍 NameDisplay (React.memo)
      </div>
      <div style={{ marginBottom: 8 }}>
        Fetched name: <strong>{name || "—"}</strong>
      </div>
      <button onClick={onFetch}>Fetch user (jsonplaceholder)</button>
    </div>
  );
});

const ExpensiveDerivedDisplay = React.memo(function ExpensiveDerivedDisplay({
  expensiveDerived,
}: {
  expensiveDerived: string;
}) {
  console.log("ExpensiveDerivedDisplay render");
  return (
    <div
      style={{
        marginTop: 12,
        border: "1px solid #6b3f0a",
        padding: 12,
        borderRadius: 6,
        background: "#fffaf0",
      }}
    >
      <div style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
        🔄 ExpensiveDerivedDisplay (React.memo)
      </div>
      <div>
        Expensive derived: <em>{expensiveDerived}</em>
      </div>
    </div>
  );
});

const CounterBlock = React.memo(function CounterBlock({
  count,
  increment,
}: {
  count: number;
  increment: () => void;
}) {
  console.log("CounterBlock render");
  return (
    <div
      style={{
        border: "1px solid #009600",
        padding: 12,
        borderRadius: 6,
        background: "#f0fff0",
      }}
    >
      <div style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
        🔢 CounterBlock (React.memo)
      </div>
      <div style={{ marginBottom: 8 }}>Counter: {count}</div>
      <button onClick={increment}>Increment counter</button>
    </div>
  );
});

export default function UseMemoPractice(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      console.log("fetchUser called");
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data: User = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const increment = useCallback(() => setCount((c) => c + 1), []);

  const name = user?.name ?? "";

  const expensiveDerived = useMemo(() => {
    console.log("expensiveDerived recalculated");
    let sum = 0;
    for (let i = 0; i < 200000; i++) sum += i % 3;
    return `${name} (len:${name.length}) sum:${sum}`;
  }, [name]);

  console.log("UseMemoPractice (parent) render");

  return (
    <section
      style={{
        padding: 16,
        border: "1px solid #999",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <h3>useMemo / React.memo / useCallback practice</h3>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        ⭐ Check console to see which components re-render when you click
        buttons
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          alignItems: "start",
        }}
      >
        <div>
          <NameDisplay name={name} onFetch={fetchUser} />
          <ExpensiveDerivedDisplay expensiveDerived={expensiveDerived} />
        </div>

        <div>
          <CounterBlock count={count} increment={increment} />
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: "#fff9e6",
              borderRadius: 6,
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            <strong>How it works:</strong>
            <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
              <li>
                Click <strong>Fetch user</strong> → NameDisplay updates (API
                response → memo prevents re-renders when name doesn&apos;t
                change)
              </li>
              <li>
                Click <strong>Increment counter</strong> → Only CounterBlock
                updates (useCallback prevents NameDisplay from re-rendering)
              </li>
              <li>
                useMemo prevents re-calculating expensive value unless name
                changes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
