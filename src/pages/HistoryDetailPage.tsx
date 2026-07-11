import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchIncident } from '../api/incidents'
import { IncidentDetailHeader, IncidentDetailBody } from '../components/history/IncidentDetail'

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { data: incident, isLoading, isError } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => fetchIncident(id as string),
    enabled: Boolean(id),
  })

  const handleBack = () => navigate('/history')

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg-primary font-body text-body text-label-primary antialiased">
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="/intelligence-orange-abstract.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.62]"
        />
      </div>
      <div className="pointer-events-none fixed left-[4%] top-[2%] z-[1] h-[54vw] w-[54vw] rounded-full bg-color-orange/20 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-[14%] right-[4%] z-[1] h-[48vw] w-[48vw] rounded-full bg-[#ffd8b1]/58 blur-[130px]" />

      <main className="relative z-10 mx-auto mt-16 flex w-full max-w-[1600px] flex-1 overflow-hidden">
        <section className="z-10 flex min-w-0 flex-1 flex-col overflow-hidden border border-outline-variant/30 bg-glass-fill-light shadow-[4px_0_24px_rgba(0,0,0,0.02)] backdrop-blur-[30px] rounded-[28px] m-space-4">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center p-space-8">
              <p className="font-subheadline text-subheadline text-label-secondary">
                Loading incident...
              </p>
            </div>
          ) : null}

          {isError || (!isLoading && !incident) ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-space-4 p-space-8">
              <p className="font-headline text-headline text-label-primary">
                Incident not found.
              </p>
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 rounded-full border border-white/70 bg-white/70 px-space-4 py-2 font-subheadline text-subheadline text-label-primary shadow-sm backdrop-blur-xl transition-colors hover:bg-white"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
            </div>
          ) : null}

          {!isLoading && !isError && incident ? (
            <>
              <IncidentDetailHeader
                incident={incident}
                onDismiss={handleBack}
                dismissIcon="arrow_back"
              />
              <IncidentDetailBody
                incident={incident}
                onPhotoClick={() => setLightboxOpen(true)}
              />
            </>
          ) : null}
        </section>
      </main>

      {lightboxOpen && incident?.photo_url && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={incident.photo_url}
            alt="Incident evidence fullscreen"
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      )}
    </div>
  )
}