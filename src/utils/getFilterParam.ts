export function getFilterParam(filters: any): string {
  const filterArray = Object.entries(filters)
    .map(([key, value]) =>
      value === undefined || value === null || value === ''
        ? null
        : ({
            field: key,
            value: String(value)
          } as any)
    )
    ?.filter(Boolean);

  const jsonFilter = JSON.stringify(filterArray);
  return jsonFilter;
}
