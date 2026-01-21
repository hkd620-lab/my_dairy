import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  createDiary,
  listDiaries,
  newDiaryId,
  removeDiary,
  updateDiary,
  type DiaryEntry
} from './services/diary'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [items, setItems] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [dateKey, setDateKey] = useState<string>(todayKey())
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  // React StrictMode에서 useEffect가 2번 실행될 수 있어, 초기 로딩만 1회로 제한
  const didInit = useRef(false)

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) || null,
    [items, selectedId]
  )

  async function refresh() {
    setLoading(true)
    setError('')
    setStatus('불러오는 중...')
    try {
      const list = await listDiaries(100)
      setItems(list)
      setStatus(`불러오기 완료: ${list.length}개`)
    } catch (e: any) {
      setError(String(e?.message || e))
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    void refresh()
  }, [])

  function resetForm() {
    setSelectedId(null)
    setDateKey(todayKey())
    setTitle('')
    setContent('')
  }

  function fillFromSelected(x: DiaryEntry) {
    setSelectedId(x.id)
    setDateKey(x.dateKey || todayKey())
    setTitle(x.title || '')
    setContent(x.content || '')
  }

  async function onSave() {
    setLoading(true)
    setError('')
    setStatus('저장 중...')

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    const dk = (dateKey || '').trim() || todayKey()

    if (!trimmedTitle && !trimmedContent) {
      setLoading(false)
      setStatus('')
      setError('제목/내용 중 하나는 입력해야 저장됩니다.')
      return
    }

    try {
      if (!selectedId) {
        const id = newDiaryId()
        await createDiary({
          id,
          dateKey: dk,
          title: trimmedTitle,
          content: trimmedContent
        })
        setStatus('새 일기 저장 완료')
        resetForm()
      } else {
        await updateDiary({
          id: selectedId,
          dateKey: dk,
          title: trimmedTitle,
          content: trimmedContent
        })
        setStatus('수정 저장 완료')
      }
      await refresh()
    } catch (e: any) {
      setError(String(e?.message || e))
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm('정말 삭제할까요?')) return
    setLoading(true)
    setError('')
    setStatus('삭제 중...')
    try {
      await removeDiary(id)
      setStatus('삭제 완료')
      if (selectedId === id) resetForm()
      await refresh()
    } catch (e: any) {
      setError(String(e?.message || e))
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 16 }}>
      <h2 style={{ margin: '8px 0 12px' }}>My Dairy (Firestore)</h2>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Left: List */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={refresh} disabled={loading}>
              새로고침
            </button>
            <button onClick={resetForm} disabled={loading}>
              새 일기
            </button>
          </div>

          <div style={{ fontSize: 12, marginBottom: 8 }}>
            {status && <div>{status}</div>}
            {error && <div style={{ color: 'crimson' }}>{error}</div>}
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
            {items.length === 0 ? (
              <div style={{ padding: 12, fontSize: 14 }}>일기가 없습니다.</div>
            ) : (
              items.map((x) => (
                <div
                  key={x.id}
                  onClick={() => fillFromSelected(x)}
                  style={{
                    padding: 12,
                    cursor: 'pointer',
                    borderTop: '1px solid #eee',
                    background: x.id === selectedId ? '#f5f7ff' : 'white'
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{x.dateKey}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {x.title || '(제목 없음)'}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                    {(x.content || '').slice(0, 60)}
                    {(x.content || '').length > 60 ? '…' : ''}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        fillFromSelected(x)
                      }}
                      disabled={loading}
                    >
                      편집
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        void onDelete(x.id)
                      }}
                      disabled={loading}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ marginBottom: 8, fontSize: 13, opacity: 0.8 }}>
            {selected ? `편집 중: ${selected.id}` : '새 일기 작성'}
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12 }}>날짜</span>
              <input
                type="date"
                value={dateKey}
                onChange={(e) => setDateKey(e.target.value)}
                disabled={loading}
              />
            </label>

            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12 }}>제목</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                disabled={loading}
              />
            </label>

            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12 }}>내용</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                rows={12}
                disabled={loading}
              />
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => void onSave()} disabled={loading}>
                {selectedId ? '수정 저장' : '새로 저장'}
              </button>
              {selectedId && (
                <button onClick={resetForm} disabled={loading}>
                  편집 취소
                </button>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
            저장 위치: <code>users/{'{uid}'}/diaries/{'{diaryId}'}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
