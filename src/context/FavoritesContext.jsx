// src/context/FavoritesContext.jsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/dealsApi';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}

function readGuestFavorites() {
  try {
    return JSON.parse(localStorage.getItem('guestFavorites') || '[]');
  } catch {
    return [];
  }
}

function writeGuestFavorites(list) {
  localStorage.setItem('guestFavorites', JSON.stringify(list));
  window.dispatchEvent(new Event('favoritesChanged'));
}

function isMongoObjectId(value) {
  return /^[a-fA-F0-9]{24}$/.test(String(value || ''));
}

// A single source of truth for favorites:
// - Logged in: uses backend /favorites endpoints
// - Guest: uses localStorage guestFavorites
export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem('access_token') && !!user;

  const loadFavorites = async () => {
    setLoading(true);

    try {
      if (isLoggedIn) {
        const res = await api.get('/favorites/');
        const list = Array.isArray(res.data?.favorites) ? res.data.favorites : [];
        const ids = new Set(list.map((f) => String(f.deal_id)));

        // Also include locally stored favorites (external deals) even when logged in.
        const guest = readGuestFavorites();
        for (const f of guest) ids.add(String(f.deal_id || f.id));

        setFavoriteIds(ids);
      } else {
        const guest = readGuestFavorites();
        setFavoriteIds(new Set(guest.map((f) => String(f.deal_id || f.id))));
      }
    } catch {
      const guest = readGuestFavorites();
      setFavoriteIds(new Set(guest.map((f) => String(f.deal_id || f.id))));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();

    const handler = () => loadFavorites();
    window.addEventListener('favoritesChanged', handler);
    return () => window.removeEventListener('favoritesChanged', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const isFavorite = (dealId) => {
    if (!dealId) return false;
    return favoriteIds.has(String(dealId));
  };

  const addFavorite = async (deal) => {
    const dealId = String(deal?.id || deal?.deal_id);
    if (!dealId) return false;

    if (isLoggedIn) {
      try {
        await api.post('/favorites/', {
          deal_id: dealId,
          deal: deal
            ? {
                id: String(deal.id || deal.deal_id || dealId),
                title: deal.title,
                business_name: deal.business_name || deal.businessName,
                location: deal.location,
                image_url: deal.image_url || deal.imageUrl,
                price: deal.price,
                discount_percentage:
                  deal.discount_percentage || deal.discountPercentage,
                valid_until: deal.valid_until || deal.validUntil,
                description: deal.description,
                category_id: deal.category_id || deal.categoryId,
              }
            : undefined,
        });
        setFavoriteIds((prev) => new Set([...prev, dealId]));
        window.dispatchEvent(new Event('favoritesChanged'));
        return true;
      } catch {
        // Fall back to local storage.
      }
    }

    const guest = readGuestFavorites();
    const exists = guest.some((f) => String(f.deal_id || f.id) === dealId);
    if (!exists) {
      guest.push({
        id: Date.now(),
        deal_id: dealId,
        title: deal?.title,
        created_at: new Date().toISOString(),
      });
      writeGuestFavorites(guest);
      setFavoriteIds((prev) => new Set([...prev, dealId]));
    }
    return true;
  };

  const removeFavorite = async (dealId) => {
    const id = String(dealId);
    if (!id) return false;

    if (isLoggedIn) {
      try {
        await api.delete(`/favorites/${encodeURIComponent(id)}`);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        window.dispatchEvent(new Event('favoritesChanged'));
        return true;
      } catch {
        // Fall back to local storage.
      }
    }

    const guest = readGuestFavorites();
    const updated = guest.filter((f) => String(f.deal_id || f.id) !== id);
    writeGuestFavorites(updated);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    return true;
  };

  const toggleFavorite = async (deal) => {
    const dealId = String(deal?.id || deal?.deal_id);
    if (!dealId) return false;
    if (isFavorite(dealId)) return removeFavorite(dealId);
    return addFavorite(deal);
  };

  const syncGuestFavoritesToAccount = async () => {
    if (!isLoggedIn) return;
    const guest = readGuestFavorites();
    if (!guest.length) return;

    for (const f of guest) {
      const dealId = String(f.deal_id || f.id);
      if (!dealId) continue;
      try {
        await api.post('/favorites/', { deal_id: dealId });
      } catch {
        // ignore duplicates or invalid deals
      }
    }
    localStorage.removeItem('guestFavorites');
    window.dispatchEvent(new Event('favoritesChanged'));
    await loadFavorites();
  };

  const value = useMemo(
    () => ({
      loading,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      reload: loadFavorites,
      syncGuestFavoritesToAccount,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, favoriteIds, isLoggedIn]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export default FavoritesContext;
