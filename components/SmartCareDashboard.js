
"use client";
import React, { useEffect, useState } from 'react';
import SmartCareCard from './SmartCareCard';

const CARD_CONFIG = [
  { key: 'feeding', icon: '🍼', title: 'Feeding' },
  { key: 'sleep', icon: '😴', title: 'Sleep' },
  { key: 'growth', icon: '📈', title: 'Growth' },
  { key: 'recommendation', icon: '⚡', title: 'Recommendation' },
];

export default function SmartCareDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('/api/smartcare')
      .then(res => res.json())
      .then(json => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      });
    const interval = setInterval(() => {
      fetch('/api/smartcare')
        .then(res => res.json())
        .then(json => {
          if (isMounted) {
            setData(json);
          }
        });
    }, 120000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
      {loading ? (
        <div className="col-span-2 text-center py-8 animate-pulse">Loading Smart Care...</div>
      ) : (
        CARD_CONFIG.map(card => (
          <SmartCareCard
            key={card.key}
            icon={card.icon}
            title={card.title}
            data={data[card.key]}
          />
        ))
      )}
    </div>
  );
}
