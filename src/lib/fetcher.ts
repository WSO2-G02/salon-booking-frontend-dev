export async function fetchData(endpoint: string) {
  const res = await fetch(`/api/${endpoint}`)
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
  return res.json()
}
