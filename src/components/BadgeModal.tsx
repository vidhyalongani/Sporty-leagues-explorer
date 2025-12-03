import React, { useEffect, useRef } from 'react';
import fallbackBadge from '../assets/fallback-badge.svg';
import type { League } from '../types/league';

type BadgeModalProps = {
  league: League;
  strBadge?: string | null;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ league, strBadge, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  };
  return (
     <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${league.strLeague} badge`} onClick={onClose}>
      <div
        className="modal"
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{league.strLeague}</div>
          <button className="close-btn" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="badge-shell">
          {strBadge ? (
            <img
              alt={`${league.strLeague} badge`}
              className="badge-img"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(event) => {
                const target = event.currentTarget;
                if (target.dataset.fallbackApplied === 'true') return;
                target.dataset.fallbackApplied = 'true';
                target.src = fallbackBadge;
              }}
              data-fallback-applied="false"
              src={strBadge}
            />
          ) : (
            <div className="badge-placeholder" aria-busy="true">
              <div className="spinner" aria-hidden="true" />
            </div> 
          )}
        </div>
        <div className="modal-meta">
          {league.strSport && <span className="tag sport">{league.strSport}</span>}
          {league.strLeagueAlternate && <span className="tag alt-name">{league.strLeagueAlternate}</span>}
        </div>
      </div>
    </div>
  );

};

export default BadgeModal;
