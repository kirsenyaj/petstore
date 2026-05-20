import { renderHook, act } from '@testing-library/react'
import useDebouncedValue from '../hooks/useDebouncedValue'

jest.useFakeTimers()

describe('useDebouncedValue', () => {
  test('debounces value', () => {
    const { result, rerender } = renderHook(({ v, d }) => useDebouncedValue(v, d), { initialProps: { v: 'a', d: 200 } })
    expect(result.current).toBe('a')
    rerender({ v: 'ab', d: 200 })
    // still old until timers run
    expect(result.current).toBe('a')
    act(() => jest.runAllTimers())
    expect(result.current).toBe('ab')
  })
})
