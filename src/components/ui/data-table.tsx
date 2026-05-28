import { useMemo, useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Download, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type Column<T> = {
  key: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  width?: string;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyText?: string;
  exportable?: boolean;
}

export function DataTable<T>({
  data, columns, searchKeys = [], searchPlaceholder = "Search...",
  toolbar, rowKey, onRowClick, pageSize = 10, emptyText = "No records found", exportable = true,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
    );
  }, [data, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return filtered;
    return [...filtered].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice(page * pageSize, page * pageSize + pageSize);

  const toggleSort = (key: string) => {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        {searchKeys.length > 0 ? (
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder={searchPlaceholder} className="pl-9" />
          </div>
        ) : <div />}
        <div className="flex items-center gap-2">
          {toolbar}
          <Button variant="outline" size="sm" onClick={() => toast.info("Filter panel coming up")}>
            <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Filters
          </Button>
          {exportable && (
            <Button variant="outline" size="sm" onClick={() => toast.success(`Exported ${sorted.length} records`)}>
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface sticky top-0 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={cn("whitespace-nowrap px-4 py-3", c.className)} style={c.width ? { width: c.width } : undefined}>
                  {c.sortValue ? (
                    <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-foreground">
                      {c.header}
                      {sort?.key === c.key ? (sort.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-muted-foreground">{emptyText}</td></tr>
            ) : pageData.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn("border-t transition-colors hover:bg-surface", onRowClick && "cursor-pointer")}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3", c.className)}>{c.accessor(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>Showing {pageData.length === 0 ? 0 : page * pageSize + 1}–{page * pageSize + pageData.length} of {sorted.length}</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="px-3">Page {page + 1} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
