import { useCallback, useRef } from 'react'

import { useForceUpdate } from '@/shared/hooks/use-force-update'

export type UseCheckListReturn<T extends Item> = ReturnType<typeof useCheckList<T>>

interface Item {
  id: string | number
  checked?: boolean
}

export function useCheckList<T extends Item>(initialItems: T[]) {
  type IdType = T['id']
  const listRef = useRef<T[]>(initialItems)
  const forceUpdate = useForceUpdate()

  const findItem = useCallback((id: IdType) => listRef.current.find(({ id: _id }) => _id === id), [listRef])

  const findIndex = useCallback((id: IdType) => listRef.current.findIndex(({ id: _id }) => _id === id), [listRef])

  const isChecked = useCallback((id: IdType) => findItem(id)?.checked, [findItem])

  const isAllChecked = useCallback(() => listRef.current.every(({ checked }) => checked), [listRef])

  const set = useCallback(
    (items: T[]) => {
      listRef.current = items
      forceUpdate()
    },
    [forceUpdate],
  )

  const updateItem = useCallback(
    (id: IdType, checked: boolean) => {
      const idx = findIndex(id)
      if (idx > -1) {
        const item = listRef.current[idx]

        if (item?.checked !== checked) {
          const arr = [...listRef.current]
          arr[idx] = { ...item, checked } as T
          set(arr)
        }
      }
    },
    [findIndex, set],
  )

  const toggle = useCallback((id: IdType) => updateItem(id, !isChecked(id)), [isChecked, updateItem])

  const check = useCallback(
    (id: IdType) => {
      updateItem(id, true)
    },
    [updateItem],
  )

  const unCheck = useCallback(
    (id: IdType) => {
      updateItem(id, false)
    },
    [updateItem],
  )

  const toggleAll = useCallback(() => {
    const toggled = !isAllChecked()
    const arr = listRef.current.map((item) => ({ ...item, checked: toggled }))

    set(arr)
  }, [isAllChecked, set])

  const updateAll = useCallback(
    (checked: boolean) => {
      if (listRef.current.every((item) => item.checked === checked)) {
        return
      }
      set(listRef.current.map((item) => ({ ...item, checked })))
    },
    [set],
  )

  const checkAll = useCallback(() => {
    updateAll(true)
  }, [updateAll])

  const unCheckAll = useCallback(() => {
    updateAll(false)
  }, [updateAll])

  const getCheckedList = useCallback(() => {
    return listRef.current.filter((item) => item.checked)
  }, [listRef])

  const getCheckedIds = useCallback(() => {
    return getCheckedList().map(({ id }) => id)
  }, [getCheckedList])

  return {
    list: listRef.current,
    set,
    isChecked,
    isAllChecked,
    check,
    unCheck,
    toggle,
    updateItem,
    toggleAll,
    checkAll,
    unCheckAll,
    updateAll,
    getCheckedList,
    getCheckedIds,
  }
}
