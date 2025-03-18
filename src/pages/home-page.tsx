import { withHOC } from '@/app/hoc/with-page-config'

import { Link, useRouter } from '@/shared/lib/router'

const HomePage = () => {
  const router = useRouter()
  router.push('/note', {
    search: {
      sort: 'POPULARITY',
      order: 3,
    },
  })

  return (
    <div className="flex flex-col gap-6 px-10">
      <Link to="/collection/quiz/:collectionId" params={[3]} />
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} onClick={() => router.push('/account')}>
          복습노트 {index + 1}
        </div>
      ))}
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: '홈',
})
