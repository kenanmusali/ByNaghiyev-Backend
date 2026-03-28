import { useState, useEffect, useCallback } from 'react'
import { fetchSiteData } from '../services/githubService'
import defaultData from '../data/site-data.json'

const CACHE_KEY = 'bynaghiyev_site_data'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCached = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return null }
    return data
  } catch { return null }
}

const setCache = (data) => {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

const useSiteData = () => {
  const [data,    setData]    = useState(() => getCached() ?? defaultData)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached()
      if (cached) { setData(cached); setLoading(false); return }
    }
    setLoading(true)
    setError(null)
    try {
      const d = await fetchSiteData()
      setData(d)
      setCache(d)
    } catch (err) {
      setError(err.message)
      // Keep whatever data we already have (default or previous cache)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: () => load(true) }
}

export default useSiteData