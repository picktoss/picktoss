import { withHOC } from '@/app/hoc/with-page-config'

import { useAuthStore } from '@/features/auth'

import { Button } from '@/shared/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Link, useRouter } from '@/shared/lib/router'

const HomePage = () => {
  const router = useRouter()
  const clearToken = useAuthStore((state) => state.clearToken)

  const handleLogout = () => {
    clearToken()
  }

  return (
    <div className="flex flex-col gap-6 px-10">
      <Button onClick={() => router.push('/search')}>검색</Button>
      <Button onClick={() => router.push('/note/search')}>노트 검색</Button>
      <Button onClick={handleLogout}>로그아웃</Button>
      <Link to="/account">asd</Link>
      <SearchInput />
      <Drawer dismissible>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="full">
          <DrawerHeader>
            <DrawerTitle>다른 폴더로 이동</DrawerTitle>
            <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
          </DrawerHeader>

          <div>
            <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
            <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer modal={false} dismissible={false}>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="lg">
          <DrawerHeader>
            <DrawerTitle>다른 폴더로 이동</DrawerTitle>
            <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
          </DrawerHeader>

          <div>
            <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
            <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="md">
          <DrawerHeader>
            <DrawerTitle>다른 폴더로 이동</DrawerTitle>
            <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
          </DrawerHeader>

          <div>
            <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
            <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="sm">
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>버튼</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: '홈',
})
