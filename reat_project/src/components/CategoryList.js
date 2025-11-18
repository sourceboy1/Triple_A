// src/components/CategoryList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api"; // Capital A

// Hook to fetch categories and share across components
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await Api.get("categories/");
        if (!mounted) return;
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return { categories, loading, error };
}

// Component to render category links (uses API-provided slug)
export default function CategoryList({ className = "category-list" }) {
  const { categories, loading } = useCategories();

  if (loading) return <div className={className}>Loading categories...</div>;
  if (!categories.length) return <div className={className}>No categories</div>;

  return (
    <div className={className}>
      {categories.map((category) => (
        <Link
          key={category.category_id}
          to={`/shop/${encodeURIComponent(category.slug)}`}
          className="category-link"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
