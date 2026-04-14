"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Filters } from "./Filters";
import { CharacterGrid } from "./CharacterGrid";
import type { CharacterWithRelations } from "@/types";

type FilterState = {
  search: string;
  race: string;
  class: string;
  minLevel: number;
  maxLevel: number;
  sort: string;
  limit: number;
};

const defaultFilters: FilterState = {
  search: "",
  race: "",
  class: "",
  minLevel: 1,
  maxLevel: 20,
  sort: "newest",
  limit: 32,
};

export function CommunityFeed() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    search: searchParams.get("search") || "",
  });
  const [characters, setCharacters] = useState<CharacterWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: filters.search,
        race: filters.race,
        class: filters.class,
        minLevel: filters.minLevel.toString(),
        maxLevel: filters.maxLevel.toString(),
        sort: filters.sort,
        limit: filters.limit.toString(),
        page: page.toString(),
      });

      const res = await fetch(`/api/community?${params}`);
      const data = await res.json();

      setCharacters(data.characters);
      setTotal(data.total);
      setPages(data.pages);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchCharacters, 300);
    return () => clearTimeout(timeout);
  }, [fetchCharacters]);

  function updateFilters(partial: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <Filters filters={filters} onChange={updateFilters} total={total} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-36 bg-gray-800" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CharacterGrid
          characters={characters}
          page={page}
          pages={pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
